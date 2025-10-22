# Database Schema

SecureHealth uses MongoDB with Queryable Encryption to store patient data securely. This guide covers the complete database schema, document structures, and indexing strategies.

## Database Overview

**Database Name**: `securehealth`
**MongoDB Version**: 6.0+
**Encryption**: Queryable Encryption (CSFLE)
**Hosting**: MongoDB Atlas

## Collections

### Patients Collection

**Collection Name**: `patients`
**Purpose**: Store patient information and medical records

#### Document Structure

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "patientId": "PAT-12345", // Deterministic encryption
  "firstName": "John", // Deterministic encryption
  "lastName": "Doe", // Deterministic encryption
  "dateOfBirth": ISODate("1990-05-15T00:00:00Z"), // Range encryption
  "ssn": "123-45-6789", // Standard encryption
  "email": "john.doe@email.com", // Deterministic encryption
  "phone": "+1-555-123-4567", // Deterministic encryption
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "demographics": {
    "gender": "Male",
    "race": "Caucasian",
    "ethnicity": "Non-Hispanic",
    "maritalStatus": "Married",
    "language": "English"
  },
  "insurance": {
    "primary": {
      "provider": "Blue Cross Blue Shield",
      "policyNumber": "BC123456789",
      "groupNumber": "GRP001",
      "subscriberId": "SUB123456",
      "effectiveDate": ISODate("2024-01-01T00:00:00Z"),
      "expirationDate": ISODate("2024-12-31T23:59:59Z")
    },
    "secondary": {
      "provider": "Medicare",
      "policyNumber": "MED987654321",
      "effectiveDate": ISODate("2024-01-01T00:00:00Z"),
      "expirationDate": ISODate("2024-12-31T23:59:59Z")
    }
  },
  "medicalHistory": "Patient has diabetes type 2, diagnosed in 2020. Currently managed with Metformin. No known allergies. Family history of diabetes.", // Standard encryption
  "allergies": [
    {
      "allergen": "Penicillin",
      "reaction": "Rash",
      "severity": "Moderate",
      "notes": "Contact dermatitis"
    }
  ],
  "diagnoses": [
    {
      "condition": "Diabetes Type 2",
      "icd10Code": "E11.9",
      "diagnosedDate": ISODate("2020-03-15T00:00:00Z"),
      "status": "Active",
      "notes": "Well controlled with medication",
      "diagnosedBy": "Dr. Smith"
    }
  ],
  "labResults": [
    {
      "id": "lab_123",
      "testDate": ISODate("2024-01-15T00:00:00Z"), // Range encryption
      "testType": "Blood Glucose",
      "result": "150 mg/dL",
      "normalRange": "70-100 mg/dL",
      "status": "High",
      "notes": "Patient fasting",
      "labName": "LabCorp",
      "orderedBy": "Dr. Smith"
    }
  ],
  "prescriptions": [
    {
      "id": "prescription_123",
      "medication": "Metformin",
      "ndc": "12345-678-90",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "startDate": ISODate("2024-01-01T00:00:00Z"), // Range encryption
      "endDate": ISODate("2024-12-31T23:59:59Z"), // Range encryption
      "status": "Active",
      "prescribedBy": "Dr. Smith",
      "pharmacy": "CVS Pharmacy",
      "instructions": "Take with food",
      "refillsRemaining": 5
    }
  ],
  "appointments": [
    {
      "id": "appointment_123",
      "date": ISODate("2024-01-15T00:00:00Z"), // Range encryption
      "time": "10:00",
      "duration": 30,
      "type": "Follow-up",
      "status": "Completed",
      "doctor": "Dr. Smith",
      "notes": "Regular checkup", // Standard encryption
      "vitalSigns": {
        "bloodPressure": "120/80",
        "heartRate": 72,
        "temperature": 98.6,
        "weight": 180,
        "height": 70
      }
    }
  ],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1-555-987-6543",
    "email": "jane.doe@email.com"
  },
  "preferences": {
    "communicationMethod": "Email",
    "appointmentReminders": true,
    "language": "English",
    "timezone": "America/Los_Angeles"
  },
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z"),
  "createdBy": "user_123",
  "updatedBy": "user_123"
}
```

#### Indexes

```javascript
// Primary indexes
db.patients.createIndex({ "patientId": 1 }, { unique: true })
db.patients.createIndex({ "firstName": 1, "lastName": 1 })
db.patients.createIndex({ "dateOfBirth": 1 })
db.patients.createIndex({ "email": 1 }, { unique: true })

// Range query indexes
db.patients.createIndex({ "appointments.date": 1 })
db.patients.createIndex({ "labResults.testDate": 1 })
db.patients.createIndex({ "prescriptions.startDate": 1 })

// Compound indexes
db.patients.createIndex({ "firstName": 1, "lastName": 1, "dateOfBirth": 1 })
db.patients.createIndex({ "insurance.primary.provider": 1, "insurance.primary.policyNumber": 1 })

// Text search index
db.patients.createIndex({ "firstName": "text", "lastName": "text", "patientId": "text" })
```

### Users Collection

**Collection Name**: `users`
**Purpose**: Store user accounts and authentication information

#### Document Structure

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "email": "doctor@securehealth.dev",
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "password": "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Hashed password
  "roles": ["ROLE_DOCTOR"],
  "department": "Cardiology",
  "isActive": true,
  "isEmailVerified": true,
  "lastLogin": ISODate("2024-01-15T10:30:00Z"),
  "loginAttempts": 0,
  "lockedUntil": null,
  "passwordResetToken": null,
  "passwordResetExpires": null,
  "emailVerificationToken": null,
  "emailVerificationExpires": null,
  "preferences": {
    "timezone": "America/Los_Angeles",
    "language": "English",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  },
  "profile": {
    "title": "MD",
    "specialty": "Cardiology",
    "licenseNumber": "MD123456",
    "phone": "+1-555-123-4567",
    "office": "Main Office"
  },
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z"),
  "createdBy": "admin_123",
  "updatedBy": "admin_123"
}
```

#### Indexes

```javascript
// Primary indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "roles": 1 })
db.users.createIndex({ "department": 1 })
db.users.createIndex({ "isActive": 1 })

// Authentication indexes
db.users.createIndex({ "passwordResetToken": 1 })
db.users.createIndex({ "emailVerificationToken": 1 })
db.users.createIndex({ "lockedUntil": 1 })

// Compound indexes
db.users.createIndex({ "roles": 1, "isActive": 1 })
db.users.createIndex({ "department": 1, "isActive": 1 })
```

### AuditLogs Collection

**Collection Name**: `audit_logs`
**Purpose**: Store comprehensive audit trail for compliance

#### Document Structure

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "timestamp": ISODate("2024-01-15T10:30:00Z"),
  "user": {
    "id": "user_123",
    "email": "doctor@securehealth.dev",
    "role": "ROLE_DOCTOR",
    "department": "Cardiology"
  },
  "action": "VIEW_PATIENT",
  "category": "DATA_ACCESS",
  "resource": {
    "type": "Patient",
    "id": "patient_123",
    "patientId": "PAT-12345"
  },
  "request": {
    "method": "GET",
    "url": "/api/patients/PAT-12345",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "sessionId": "session_abc123",
    "requestId": "req_123456"
  },
  "result": {
    "status": "SUCCESS",
    "httpCode": 200,
    "responseTime": 150,
    "dataAccessed": ["firstName", "lastName", "medicalHistory"]
  },
  "compliance": {
    "hipaaCompliant": true,
    "auditRequired": true,
    "retentionPeriod": "7_years",
    "dataClassification": "PHI"
  },
  "encryptedDetails": "encrypted_data_here", // Standard encryption
  "createdAt": ISODate("2024-01-15T10:30:00Z")
}
```

#### Indexes

```javascript
// Primary indexes
db.audit_logs.createIndex({ "timestamp": 1 })
db.audit_logs.createIndex({ "user.id": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "action": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "resource.patientId": 1, "timestamp": 1 })

// Compliance indexes
db.audit_logs.createIndex({ "compliance.hipaaCompliant": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "compliance.dataClassification": 1, "timestamp": 1 })

// Performance indexes
db.audit_logs.createIndex({ "request.ipAddress": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "result.status": 1, "timestamp": 1 })

// Compound indexes
db.audit_logs.createIndex({ "user.id": 1, "action": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "resource.type": 1, "resource.id": 1, "timestamp": 1 })

// TTL index for automatic cleanup
db.audit_logs.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 220752000 }) // 7 years
```

### Appointments Collection

**Collection Name**: `appointments`
**Purpose**: Store appointment scheduling information

#### Document Structure

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "appointmentId": "APT-12345",
  "patientId": "patient_123",
  "patientName": "John Doe",
  "doctorId": "doctor_456",
  "doctorName": "Dr. Smith",
  "date": ISODate("2024-01-15T00:00:00Z"), // Range encryption
  "time": "10:00",
  "duration": 30,
  "type": "Follow-up",
  "status": "Scheduled",
  "notes": "Regular checkup", // Standard encryption
  "vitalSigns": {
    "bloodPressure": "120/80",
    "heartRate": 72,
    "temperature": 98.6,
    "weight": 180,
    "height": 70
  },
  "diagnosis": "Diabetes Type 2 - Well controlled",
  "treatment": "Continue Metformin, monitor blood sugar",
  "followUp": {
    "required": true,
    "date": ISODate("2024-04-15T00:00:00Z"),
    "reason": "3-month follow-up"
  },
  "billing": {
    "insuranceClaimed": true,
    "copay": 25.00,
    "totalCost": 150.00,
    "insuranceCoverage": 125.00
  },
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z"),
  "createdBy": "user_123",
  "updatedBy": "user_123"
}
```

#### Indexes

```javascript
// Primary indexes
db.appointments.createIndex({ "appointmentId": 1 }, { unique: true })
db.appointments.createIndex({ "patientId": 1, "date": 1 })
db.appointments.createIndex({ "doctorId": 1, "date": 1 })
db.appointments.createIndex({ "date": 1, "time": 1 })
db.appointments.createIndex({ "status": 1 })

// Range query indexes
db.appointments.createIndex({ "date": 1 })
db.appointments.createIndex({ "followUp.date": 1 })

// Compound indexes
db.appointments.createIndex({ "patientId": 1, "status": 1, "date": 1 })
db.appointments.createIndex({ "doctorId": 1, "status": 1, "date": 1 })
db.appointments.createIndex({ "type": 1, "status": 1, "date": 1 })
```

### MedicalKnowledge Collection

**Collection Name**: `medical_knowledge`
**Purpose**: Store medical knowledge base and drug information

#### Document Structure

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "type": "drug",
  "name": "Metformin",
  "genericName": "Metformin Hydrochloride",
  "ndc": "12345-678-90",
  "category": "Antidiabetic",
  "description": "Biguanide antidiabetic agent",
  "indications": [
    "Type 2 diabetes mellitus",
    "Polycystic ovary syndrome"
  ],
  "contraindications": [
    "Severe renal impairment",
    "Metabolic acidosis",
    "Hypersensitivity to metformin"
  ],
  "sideEffects": [
    "Nausea",
    "Diarrhea",
    "Abdominal pain",
    "Metallic taste"
  ],
  "dosage": {
    "adult": "500-2000mg daily",
    "pediatric": "Not recommended under 10 years",
    "elderly": "Reduce dose in renal impairment"
  },
  "interactions": [
    {
      "drug": "Warfarin",
      "effect": "Increased bleeding risk",
      "severity": "Moderate"
    }
  ],
  "pregnancy": "Category B",
  "lactation": "Compatible",
  "monitoring": [
    "Renal function",
    "Blood glucose",
    "B12 levels"
  ],
  "lastUpdated": ISODate("2024-01-01T00:00:00Z"),
  "source": "FDA",
  "version": "1.0"
}
```

#### Indexes

```javascript
// Primary indexes
db.medical_knowledge.createIndex({ "type": 1 })
db.medical_knowledge.createIndex({ "name": 1 })
db.medical_knowledge.createIndex({ "genericName": 1 })
db.medical_knowledge.createIndex({ "ndc": 1 }, { unique: true })

// Search indexes
db.medical_knowledge.createIndex({ "name": "text", "genericName": "text", "description": "text" })
db.medical_knowledge.createIndex({ "category": 1 })
db.medical_knowledge.createIndex({ "indications": 1 })

// Compound indexes
db.medical_knowledge.createIndex({ "type": 1, "category": 1 })
db.medical_knowledge.createIndex({ "type": 1, "name": 1 })
```

## Encryption Schema

### Field-Level Encryption Configuration

```javascript
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
      "email": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "phone": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "medicalHistory": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "labResults": {
        "bsonType": "array",
        "items": {
          "bsonType": "object",
          "properties": {
            "testDate": {
              "encrypt": {
                "bsonType": "date",
                "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
              }
            }
          }
        }
      },
      "prescriptions": {
        "bsonType": "array",
        "items": {
          "bsonType": "object",
          "properties": {
            "startDate": {
              "encrypt": {
                "bsonType": "date",
                "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
              }
            },
            "endDate": {
              "encrypt": {
                "bsonType": "date",
                "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
              }
            }
          }
        }
      },
      "appointments": {
        "bsonType": "array",
        "items": {
          "bsonType": "object",
          "properties": {
            "date": {
              "encrypt": {
                "bsonType": "date",
                "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
              }
            },
            "notes": {
              "encrypt": {
                "bsonType": "string",
                "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
              }
            }
          }
        }
      }
    }
  },
  "securehealth.appointments": {
    "bsonType": "object",
    "encryptMetadata": {
      "keyId": "/keyId",
      "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    },
    "properties": {
      "date": {
        "encrypt": {
          "bsonType": "date",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "notes": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  },
  "securehealth.audit_logs": {
    "bsonType": "object",
    "encryptMetadata": {
      "keyId": "/keyId",
      "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    },
    "properties": {
      "encryptedDetails": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
}
```

## Query Patterns

### Deterministic Encryption Queries

```javascript
// Exact match queries work on deterministically encrypted fields
db.patients.find({ firstName: "John" })
db.patients.find({ lastName: "Doe" })
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
// Date range queries work on range encrypted fields
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

// Lab result date queries
db.patients.find({
  "labResults.testDate": {
    $gte: new Date("2024-01-01"),
    $lte: new Date("2024-01-31")
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

## Performance Optimization

### Indexing Strategy

**Primary Indexes**
- Create indexes on frequently queried fields
- Use compound indexes for multi-field queries
- Consider query patterns when designing indexes

**Encryption-Aware Indexing**
- Index deterministically encrypted fields for search
- Index range encrypted fields for range queries
- Avoid indexing standard encrypted fields

**Performance Monitoring**
- Monitor index usage with MongoDB profiler
- Analyze slow queries and optimize
- Use explain plans to understand query execution

### Query Optimization

**Efficient Queries**
- Use appropriate encryption types for query needs
- Limit result sets with proper filtering
- Use projection to return only needed fields
- Implement pagination for large result sets

**Aggregation Pipelines**
- Use aggregation for complex queries
- Implement proper filtering early in pipeline
- Use indexes to support aggregation operations

## Data Migration

### Migration Strategies

**Schema Evolution**
- Use MongoDB's flexible schema for gradual changes
- Implement backward compatibility for API changes
- Use versioning for document structure changes

**Data Migration**
- Plan migration during maintenance windows
- Test migration scripts thoroughly
- Implement rollback procedures
- Monitor migration progress

### Backup and Recovery

**Backup Strategy**
- Regular automated backups
- Point-in-time recovery capability
- Test backup restoration procedures
- Store backups in secure locations

**Recovery Procedures**
- Document recovery procedures
- Test recovery scenarios
- Train staff on recovery procedures
- Maintain recovery documentation

## Next Steps

- **[Security Implementation](/docs/developer-guides/security-implementation)** - Security patterns
- **[Testing](/docs/developer-guides/testing)** - Testing strategies
- **[Deployment](/docs/developer-guides/deployment)** - Production deployment
- **[Tutorials](/docs/tutorials/encryption-setup)** - Step-by-step implementation guides
