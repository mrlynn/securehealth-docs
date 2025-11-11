# MongoDB Integration with Doctrine ODM

This guide covers the integration of MongoDB with Symfony using Doctrine ODM 2.12+ for SecureHealth's HIPAA-compliant patient management system.

## Overview

SecureHealth uses MongoDB as its primary database with Doctrine MongoDB ODM Bundle 5.x for object-document mapping. This integration provides robust schema management, encryption capabilities, and simplified query operations while maintaining HIPAA compliance.

## Key Components

### Doctrine MongoDB ODM Configuration

```yaml title="config/packages/doctrine_mongodb.yaml"
doctrine_mongodb:
    auto_generate_proxy_classes: true
    auto_generate_hydrator_classes: true
    connections:
        default:
            server: '%env(resolve:MONGODB_URI)%'
            options:
                ssl: true
                authSource: admin
                retryWrites: true
                readPreference: primary
                w: majority
                journal: true
                connectTimeoutMS: 30000
                socketTimeoutMS: 30000
    default_database: '%env(resolve:MONGODB_DB)%'
    document_managers:
        default:
            auto_mapping: true
            mappings:
                App:
                    is_bundle: false
                    type: attribute
                    dir: '%kernel.project_dir%/src/Document'
                    prefix: 'App\Document'
                    alias: App
```

### Auto-Encryption Configuration

SecureHealth uses a compiler pass to dynamically configure MongoDB auto-encryption based on available resources:

```php title="src/DependencyInjection/Compiler/DoctrineAutoEncryptionPass.php"
class DoctrineAutoEncryptionPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        // Check if doctrine_mongodb extension is loaded
        if (!$container->hasExtension('doctrine_mongodb')) {
            return;
        }

        // Read encryption key
        $keyFile = $_ENV['MONGODB_ENCRYPTION_KEY_PATH'] ?? 'docker/encryption.key';
        $masterKeyContent = file_get_contents($keyFile);

        // Check encryption infrastructure availability
        $canEnableEncryption = $this->isEncryptionAvailable();

        if ($canEnableEncryption) {
            // Configure MongoDB client with encryption
            $connectionId = 'doctrine_mongodb.odm.default_connection';
            if ($container->hasDefinition($connectionId)) {
                $definition = $container->getDefinition($connectionId);
                $definition->setFactory([self::class, 'createEncryptedClient']);
                // Set up encryption parameters...
            }
        }
    }

    public static function createEncryptedClient(
        string $serverUri, array $options, array $driverOptions,
        string $keyVaultNamespace, string $keyFilePath
    ): \MongoDB\Client {
        // Initialize MongoDB client with encryption
        // ...
    }
}
```

## Document Models

### Defining Documents with Doctrine ODM

SecureHealth uses PHP 8.x attributes for document mapping with Doctrine ODM:

```php title="src/Document/Patient.php"
namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\ODM\MongoDB\Mapping\Annotations\Encrypt;
use Doctrine\ODM\MongoDB\Mapping\Annotations\EncryptQuery;

#[ODM\Document(collection: 'patients')]
#[ODM\HasLifecycleCallbacks]
class Patient
{
    #[ODM\Id]
    private $id = null;

    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $lastName = null;

    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $firstName = null;

    #[Encrypt(queryType: EncryptQuery::Range)]
    #[ODM\Field(type: 'date')]
    private ?\MongoDB\BSON\UTCDateTime $birthDate = null;

    #[Encrypt]
    #[ODM\Field(type: 'string', nullable: true)]
    private ?string $ssn = null;

    // Other fields, getters and setters...
}
```

### Encryption Support

Doctrine ODM 2.12+ adds native support for MongoDB's Queryable Encryption with three encryption types:

1. **Equality Encryption** (`EncryptQuery::Equality`) - For exact matches
   ```php
   #[Encrypt(queryType: EncryptQuery::Equality)]
   #[ODM\Field(type: 'string')]
   private ?string $email = null;
   ```

2. **Range Encryption** (`EncryptQuery::Range`) - For range queries
   ```php
   #[Encrypt(queryType: EncryptQuery::Range)]
   #[ODM\Field(type: 'date')]
   private ?\MongoDB\BSON\UTCDateTime $birthDate = null;
   ```

3. **Standard Encryption** (no query support) - For high-security fields
   ```php
   #[Encrypt]
   #[ODM\Field(type: 'string')]
   private ?string $medicalNotes = null;
   ```

## Repository Pattern

### Document Repositories

SecureHealth extends Doctrine's `DocumentRepository` for each document type:

```php title="src/Repository/PatientRepository.php"
namespace App\Repository;

use App\Document\Patient;
use App\Service\MongoDBEncryptionService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

class PatientRepository extends DocumentRepository
{
    private MongoDBEncryptionService $encryptionService;

    public function __construct(DocumentManager $dm, MongoDBEncryptionService $encryptionService)
    {
        parent::__construct($dm, $dm->getUnitOfWork(), $dm->getClassMetadata(Patient::class));
        $this->encryptionService = $encryptionService;
    }

    // Standard repository methods...

    public function findByLastName(string $lastName): array
    {
        // Doctrine automatically handles encryption for queryable encrypted fields
        return $this->findBy(['lastName' => $lastName]);
    }

    public function findByBirthDateRange(\DateTime $fromDate, \DateTime $toDate): array
    {
        $fromDateUtc = new \MongoDB\BSON\UTCDateTime($fromDate);
        $toDateUtc = new \MongoDB\BSON\UTCDateTime($toDate);

        // Range query on encrypted field
        return $this->findBy([
            'birthDate' => [
                '$gte' => $fromDateUtc,
                '$lte' => $toDateUtc
            ]
        ]);
    }

    // Methods for non-queryable fields require fetching and filtering in memory
    public function findByCondition(string $condition): array
    {
        $allPatients = $this->findAll();
        return array_filter($allPatients, function(Patient $patient) use ($condition) {
            $diagnosis = $patient->getDiagnosis() ?? [];
            return in_array($condition, $diagnosis);
        });
    }
}
```

## Encryption Service

The `MongoDBEncryptionService` provides additional encryption functionality beyond what's handled by Doctrine:

```php title="src/Service/MongoDBEncryptionService.php"
namespace App\Service;

use MongoDB\Client;
use MongoDB\Driver\ClientEncryption;
use MongoDB\BSON\Binary;

class MongoDBEncryptionService
{
    private $client;
    private $clientEncryption;
    private $keyVaultNamespace;

    // Constructor and initialization...

    public function encrypt(string $documentType, string $fieldName, $value)
    {
        // Skip if null, encryption unavailable, or field not configured
        if ($value === null || !$this->isEncryptionAvailable()) {
            return $value;
        }

        try {
            // Get or create data key
            $keyAltName = 'hipaa_encryption_key';
            $dataKeyId = $this->getOrCreateDataKey($keyAltName);

            // Use appropriate encryption algorithm based on query type
            $isEquality = $this->isEqualityField($documentType, $fieldName);

            if ($isEquality) {
                return $this->clientEncryption->encrypt($value, [
                    'algorithm' => ClientEncryption::ALGORITHM_INDEXED,
                    'keyId' => $dataKeyId,
                    'queryType' => 'equality',
                    'contentionFactor' => 8,
                ]);
            }

            return $this->clientEncryption->encrypt($value, [
                'algorithm' => ClientEncryption::ALGORITHM_UNINDEXED,
                'keyId' => $dataKeyId,
            ]);
        } catch (\Exception $e) {
            // Log error and throw
        }
    }

    public function decrypt($value)
    {
        // Skip if not encrypted
        if (!$value instanceof Binary || $value->getType() !== 6) {
            return $value;
        }

        try {
            return $this->clientEncryption->decrypt($value);
        } catch (\Exception $e) {
            // Log error and return placeholder
            return '[Encrypted data]';
        }
    }

    // Helper methods...
}
```

## Query Patterns

### Basic Queries

```php
// Find by ID
$patient = $patientRepository->find($id);

// Find by equality on encrypted field
$patients = $patientRepository->findBy(['firstName' => 'John']);

// Find by range on encrypted date field
$patients = $patientRepository->findByBirthDateRange(
    new \DateTime('1990-01-01'),
    new \DateTime('2000-12-31')
);
```

### Complex Queries with the Query Builder

```php
$queryBuilder = $patientRepository->createQueryBuilder();

$patients = $queryBuilder
    ->field('lastName')->equals('Smith')
    ->field('birthDate')->gte(new \MongoDB\BSON\UTCDateTime(new \DateTime('1990-01-01')))
    ->field('birthDate')->lte(new \MongoDB\BSON\UTCDateTime(new \DateTime('2000-12-31')))
    ->sort('createdAt', 'desc')
    ->limit(20)
    ->getQuery()
    ->execute();
```

### Aggregation Framework

```php
$aggregationBuilder = $patientRepository->createAggregationBuilder();

$result = $aggregationBuilder
    ->match()
        ->field('insurance.provider')->equals('Blue Cross')
    ->group()
        ->field('id')->expression('$birthDate')
        ->field('count')->sum(1)
    ->sort(['count' => 'desc'])
    ->execute();
```

## Lifecycle Callbacks

Doctrine ODM supports document lifecycle callbacks:

```php
#[ODM\PrePersist]
#[ODM\PreUpdate]
public function beforeSave(): void
{
    // Handle conversion of dates to MongoDB format
    if ($this->birthDate instanceof \DateTimeInterface && !($this->birthDate instanceof \MongoDB\BSON\UTCDateTime)) {
        $this->birthDate = new \MongoDB\BSON\UTCDateTime($this->birthDate);
    }

    // Set updated timestamp
    $this->updatedAt = new \MongoDB\BSON\UTCDateTime();
}

#[ODM\PostLoad]
public function afterLoad(): void
{
    // Handle data post-processing after loading from database
    if ($this->notesHistoryJson) {
        $this->notesHistory = json_decode($this->notesHistoryJson, true);
    }
}
```

## Best Practices

### Encryption Best Practices

1. **Use the right encryption type**:
   - `EncryptQuery::Equality` for exact match queries
   - `EncryptQuery::Range` for range queries
   - Standard encryption (no query) for sensitive fields that don't need queries

2. **Handle Binary objects**:
   - Check for `Binary` objects in getters to handle decryption failures
   - Provide fallback values when decryption fails

3. **Protect encryption keys**:
   - Store the master key securely
   - Use the key vault for data encryption keys
   - Implement proper key rotation policies

### Performance Best Practices

1. **Indexing**:
   - Create appropriate indexes for encrypted fields
   - Use compound indexes for frequently combined fields
   - Monitor index usage and performance

2. **Batch operations**:
   - Use batch inserts/updates for large data sets
   - Implement pagination for large result sets

3. **Connection pooling**:
   - Configure appropriate connection pool size
   - Monitor connection usage

## Troubleshooting

### Common Issues

1. **Binary objects in results**:
   - Ensure encryption service is properly initialized
   - Check for encryption setup issues
   - Handle Binary objects in getters with robust type checking

2. **Query failures on encrypted fields**:
   - Verify field is configured with correct encryption type
   - Check that query matches the encryption type capability
   - Use manual filtering for non-queryable encrypted fields

3. **Encryption infrastructure issues**:
   - Verify crypt_shared library is installed
   - Check for mongocryptd availability
   - Ensure key vault is properly configured

## Related Resources

- [MongoDB Doctrine ODM Documentation](https://www.doctrine-project.org/projects/doctrine-mongodb-odm/en/latest/index.html)
- [Doctrine MongoDB Bundle](https://www.doctrine-project.org/projects/doctrine-mongodb-bundle/en/latest/index.html)
- [MongoDB Queryable Encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/)
- [Symfony Documentation](https://symfony.com/doc/current/index.html)