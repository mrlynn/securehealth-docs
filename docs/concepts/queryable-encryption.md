# MongoDB 8.2 Queryable Encryption

MongoDB 8.2 Queryable Encryption is a powerful feature that allows you to perform queries on encrypted data without decrypting it first. This technology is crucial for building HIPAA-compliant healthcare applications where data privacy and security are paramount.

:::info MongoDB 8.2 Features
This implementation leverages the latest MongoDB 8.2 Queryable Encryption capabilities including enhanced performance, improved key management, and expanded search functionality.
:::

## What is Queryable Encryption?

:::success Key Capabilities
- **Search encrypted data** without decrypting it
- **Perform range queries** on encrypted numeric and date fields
- **Maintain data privacy** while preserving functionality
- **Meet compliance requirements** for data protection
- **Client-side encryption** with key management
- **Search on encrypted data** without decryption
:::

## Encryption Service Architecture

The core of our encryption implementation is the `MongoDBEncryptionService` class, which manages all encryption operations and integrates seamlessly with Symfony's dependency injection system. This service provides a comprehensive solution for field-level encryption with different algorithms based on data sensitivity and query requirements.

```php title="MongoDBEncryptionService.php"
class MongoDBEncryptionService
{
    // MongoDB 8.2 Queryable Encryption algorithms
    const ALGORITHM_DETERMINISTIC = 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic';
    const ALGORITHM_RANDOM = 'AEAD_AES_256_CBC_HMAC_SHA_512-Random';
    const ALGORITHM_RANGE = 'range'; // MongoDB 8.2 range encryption
    const ALGORITHM_EQUALITY = 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic';
    
    public function __construct(
        ParameterBagInterface $params,
        LoggerInterface $logger
    ) {
        // Initialize MongoDB 8.2 client with Queryable Encryption
        $this->client = new Client($mongoUrl, $this->getEncryptionOptions());
        $this->clientEncryption = $this->createClientEncryption();
        $this->configureEncryptedFieldsDefinitions();
    }
}
```

## Field-Level Encryption Configuration

SecureHealth implements a sophisticated field-level encryption strategy that balances security with functionality. Each field is encrypted using the most appropriate algorithm based on its sensitivity and query requirements:

:::tip Deterministic Searchable Fields
- **lastName**: Patient last names for search
- **firstName**: Patient first names for search  
- **email**: Email addresses for authentication
- **phoneNumber**: Phone numbers for contact
- **birthDate**: Date of birth for age calculations

*Enables exact match searches on encrypted data*
:::

:::info Range Numeric/Date Fields
- **birthDate**: Range queries for age groups
- **age ranges**: Numeric age comparisons
- **appointment dates**: Date range queries
- **lab values**: Numeric range searches

*Enables range queries on encrypted data*
:::

:::danger Standard Highly Sensitive
- **ssn**: Social Security Numbers
- **diagnosis**: Medical diagnoses
- **medications**: Prescription information
- **insuranceDetails**: Insurance information
- **notes**: Clinical notes and observations

*Maximum security, no query capability*
:::

## Encryption Types

MongoDB Queryable Encryption supports three main encryption types, each optimized for different use cases:

### 1. Deterministic Encryption (D)

:::success Purpose
Enables exact match queries on encrypted data
:::

**Use Cases**: Patient names, IDs, email addresses  
**Trade-off**: Slightly less secure but searchable

```javascript title="Deterministic Encryption Configuration"
// Configuration example
{
  "firstName": {
    "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
    "keyId": "patient-name-key"
  },
  "patientId": {
    "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic", 
    "keyId": "patient-id-key"
  }
}
```

**Example Query**:
```javascript
// This query works on encrypted data
db.patients.find({ firstName: "John" })
```

### 2. Range Encryption (R)

**Purpose**: Enables range queries on encrypted numeric and date fields
**Use Cases**: Dates of birth, appointment dates, lab values
**Trade-off**: Balanced security and functionality

```javascript
// Configuration example
{
  "dateOfBirth": {
    "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
    "range": {
      "min": new Date("1900-01-01").getTime(),
      "max": new Date("2100-12-31").getTime(),
      "sparsity": 1
    }
  },
  "appointmentDate": {
    "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
    "range": {
      "min": new Date("2020-01-01").getTime(),
      "max": new Date("2030-12-31").getTime(),
      "sparsity": 1
    }
  }
}
```

**Example Query**:
```javascript
// Range queries work on encrypted data
db.patients.find({ 
  dateOfBirth: { 
    $gte: new Date("1990-01-01"),
    $lte: new Date("2000-12-31")
  }
})
```

### 3. Standard Encryption (S)

**Purpose**: Maximum security for highly sensitive data
**Use Cases**: Social Security Numbers, detailed medical notes
**Trade-off**: Highest security but not queryable

```javascript
// Configuration example
{
  "ssn": {
    "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
    "keyId": "ssn-key"
  },
  "medicalNotes": {
    "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
    "keyId": "notes-key"
  }
}
```

**Note**: Standard encrypted fields cannot be queried directly. You must decrypt them in your application.

## Implementation in SecureHealth

### Patient Document Structure

```javascript
// Example patient document with encrypted fields
{
  "_id": ObjectId("..."),
  "patientId": "PAT-12345", // Deterministic encryption
  "firstName": "John", // Deterministic encryption
  "lastName": "Doe", // Deterministic encryption
  "dateOfBirth": ISODate("1990-05-15"), // Range encryption
  "ssn": "123-45-6789", // Standard encryption
  "email": "john.doe@email.com", // Deterministic encryption
  "phone": "+1-555-123-4567", // Deterministic encryption
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "medicalHistory": "Patient has diabetes...", // Standard encryption
  "appointments": [
    {
      "date": ISODate("2024-01-15"), // Range encryption
      "doctor": "Dr. Smith",
      "notes": "Regular checkup" // Standard encryption
    }
  ],
  "createdAt": ISODate("2024-01-01"),
  "updatedAt": ISODate("2024-01-15")
}
```

### Encryption Configuration

```javascript
// MongoDB Queryable Encryption schema
const encryptionSchema = {
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
      "lastName": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "dateOfBirth": {
        "encrypt": {
          "bsonType": "date",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "ssn": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "medicalHistory": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
}
```

## Key Management

### Encryption Keys

MongoDB Queryable Encryption uses a key management system where:

- **Master Key**: Used to encrypt data encryption keys (DEKs)
- **Data Encryption Keys (DEKs)**: Used to encrypt actual data
- **Key Vault**: Stores encrypted DEKs
- **Key Rotation**: Regular key rotation for enhanced security

### Key Configuration

```javascript
// Key vault configuration
const keyVaultNamespace = "encryption.__keyVault";

// Create encryption key
const keyId = new Binary(Buffer.from("your-32-byte-key"), 4);

// Configure client with encryption
const client = new MongoClient(uri, {
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders: {
      local: {
        key: keyId
      }
    },
    schemaMap: encryptionSchema
  }
});
```

## Query Patterns

### Deterministic Encryption Queries

```javascript
// Exact match queries work
db.patients.find({ firstName: "John" })
db.patients.find({ patientId: "PAT-12345" })
db.patients.find({ email: "john.doe@email.com" })

// Multiple field queries
db.patients.find({ 
  firstName: "John",
  lastName: "Doe"
})
```

### Range Encryption Queries

```javascript
// Date range queries
db.patients.find({
  dateOfBirth: {
    $gte: new Date("1990-01-01"),
    $lte: new Date("2000-12-31")
  }
})

// Appointment date queries
db.patients.find({
  "appointments.date": {
    $gte: new Date("2024-01-01"),
    $lt: new Date("2024-02-01")
  }
})
```

### Standard Encryption Limitations

```javascript
// These queries will NOT work on standard encrypted fields
db.patients.find({ ssn: "123-45-6789" }) // ❌ Not supported
db.patients.find({ medicalHistory: /diabetes/ }) // ❌ Not supported

// Instead, you must decrypt in your application
const patients = await db.patients.find({}).toArray();
const filteredPatients = patients.filter(patient => 
  decrypt(patient.ssn) === "123-45-6789"
);
```

## Performance Considerations

### Indexing Strategy

```javascript
// Create indexes on encrypted fields for better performance
db.patients.createIndex({ firstName: 1 })
db.patients.createIndex({ lastName: 1 })
db.patients.createIndex({ dateOfBirth: 1 })
db.patients.createIndex({ "appointments.date": 1 })
```

### Query Optimization

1. **Use Deterministic Encryption** for frequently searched fields
2. **Use Range Encryption** for date/numeric queries
3. **Use Standard Encryption** only for highly sensitive, rarely queried data
4. **Create appropriate indexes** on encrypted fields
5. **Limit result sets** to improve performance

## Security Best Practices

### 1. Key Management

- **Separate Keys**: Use different keys for different data types
- **Key Rotation**: Regularly rotate encryption keys
- **Secure Storage**: Store keys in MongoDB Atlas Key Vault
- **Access Control**: Limit key access to authorized personnel

### 2. Schema Design

- **Minimize Deterministic Fields**: Only use for necessary searches
- **Appropriate Encryption Types**: Choose the right type for each field
- **Field Separation**: Separate sensitive and non-sensitive data
- **Document Structure**: Design documents for encryption efficiency

### 3. Application Security

- **Client-Side Encryption**: Encrypt data before sending to database
- **Server-Side Validation**: Validate encrypted data on the server
- **Access Control**: Implement proper role-based access control
- **Audit Logging**: Log all access to encrypted data

## Common Use Cases in Healthcare

### Patient Search

```javascript
// Search by patient name (deterministic encryption)
const patients = await db.patients.find({
  $or: [
    { firstName: searchTerm },
    { lastName: searchTerm }
  ]
}).toArray();
```

### Appointment Scheduling

```javascript
// Find available appointment slots (range encryption)
const appointments = await db.appointments.find({
  date: {
    $gte: startDate,
    $lte: endDate
  },
  status: "available"
}).toArray();
```

### Medical Records

```javascript
// Retrieve patient medical history (standard encryption)
const patient = await db.patients.findOne({ patientId: "PAT-12345" });
const medicalHistory = decrypt(patient.medicalHistory);
```

## Troubleshooting

### Common Issues

**Query Returns No Results**
- Check if field is using deterministic or range encryption
- Verify encryption configuration is correct
- Ensure proper key management setup

**Performance Issues**
- Create indexes on encrypted fields
- Use appropriate encryption types
- Optimize query patterns

**Key Management Errors**
- Verify key vault configuration
- Check key permissions
- Ensure proper key rotation

## Next Steps

- **[Role-Based Access Control](/docs/concepts/role-based-access)** - Understand access management
- **[Audit Logging](/docs/concepts/audit-logging)** - Learn about compliance logging
- **[Security Architecture](/docs/concepts/security-architecture)** - Overall security design
- **[Tutorials](/docs/tutorials/encryption-setup)** - Step-by-step implementation guides
