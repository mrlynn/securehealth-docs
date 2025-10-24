# Encryption Setup Tutorial

This tutorial walks you through setting up MongoDB Queryable Encryption for SecureHealth, including key management, schema configuration, and testing.

:::info Prerequisites
- MongoDB Atlas cluster (M10 or higher)
- Node.js 18+ and npm
- PHP 8.1+ with MongoDB extension
- Composer
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
4. Configure field-level encryption rules

## Step 2: Environment Configuration

Create a `.env` file:

```env title="Environment Configuration"
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securehealth
ENCRYPTION_KEY_ID=your-key-id
ENCRYPTION_KEY_VAULT_NAMESPACE=encryption.__keyVault
ENCRYPTION_MASTER_KEY=your-master-key-base64
```

## Step 3: Encryption Schema

Create `config/encryption-schema.json`:

```json title="Encryption Schema Configuration"
{
  "securehealth.patients": {
    "bsonType": "object",
    "encryptMetadata": {
      "keyId": "/keyId",
      "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    },
    "properties": {
      "patientId": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "firstName": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "ssn": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
}
```

## Step 4: PHP Implementation

Create the encryption service:

```php
<?php

namespace App\Service;

use MongoDB\Client;
use MongoDB\Driver\Manager;

class MongoDBEncryptionService
{
    private Manager $manager;
    private array $encryptionSchema;

    public function __construct(string $connectionString, array $encryptionSchema)
    {
        $this->encryptionSchema = $encryptionSchema;
        
        $this->manager = new Manager($connectionString, [
            'autoEncryption' => [
                'keyVaultNamespace' => $_ENV['ENCRYPTION_KEY_VAULT_NAMESPACE'],
                'kmsProviders' => [
                    'local' => [
                        'key' => base64_decode($_ENV['ENCRYPTION_MASTER_KEY'])
                    ]
                ],
                'schemaMap' => $encryptionSchema
            ]
        ]);
    }

    public function createPatient(array $patientData): string
    {
        $bulk = new BulkWrite();
        $bulk->insert($patientData);
        
        $result = $this->manager->executeBulkWrite('securehealth.patients', $bulk);
        
        return (string) $result->getInsertedIds()[0];
    }

    public function findPatient(string $patientId): ?array
    {
        $query = new Query(['patientId' => $patientId]);
        $cursor = $this->manager->executeQuery('securehealth.patients', $query);
        
        $results = $cursor->toArray();
        return empty($results) ? null : (array) $results[0];
    }
}
```

## Step 5: Testing

Create a test script:

```php
<?php

require_once 'vendor/autoload.php';

use App\Service\MongoDBEncryptionService;

$encryptionSchema = json_decode(file_get_contents('config/encryption-schema.json'), true);
$encryptionService = new MongoDBEncryptionService($_ENV['MONGODB_URI'], $encryptionSchema);

// Test patient creation
$patientData = [
    'patientId' => 'PAT-12345',
    'firstName' => 'John',
    'lastName' => 'Doe',
    'ssn' => '123-45-6789'
];

$patientId = $encryptionService->createPatient($patientData);
echo "Patient created with ID: $patientId\n";

// Test patient retrieval
$patient = $encryptionService->findPatient('PAT-12345');
if ($patient) {
    echo "Patient found: " . $patient['firstName'] . " " . $patient['lastName'] . "\n";
} else {
    echo "Patient not found\n";
}
```

## Step 6: Verification

Run the test script:

```bash
php test-encryption.php
```

Expected output:
```
Patient created with ID: 507f1f77bcf86cd799439011
Patient found: John Doe
```

## Troubleshooting

### Common Issues

**Connection Errors**
- Verify MongoDB URI format
- Check network access settings
- Ensure database user has proper permissions

**Encryption Errors**
- Verify encryption key configuration
- Check key vault namespace
- Ensure schema matches document structure

**Performance Issues**
- Create appropriate indexes
- Use connection pooling
- Monitor query performance

## Next Steps

- **[Adding Roles Tutorial](/docs/tutorials/adding-roles)** - Extending the role system
- **[Custom Fields Tutorial](/docs/tutorials/custom-fields)** - Adding encrypted fields
- **[Audit Customization Tutorial](/docs/tutorials/audit-customization)** - Custom audit logging
