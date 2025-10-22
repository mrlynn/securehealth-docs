# Custom Fields Tutorial

This tutorial shows how to add custom encrypted fields to SecureHealth, including schema updates, encryption configuration, and testing.

## Prerequisites

- SecureHealth installation
- MongoDB Atlas cluster with Queryable Encryption
- Understanding of MongoDB encryption types

## Step 1: Plan Field Encryption

Determine the encryption type for each field:

- **Deterministic (D)**: For searchable fields (names, IDs)
- **Range (R)**: For date/numeric queries
- **Standard (S)**: For maximum security (SSN, notes)

## Step 2: Update Encryption Schema

Add new fields to `config/encryption-schema.json`:

```json
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
      "customField1": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "customField2": {
        "encrypt": {
          "bsonType": "date",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "customField3": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
}
```

## Step 3: Update Entity

Add new fields to the Patient entity:

```php
<?php

namespace App\Entity;

class Patient
{
    // ... existing fields

    private ?string $customField1 = null;
    private ?DateTime $customField2 = null;
    private ?string $customField3 = null;

    public function getCustomField1(): ?string
    {
        return $this->customField1;
    }

    public function setCustomField1(?string $customField1): self
    {
        $this->customField1 = $customField1;
        return $this;
    }

    public function getCustomField2(): ?DateTime
    {
        return $this->customField2;
    }

    public function setCustomField2(?DateTime $customField2): self
    {
        $this->customField2 = $customField2;
        return $this;
    }

    public function getCustomField3(): ?string
    {
        return $this->customField3;
    }

    public function setCustomField3(?string $customField3): self
    {
        $this->customField3 = $customField3;
        return $this;
    }
}
```

## Step 4: Update API Endpoints

Add new fields to API responses:

```php
<?php

namespace App\Controller;

class PatientController extends AbstractController
{
    #[Route('/api/patients/{id}/custom-fields', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getCustomFields(Patient $patient): JsonResponse
    {
        $this->denyAccessUnlessGranted('VIEW', $patient);
        
        $customFields = [
            'customField1' => $patient->getCustomField1(),
            'customField2' => $patient->getCustomField2(),
            'customField3' => $patient->getCustomField3()
        ];
        
        return $this->json($customFields);
    }

    #[Route('/api/patients/{id}/custom-fields', methods: ['PUT'])]
    #[IsGranted('ROLE_DOCTOR')]
    public function updateCustomFields(Patient $patient, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('EDIT', $patient);
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['customField1'])) {
            $patient->setCustomField1($data['customField1']);
        }
        
        if (isset($data['customField2'])) {
            $patient->setCustomField2(new DateTime($data['customField2']));
        }
        
        if (isset($data['customField3'])) {
            $patient->setCustomField3($data['customField3']);
        }
        
        $this->patientRepository->save($patient);
        
        return $this->json(['message' => 'Custom fields updated successfully']);
    }
}
```

## Step 5: Update Data Filtering

Modify the PatientDataFilter to include custom fields:

```php
<?php

namespace App\Service;

class PatientDataFilter
{
    public function filterPatientData(Patient $patient, User $user): array
    {
        $baseData = [
            'id' => $patient->getId(),
            'patientId' => $patient->getPatientId(),
            'firstName' => $patient->getFirstName(),
            'lastName' => $patient->getLastName(),
            'dateOfBirth' => $patient->getDateOfBirth(),
        ];

        $role = $user->getRoles()[0];
        
        switch ($role) {
            case 'ROLE_ADMIN':
                return $this->getAdminData($patient, $baseData);
            case 'ROLE_DOCTOR':
                return $this->getDoctorData($patient, $baseData);
            // ... other roles
        }
    }

    private function getAdminData(Patient $patient, array $baseData): array
    {
        return array_merge($baseData, [
            'customField1' => $patient->getCustomField1(),
            'customField2' => $patient->getCustomField2(),
            'customField3' => $patient->getCustomField3(),
            // ... other fields
        ]);
    }
}
```

## Step 6: Create Database Indexes

Add indexes for the new encrypted fields:

```javascript
// Create indexes for encrypted fields
db.patients.createIndex({ "customField1": 1 })
db.patients.createIndex({ "customField2": 1 })
db.patients.createIndex({ "customField1": 1, "customField2": 1 })
```

## Step 7: Test Custom Fields

Create test cases:

```php
<?php

namespace App\Tests\Service;

class PatientServiceTest extends TestCase
{
    public function testCustomFieldsEncryption(): void
    {
        $patient = new Patient();
        $patient->setPatientId('PAT-12345');
        $patient->setCustomField1('Searchable Value');
        $patient->setCustomField2(new DateTime('2024-01-15'));
        $patient->setCustomField3('Sensitive Information');

        $this->patientService->save($patient);

        $savedPatient = $this->patientService->findByPatientId('PAT-12345');
        
        $this->assertEquals('Searchable Value', $savedPatient->getCustomField1());
        $this->assertEquals('2024-01-15', $savedPatient->getCustomField2()->format('Y-m-d'));
        $this->assertEquals('Sensitive Information', $savedPatient->getCustomField3());
    }

    public function testCustomFieldsSearch(): void
    {
        $patients = $this->patientService->searchPatients(['customField1' => 'Searchable Value']);
        
        $this->assertCount(1, $patients);
        $this->assertEquals('PAT-12345', $patients[0]->getPatientId());
    }
}
```

## Step 8: Update Frontend

Add custom fields to the UI:

```javascript
class PatientForm {
    renderCustomFields(patient) {
        return `
            <div class="custom-fields">
                <h3>Custom Fields</h3>
                <div class="field">
                    <label>Custom Field 1 (Searchable)</label>
                    <input type="text" name="customField1" value="${patient.customField1 || ''}">
                </div>
                <div class="field">
                    <label>Custom Field 2 (Date)</label>
                    <input type="date" name="customField2" value="${patient.customField2 || ''}">
                </div>
                <div class="field">
                    <label>Custom Field 3 (Sensitive)</label>
                    <textarea name="customField3">${patient.customField3 || ''}</textarea>
                </div>
            </div>
        `;
    }
}
```

## Troubleshooting

### Common Issues

**Encryption Errors**
- Verify schema configuration
- Check field types match
- Ensure proper key configuration

**Search Issues**
- Use deterministic encryption for searchable fields
- Create appropriate indexes
- Test search functionality

**Performance Issues**
- Optimize field types
- Use appropriate encryption algorithms
- Monitor query performance

## Next Steps

- **[Audit Customization Tutorial](/docs/tutorials/audit-customization)** - Custom audit logging
- **[Integration Examples Tutorial](/docs/tutorials/integration-examples)** - Real-world integrations
- **[Reference](/docs/reference/troubleshooting)** - Common issues and solutions
