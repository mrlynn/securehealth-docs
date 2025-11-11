# Encryption Setup with Doctrine ODM

This tutorial walks you through setting up MongoDB Queryable Encryption for SecureHealth using Doctrine ODM 2.12+, including environment configuration, document mapping, and testing.

:::info Prerequisites
- MongoDB Atlas cluster (M10 or higher) or MongoDB 7.0+
- PHP 8.2+ with MongoDB extension
- Symfony 7.0+
- Doctrine MongoDB ODM Bundle 5.0+
- libmongo_crypt_v1 shared library
:::

## Step 1: MongoDB Atlas Setup

### Create Cluster
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (M10 or higher recommended)
3. Enable Queryable Encryption
4. Configure network access and database users

### Configure Encryption
1. Navigate to the Encryption section
2. Create a new encryption key
3. Note the Key ID and Key Vault namespace

## Step 2: Install Dependencies

### Install Doctrine MongoDB ODM Bundle

```bash
composer require doctrine/mongodb-odm-bundle
```

### Install crypt_shared Library

#### For MacOS:
```bash
brew tap mongodb/brew
brew install mongosh mongodb-database-tools
brew install libmongocrypt
```

#### For Ubuntu/Debian:
```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update

# Install libmongocrypt
sudo apt-get install -y libmongocrypt-dev
```

## Step 3: Environment Configuration

Create a `.env` file with the following configuration:

```env title=".env"
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securehealth?retryWrites=true&w=majority
MONGODB_DB=securehealth
MONGODB_KEY_VAULT_NAMESPACE=encryption.__keyVault
MONGODB_ENCRYPTION_KEY_PATH=/var/www/html/docker/encryption.key
MONGODB_CRYPT_SHARED_LIB_PATH=/usr/lib/libmongo_crypt_v1.so
```

## Step 4: Configure Doctrine MongoDB ODM

Create or update `config/packages/doctrine_mongodb.yaml`:

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

## Step 5: Create Compiler Pass for Auto-Encryption

Create `src/DependencyInjection/Compiler/DoctrineAutoEncryptionPass.php`:

```php title="DoctrineAutoEncryptionPass.php"
<?php

namespace App\DependencyInjection\Compiler;

use MongoDB\BSON\Binary;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class DoctrineAutoEncryptionPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        // Only process if doctrine_mongodb extension is loaded
        if (!$container->hasExtension('doctrine_mongodb')) {
            return;
        }

        // Get encryption configuration
        $keyFile = $_ENV['MONGODB_ENCRYPTION_KEY_PATH'] ?? 'docker/encryption.key';

        // Ensure encryption key file exists
        if (!file_exists($keyFile)) {
            $keyDir = dirname($keyFile);
            if (!is_dir($keyDir)) {
                mkdir($keyDir, 0755, true);
            }
            file_put_contents($keyFile, random_bytes(96));
        }

        // Validate key length (must be 96 bytes for local KMS)
        $masterKeyContent = file_get_contents($keyFile);

        // Check encryption infrastructure availability
        $cryptSharedLibPath = getenv('MONGODB_CRYPT_SHARED_LIB_PATH') ?: '/usr/lib/libmongo_crypt_v1.so';
        $cryptSharedAvailable = file_exists($cryptSharedLibPath);

        // Only configure encryption if infrastructure is available
        if ($cryptSharedAvailable) {
            // Configure Client connection with encryption
            $connectionId = 'doctrine_mongodb.odm.default_connection';
            if ($container->hasDefinition($connectionId)) {
                $definition = $container->getDefinition($connectionId);
                $serverUri = $_ENV['MONGODB_URI'] ?? '';
                $keyVaultNamespace = $_ENV['MONGODB_KEY_VAULT_NAMESPACE'] ?? 'encryption.__keyVault';

                $definition->setFactory([self::class, 'createEncryptedClient']);
                $definition->setArguments([
                    $serverUri,
                    [], // Options
                    [], // Driver options
                    $keyVaultNamespace,
                    $keyFile,
                ]);
                $definition->setClass(\MongoDB\Client::class);
            }
        }
    }

    public static function createEncryptedClient(
        ?string $serverUri,
        array $originalOptions,
        array $driverOptions,
        string $keyVaultNamespace,
        string $keyFilePath
    ): \MongoDB\Client {
        // Read the key file at runtime
        $masterKeyContent = file_get_contents($keyFilePath);
        $masterKey = new Binary($masterKeyContent, Binary::TYPE_GENERIC);

        // Configure encryption helper
        $cryptSharedLibPath = getenv('MONGODB_CRYPT_SHARED_LIB_PATH') ?: '/usr/lib/libmongo_crypt_v1.so';
        $extraOptions = [
            'cryptSharedLibPath' => $cryptSharedLibPath,
            'cryptSharedLibRequired' => true
        ];

        // Add auto-encryption to options
        $autoEncryptionOptions = [
            'keyVaultNamespace' => $keyVaultNamespace,
            'kmsProviders' => [
                'local' => [
                    'key' => $masterKey
                ]
            ],
            'bypassAutoEncryption' => false,
            'extraOptions' => $extraOptions
        ];

        // Set autoEncryption in driverOptions
        $driverOptions['autoEncryption'] = $autoEncryptionOptions;

        // Create Client with auto-encryption
        return new \MongoDB\Client($serverUri ?? '', $originalOptions, $driverOptions);
    }
}
```

Register the compiler pass in your Kernel:

```php title="src/Kernel.php"
<?php

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

## Step 6: Create Patient Document with Encryption

Create `src/Document/Patient.php`:

```php title="src/Document/Patient.php"
<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\ODM\MongoDB\Mapping\Annotations\Encrypt;
use Doctrine\ODM\MongoDB\Mapping\Annotations\EncryptQuery;
use MongoDB\BSON\Binary;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

#[ODM\Document(collection: 'patients')]
#[ODM\HasLifecycleCallbacks]
class Patient
{
    #[ODM\Id]
    private $id = null;

    /**
     * Patient's last name - queryable encrypted (equality queries)
     */
    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $lastName = null;

    /**
     * Patient's first name - queryable encrypted (equality queries)
     */
    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $firstName = null;

    /**
     * Patient email - queryable encrypted (equality queries)
     */
    #[Encrypt(queryType: EncryptQuery::Equality)]
    #[ODM\Field(type: 'string')]
    private ?string $email = null;

    /**
     * Patient's birth date - queryable encrypted (range queries)
     */
    #[Encrypt(queryType: EncryptQuery::Range)]
    #[ODM\Field(type: 'date')]
    private UTCDateTime|\DateTimeInterface|null $birthDate = null;

    /**
     * Social Security Number - encrypted (no queries supported)
     */
    #[Encrypt]
    #[ODM\Field(type: 'string', nullable: true)]
    private ?string $ssn = null;

    /**
     * Medical diagnosis - encrypted (no queries supported)
     */
    #[Encrypt]
    #[ODM\Field(type: 'collection')]
    private Binary|array|null $diagnosis = [];

    #[ODM\Field(type: 'date')]
    private UTCDateTime|\DateTimeInterface|null $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new UTCDateTime();
        $this->diagnosis = [];
    }

    // Getters and setters

    public function getId()
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        if ($this->firstName instanceof Binary) {
            return null;
        }
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        if ($this->lastName instanceof Binary) {
            return null;
        }
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getEmail(): ?string
    {
        if ($this->email instanceof Binary) {
            return null;
        }
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getBirthDate(): ?UTCDateTime
    {
        if ($this->birthDate instanceof Binary) {
            return null;
        }
        // Always return as UTCDateTime (convert if needed)
        if ($this->birthDate instanceof UTCDateTime) {
            return $this->birthDate;
        }
        if ($this->birthDate instanceof \DateTimeInterface) {
            return new UTCDateTime($this->birthDate);
        }
        return null;
    }

    public function setBirthDate(UTCDateTime|\DateTimeInterface $birthDate): self
    {
        // Convert DateTime to UTCDateTime if needed
        if ($birthDate instanceof \DateTimeInterface && !($birthDate instanceof UTCDateTime)) {
            $this->birthDate = new UTCDateTime($birthDate);
        } else {
            $this->birthDate = $birthDate;
        }
        return $this;
    }

    public function getSsn(): ?string
    {
        if ($this->ssn instanceof Binary) {
            return null;
        }
        return $this->ssn;
    }

    public function setSsn(?string $ssn): self
    {
        $this->ssn = $ssn;
        return $this;
    }

    public function getDiagnosis(): ?array
    {
        if ($this->diagnosis instanceof Binary) {
            return [];
        }
        return $this->diagnosis;
    }

    public function setDiagnosis($diagnosis): self
    {
        $this->diagnosis = $diagnosis;
        return $this;
    }

    public function getCreatedAt(): ?UTCDateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(UTCDateTime|\DateTimeInterface $createdAt): self
    {
        if ($createdAt instanceof \DateTimeInterface && !($createdAt instanceof UTCDateTime)) {
            $this->createdAt = new UTCDateTime($createdAt);
        } else {
            $this->createdAt = $createdAt;
        }
        return $this;
    }

    /**
     * Ensure all date fields are UTCDateTime objects before persist/update
     */
    #[ODM\PrePersist]
    #[ODM\PreUpdate]
    public function prepareDates(): void
    {
        // Ensure birthDate is UTCDateTime
        if ($this->birthDate instanceof \DateTimeInterface && !($this->birthDate instanceof UTCDateTime)) {
            $this->birthDate = new UTCDateTime($this->birthDate);
        }

        // Ensure createdAt is UTCDateTime
        if ($this->createdAt instanceof \DateTimeInterface && !($this->createdAt instanceof UTCDateTime)) {
            $this->createdAt = new UTCDateTime($this->createdAt);
        }
    }
}
```

## Step 7: Create Patient Repository

Create `src/Repository/PatientRepository.php`:

```php title="src/Repository/PatientRepository.php"
<?php

namespace App\Repository;

use App\Document\Patient;
use App\Service\MongoDBEncryptionService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

class PatientRepository extends DocumentRepository
{
    private MongoDBEncryptionService $encryptionService;

    public function __construct(DocumentManager $dm, MongoDBEncryptionService $encryptionService)
    {
        parent::__construct($dm, $dm->getUnitOfWork(), $dm->getClassMetadata(Patient::class));
        $this->encryptionService = $encryptionService;
    }

    /**
     * Find a patient by email
     * Doctrine automatically handles encryption/decryption for queryable encrypted fields
     */
    public function findOneByEmail(string $email): ?Patient
    {
        return $this->findOneBy(['email' => $email]);
    }

    /**
     * Find patients by date range (birth date)
     */
    public function findByBirthDateRange(\DateTime $startDate, \DateTime $endDate): array
    {
        $startDateUtc = new UTCDateTime($startDate);
        $endDateUtc = new UTCDateTime($endDate);

        return $this->findBy([
            'birthDate' => [
                '$gte' => $startDateUtc,
                '$lte' => $endDateUtc
            ]
        ]);
    }

    /**
     * Save a patient (persist and flush)
     * Doctrine automatically handles encryption via #[Encrypt] attributes
     */
    public function save(Patient $patient): void
    {
        $dm = $this->getDocumentManager();

        try {
            // Use Doctrine persist/flush to let auto-encryption handle encrypted fields
            $dm->persist($patient);
            $dm->flush();
        } catch (\Exception $e) {
            // Log error
            throw $e;
        }
    }
}
```

## Step 8: Create Encryption Service

Create `src/Service/MongoDBEncryptionService.php`:

```php title="src/Service/MongoDBEncryptionService.php"
<?php

namespace App\Service;

use MongoDB\Client;
use MongoDB\Driver\ClientEncryption;
use MongoDB\BSON\Binary;
use Psr\Log\LoggerInterface;

class MongoDBEncryptionService
{
    private $client;
    private $clientEncryption;
    private $keyVaultNamespace;
    private $logger;

    public function __construct(
        Client $mongoClient,
        LoggerInterface $logger
    ) {
        $this->client = $mongoClient;
        $this->logger = $logger;

        // Set up key vault namespace for auto encryption
        $this->keyVaultNamespace = $_ENV['MONGODB_KEY_VAULT_NAMESPACE'] ?? 'encryption.__keyVault';

        // Create client encryption using the client
        $this->clientEncryption = $this->createClientEncryption();
    }

    private function createClientEncryption(): ?ClientEncryption
    {
        try {
            // Check if crypt_shared library is available
            $cryptSharedLibPath = getenv('MONGODB_CRYPT_SHARED_LIB_PATH') ?: '/usr/lib/libmongo_crypt_v1.so';
            $cryptSharedAvailable = file_exists($cryptSharedLibPath);

            // Set up client encryption options
            $clientEncryptionOpts = [
                'keyVaultNamespace' => $this->keyVaultNamespace,
                'kmsProviders' => [
                    'local' => [
                        'key' => file_get_contents($_ENV['MONGODB_ENCRYPTION_KEY_PATH'] ?? 'docker/encryption.key')
                    ]
                ]
            ];

            if ($cryptSharedAvailable) {
                $clientEncryptionOpts['extraOptions'] = [
                    'cryptSharedLibPath' => $cryptSharedLibPath
                ];
            }

            $clientEncryption = $this->client->createClientEncryption($clientEncryptionOpts);
            return $clientEncryption;
        } catch (\Exception $e) {
            $this->logger->error('Failed to create client encryption: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if encryption is properly configured and available
     */
    public function isEncryptionAvailable(): bool
    {
        return isset($this->clientEncryption);
    }

    /**
     * Get or create a data encryption key
     */
    public function getOrCreateDataKey(string $keyAltName = 'default_encryption_key'): Binary
    {
        list($keyVaultDb, $keyVaultColl) = explode('.', $this->keyVaultNamespace, 2);
        $keyVaultCollection = $this->client->selectCollection($keyVaultDb, $keyVaultColl);

        // Check if the key already exists
        $existingKey = $keyVaultCollection->findOne(['keyAltNames' => $keyAltName]);

        if ($existingKey) {
            return $existingKey->_id;
        }

        // Create a new data encryption key
        $dataKeyOptions = [
            'keyAltNames' => [$keyAltName]
        ];

        // Create a new key using the local KMS provider
        $keyId = $this->clientEncryption->createDataKey('local', $dataKeyOptions);
        return $keyId;
    }

    /**
     * Decrypt an encrypted value
     */
    public function decrypt($value)
    {
        // If encryption is not available, return value as-is
        if (!$this->isEncryptionAvailable()) {
            return $value;
        }

        // If value is not a Binary object or not encrypted, return as-is
        if (!$value instanceof Binary || $value->getType() !== 6) {
            return $value;
        }

        try {
            return $this->clientEncryption->decrypt($value);
        } catch (\Exception $e) {
            $this->logger->error('Decryption failed: ' . $e->getMessage());
            return '[Encrypted data]';
        }
    }
}
```

## Step 9: Register Services

Update `config/services.yaml` to register your services:

```yaml title="config/services.yaml"
services:
    # Default configuration for services
    _defaults:
        autowire: true
        autoconfigure: true

    # Auto-configure controllers and commands
    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'

    # MongoDB Encryption Service
    App\Service\MongoDBEncryptionService:
        arguments:
            $mongoClient: '@doctrine_mongodb.odm.default_connection'

    # Repositories
    App\Repository\PatientRepository:
        arguments:
            $dm: '@doctrine_mongodb.odm.default_document_manager'
            $encryptionService: '@App\Service\MongoDBEncryptionService'
```

## Step 10: Create Test Controller

Create a test controller to verify the setup:

```php title="src/Controller/PatientController.php"
<?php

namespace App\Controller;

use App\Document\Patient;
use App\Repository\PatientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PatientController extends AbstractController
{
    #[Route('/patient/test', name: 'app_patient_test')]
    public function test(PatientRepository $patientRepository): Response
    {
        try {
            // Create test patient
            $patient = new Patient();
            $patient->setFirstName('John');
            $patient->setLastName('Doe');
            $patient->setEmail('john.doe@example.com');
            $patient->setBirthDate(new \DateTime('1980-01-01'));
            $patient->setSsn('123-45-6789');
            $patient->setDiagnosis(['Hypertension', 'Type 2 Diabetes']);

            // Save patient with encryption
            $patientRepository->save($patient);

            // Retrieve patient by email (encrypted field)
            $retrievedPatient = $patientRepository->findOneByEmail('john.doe@example.com');

            // Test data
            return $this->json([
                'success' => true,
                'message' => 'Patient encrypted and retrieved successfully',
                'patient' => [
                    'id' => $retrievedPatient->getId(),
                    'firstName' => $retrievedPatient->getFirstName(),
                    'lastName' => $retrievedPatient->getLastName(),
                    'email' => $retrievedPatient->getEmail(),
                    'ssn' => $retrievedPatient->getSsn(),
                    'birthDate' => $retrievedPatient->getBirthDate() ?
                        $retrievedPatient->getBirthDate()->toDateTime()->format('Y-m-d') : null,
                    'diagnosis' => $retrievedPatient->getDiagnosis(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
```

## Step 11: Testing the Setup

1. Start the Symfony application:

```bash
symfony server:start
```

2. Open your browser and navigate to:
```
http://localhost:8000/patient/test
```

3. If everything is configured correctly, you should see a JSON response with the encrypted and retrieved patient data.

## Troubleshooting

### Common Issues

**Connection Errors**
- Verify MongoDB URI format
- Check network access settings
- Ensure database user has proper permissions

**Encryption Errors**
- Verify encryption key configuration
- Check key vault namespace
- Ensure crypt_shared library is installed correctly
- Look for MongoDB driver compatibility issues

**Binary Objects in Results**
- Binary objects in getters indicate decryption failures
- Check encryption service initialization
- Ensure Binary handling in getters returns appropriate fallbacks

## Next Steps

- **[Role-Based Access Control](/docs/tutorials/adding-roles)** - Implement role-based security
- **[Patient Document Schema](/docs/developer-guides/database-schema)** - Complete patient document schema
- **[Audit Logging](/docs/tutorials/audit-customization)** - Implement HIPAA-compliant audit logging
- **[Repository Patterns](/docs/developer-guides/mongodb-doctrine-integration)** - Advanced repository patterns