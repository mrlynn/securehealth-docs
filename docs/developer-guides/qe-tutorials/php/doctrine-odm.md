# MongoDB Queryable Encryption with Doctrine ODM

This tutorial demonstrates how to implement Queryable Encryption in PHP using Doctrine MongoDB ODM 2.12+ with Symfony.

## Prerequisites

Before beginning, ensure you have:

- MongoDB Server version 7.0 or later
- [Automatic Encryption Shared Library](https://www.mongodb.com/docs/manual/core/queryable-encryption/install-library/) version 7.0 or later
- PHP 8.2+
- MongoDB PHP Library & Extension version 1.16+
- Symfony 7.0+
- Doctrine MongoDB ODM Bundle 5.0+

## Key Components

### 1. Document Attributes with Encryption

Doctrine ODM 2.12+ adds native support for MongoDB's Queryable Encryption with PHP 8.x attributes. This integration makes field-level encryption seamless to implement:

```php
namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\ODM\MongoDB\Mapping\Annotations\Encrypt;
use Doctrine\ODM\MongoDB\Mapping\Annotations\EncryptQuery;

#[ODM\Document(collection: 'patients')]
class Patient
{
    #[ODM\Id]
    private $id = null;

    // Deterministic encryption for equality queries
    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $lastName = null;

    // Range encryption for date range queries
    #[Encrypt(queryType: EncryptQuery::Range)]
    #[ODM\Field(type: 'date')]
    private ?\MongoDB\BSON\UTCDateTime $birthDate = null;

    // Standard encryption (no query support)
    #[Encrypt]
    #[ODM\Field(type: 'string')]
    private ?string $ssn = null;
}
```

### 2. Encryption Types

Doctrine ODM supports three encryption types:

1. **Equality Encryption** (`EncryptQuery::Equality`): For exact match queries
2. **Range Encryption** (`EncryptQuery::Range`): For range queries (e.g., dates)
3. **Standard Encryption** (no `queryType`): For sensitive fields where querying isn't needed

### 3. Auto-Encryption Configuration

Automatic encryption can be configured during MongoDB client creation:

```php
use MongoDB\BSON\Binary;
use MongoDB\Client;

// Read encryption master key
$masterKeyContent = file_get_contents('path/to/master_key.bin');
$masterKey = new Binary($masterKeyContent, Binary::TYPE_GENERIC);

// Configure extra options
$extraOptions = [
    'cryptSharedLibPath' => '/usr/lib/libmongo_crypt_v1.so',
    'cryptSharedLibRequired' => true
];

// Configure auto-encryption
$autoEncryptionOptions = [
    'keyVaultNamespace' => 'encryption.__keyVault',
    'kmsProviders' => [
        'local' => [
            'key' => $masterKey
        ]
    ],
    'extraOptions' => $extraOptions
];

// Create MongoDB client with encryption
$driverOptions = ['autoEncryption' => $autoEncryptionOptions];
$client = new Client('mongodb://localhost:27017', [], $driverOptions);
```

In a Symfony application with the Doctrine MongoDB Bundle, this is typically done via a compiler pass.

## Implementation Steps

### 1. Install Required Packages

```bash
# Install Doctrine MongoDB ODM Bundle
composer require doctrine/mongodb-odm-bundle

# Install Symfony DotEnv for environment variables
composer require symfony/dotenv
```

### 2. Configure Environment Variables

Create a `.env` file with:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=secure_db
MONGODB_KEY_VAULT_NAMESPACE=encryption.__keyVault
MONGODB_ENCRYPTION_KEY_PATH=/path/to/master_key.bin
MONGODB_CRYPT_SHARED_LIB_PATH=/usr/lib/libmongo_crypt_v1.so
```

### 3. Configure Doctrine MongoDB ODM

Create `config/packages/doctrine_mongodb.yaml`:

```yaml
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

### 4. Create a Custom Client Factory

Create a compiler pass to replace the MongoDB client with one that supports encryption:

```php
namespace App\DependencyInjection\Compiler;

use MongoDB\BSON\Binary;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class DoctrineAutoEncryptionPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        // Check if doctrine_mongodb extension is loaded
        if (!$container->hasExtension('doctrine_mongodb')) {
            return;
        }

        // Configure MongoDB client with encryption
        $connectionId = 'doctrine_mongodb.odm.default_connection';
        if ($container->hasDefinition($connectionId)) {
            $definition = $container->getDefinition($connectionId);
            $arguments = $definition->getArguments();

            $serverUri = $arguments[0] ?? null;
            $options = (count($arguments) >= 2 && is_array($arguments[1])) ? $arguments[1] : [];
            $driverOptions = (count($arguments) >= 3 && is_array($arguments[2])) ? $arguments[2] : [];

            $keyVaultNamespace = $_ENV['MONGODB_KEY_VAULT_NAMESPACE'] ?? 'encryption.__keyVault';
            $keyFilePath = $_ENV['MONGODB_ENCRYPTION_KEY_PATH'] ?? 'path/to/master_key.bin';

            $definition->setFactory([self::class, 'createEncryptedClient']);
            $definition->setArguments([
                $serverUri,
                $options,
                $driverOptions,
                $keyVaultNamespace,
                $keyFilePath,
            ]);
            $definition->setClass(\MongoDB\Client::class);
        }
    }

    public static function createEncryptedClient(
        ?string $serverUri,
        array $options,
        array $driverOptions,
        string $keyVaultNamespace,
        string $keyFilePath
    ): \MongoDB\Client {
        // Read the master key
        $masterKeyContent = file_get_contents($keyFilePath);
        $masterKey = new Binary($masterKeyContent, Binary::TYPE_GENERIC);

        // Configure extra options
        $cryptSharedLibPath = getenv('MONGODB_CRYPT_SHARED_LIB_PATH') ?: '/usr/lib/libmongo_crypt_v1.so';
        $extraOptions = [
            'cryptSharedLibPath' => $cryptSharedLibPath,
            'cryptSharedLibRequired' => true
        ];

        // Auto-encryption configuration
        $autoEncryptionOptions = [
            'keyVaultNamespace' => $keyVaultNamespace,
            'kmsProviders' => [
                'local' => [
                    'key' => $masterKey
                ]
            ],
            'extraOptions' => $extraOptions
        ];

        // Create encrypted client
        $driverOptions['autoEncryption'] = $autoEncryptionOptions;
        return new \MongoDB\Client($serverUri ?? '', $options, $driverOptions);
    }
}
```

### 5. Register the Compiler Pass

Update your kernel:

```php
namespace App;

use App\DependencyInjection\Compiler\DoctrineAutoEncryptionPass;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    protected function build(ContainerBuilder $container): void
    {
        $container->addCompilerPass(new DoctrineAutoEncryptionPass());
    }
}
```

## Using Encrypted Documents

### 1. Define Documents with Encrypted Fields

```php
namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\ODM\MongoDB\Mapping\Annotations\Encrypt;
use Doctrine\ODM\MongoDB\Mapping\Annotations\EncryptQuery;
use MongoDB\BSON\UTCDateTime;

#[ODM\Document(collection: 'patients')]
class Patient
{
    #[ODM\Id]
    private $id;

    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $firstName;

    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $lastName;

    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $email;

    #[Encrypt(queryType: EncryptQuery::Range)]
    #[ODM\Field(type: 'date')]
    private ?UTCDateTime $birthDate;

    #[Encrypt]
    #[ODM\Field(type: 'string')]
    private ?string $ssn;

    #[ODM\Field(type: 'date')]
    private ?UTCDateTime $createdAt;

    public function __construct()
    {
        $this->createdAt = new UTCDateTime();
    }

    // Getters and setters...
}
```

### 2. Create Repository for Encrypted Document

```php
namespace App\Repository;

use App\Document\Patient;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;
use MongoDB\BSON\UTCDateTime;

class PatientRepository extends DocumentRepository
{
    public function __construct(DocumentManager $dm)
    {
        parent::__construct($dm, $dm->getUnitOfWork(), $dm->getClassMetadata(Patient::class));
    }

    // Find by equality-encrypted field
    public function findByEmail(string $email): ?Patient
    {
        return $this->findOneBy(['email' => $email]);
    }

    // Find by range-encrypted field
    public function findByBirthDateRange(\DateTime $start, \DateTime $end): array
    {
        return $this->findBy([
            'birthDate' => [
                '$gte' => new UTCDateTime($start),
                '$lte' => new UTCDateTime($end)
            ]
        ]);
    }
}
```

### 3. Working with Encrypted Documents

```php
// In a controller or service
public function createPatient(
    DocumentManager $dm,
    PatientRepository $patientRepository
): Patient {
    $patient = new Patient();
    $patient->setFirstName('John');
    $patient->setLastName('Doe');
    $patient->setEmail('john@example.com');
    $patient->setBirthDate(new UTCDateTime(new \DateTime('1980-01-01')));
    $patient->setSsn('123-45-6789');

    // Save with auto-encryption
    $dm->persist($patient);
    $dm->flush();

    // Find with auto-decryption
    $foundPatient = $patientRepository->findByEmail('john@example.com');

    return $foundPatient;
}
```

## Query Patterns

### Supported Query Types

1. **Equality Queries** (on fields with `EncryptQuery::Equality`):
   ```php
   $patient = $repository->findOneBy(['email' => 'john@example.com']);
   ```

2. **Range Queries** (on fields with `EncryptQuery::Range`):
   ```php
   $patients = $repository->findBy([
       'birthDate' => [
           '$gte' => new UTCDateTime(new \DateTime('1980-01-01')),
           '$lte' => new UTCDateTime(new \DateTime('1990-01-01'))
       ]
   ]);
   ```

3. **Query Builder with Encrypted Fields**:
   ```php
   $qb = $repository->createQueryBuilder();
   $patients = $qb
       ->field('lastName')->equals('Smith')
       ->field('birthDate')->gte(new UTCDateTime(new \DateTime('1980-01-01')))
       ->getQuery()
       ->execute();
   ```

### Handling Unsupported Queries

For fields encrypted without query support:

```php
// This will NOT work - SSN is encrypted without query support
$patient = $repository->findOneBy(['ssn' => '123-45-6789']);

// Instead, fetch all and filter in memory (when the dataset is small)
$allPatients = $repository->findAll();
$matchedPatient = array_filter($allPatients, function(Patient $patient) {
    return $patient->getSsn() === '123-45-6789';
})[0] ?? null;
```

## Best Practices

### 1. Handle Binary Objects in Getters

When encryption fails or data is not properly decrypted, fields may contain Binary objects. Always check for this in your getters:

```php
public function getFirstName(): ?string
{
    if ($this->firstName instanceof \MongoDB\BSON\Binary) {
        return null; // or a default value
    }
    return $this->firstName;
}
```

### 2. Use Appropriate Encryption Types

- Use `EncryptQuery::Equality` only for fields that need exact matching
- Use `EncryptQuery::Range` only for date or numeric fields requiring range queries
- Use standard encryption (no queryType) for highly sensitive fields

### 3. Performance Considerations

- Create indexes for frequently queried fields
- Avoid querying on fields with standard encryption
- Use batch operations for better performance

### 4. Security Best Practices

- Store the master encryption key securely
- Use MongoDB Atlas Key Management Service in production
- Rotate encryption keys periodically
- Implement proper access controls

## Troubleshooting

### Common Issues

- **Binary objects in results**: Check encryption configuration and key management
- **Field not queryable**: Ensure field has appropriate `queryType` in `Encrypt` attribute
- **Range query not working**: Verify date type is `UTCDateTime` and field has `EncryptQuery::Range`
- **Missing crypt_shared library**: Install the library and set correct path

## Additional Resources

- [MongoDB Queryable Encryption Documentation](https://www.mongodb.com/docs/manual/core/queryable-encryption/)
- [Doctrine MongoDB ODM Documentation](https://www.doctrine-project.org/projects/doctrine-mongodb-odm/en/latest/)
- [MongoDB PHP Driver](https://www.mongodb.com/docs/drivers/php/)
- [Symfony Documentation](https://symfony.com/doc/current/)