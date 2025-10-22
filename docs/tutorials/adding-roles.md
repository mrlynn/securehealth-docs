# Adding Roles Tutorial

This tutorial shows how to extend the SecureHealth role system by adding new roles and configuring their permissions.

## Prerequisites

- SecureHealth installation
- Admin access to the system
- Understanding of Symfony security components

## Step 1: Define New Role

Add the new role constant to the User entity:

```php
<?php

namespace App\Entity;

class User
{
    const ROLE_PHARMACIST = 'ROLE_PHARMACIST';
    const ROLE_LAB_TECH = 'ROLE_LAB_TECH';
    
    // ... existing code
}
```

## Step 2: Update Permission Matrix

Modify the PatientVoter to include new role permissions:

```php
<?php

namespace App\Security\Voter;

class PatientVoter extends Voter
{
    // ... existing code

    private function canViewLabResults(User $user, Patient $patient): bool
    {
        return in_array('ROLE_DOCTOR', $user->getRoles()) || 
               in_array('ROLE_NURSE', $user->getRoles()) ||
               in_array('ROLE_LAB_TECH', $user->getRoles()) ||
               in_array('ROLE_ADMIN', $user->getRoles());
    }

    private function canViewPrescriptions(User $user, Patient $patient): bool
    {
        return in_array('ROLE_DOCTOR', $user->getRoles()) || 
               in_array('ROLE_PHARMACIST', $user->getRoles()) ||
               in_array('ROLE_ADMIN', $user->getRoles());
    }
}
```

## Step 3: Update Data Filtering

Modify the PatientDataFilter service:

```php
<?php

namespace App\Service;

class PatientDataFilter
{
    // ... existing code

    private function getLabTechData(Patient $patient, array $baseData): array
    {
        return array_merge($baseData, [
            'labResults' => $patient->getLabResults(),
            'prescriptions' => $patient->getPrescriptions()
        ]);
    }

    private function getPharmacistData(Patient $patient, array $baseData): array
    {
        return array_merge($baseData, [
            'prescriptions' => $patient->getPrescriptions(),
            'allergies' => $patient->getAllergies()
        ]);
    }
}
```

## Step 4: Update UI Components

Modify the frontend role-based UI:

```javascript
class SecureHealthUI {
    getRoleSpecificFeatures() {
        const features = [];
        
        switch (this.userRole) {
            case 'ROLE_LAB_TECH':
                features.push(
                    document.getElementById('lab-results'),
                    document.getElementById('lab-orders')
                );
                break;
            case 'ROLE_PHARMACIST':
                features.push(
                    document.getElementById('prescriptions'),
                    document.getElementById('drug-interactions')
                );
                break;
        }
        
        return features.filter(feature => feature !== null);
    }
}
```

## Step 5: Create Users

Use the console command to create users with new roles:

```bash
php bin/console app:user:create labtech@securehealth.dev --role=ROLE_LAB_TECH --password=labtech123
php bin/console app:user:create pharmacist@securehealth.dev --role=ROLE_PHARMACIST --password=pharmacist123
```

## Step 6: Test New Roles

Create test cases for the new roles:

```php
<?php

namespace App\Tests\Security\Voter;

class PatientVoterTest extends TestCase
{
    public function testLabTechCanViewLabResults(): void
    {
        $user = new User();
        $user->setRoles(['ROLE_LAB_TECH']);
        $token = $this->createToken($user);

        $result = $this->voter->vote($token, $this->patient, [PatientVoter::VIEW_LAB_RESULTS]);

        $this->assertEquals(1, $result);
    }

    public function testPharmacistCanViewPrescriptions(): void
    {
        $user = new User();
        $user->setRoles(['ROLE_PHARMACIST']);
        $token = $this->createToken($user);

        $result = $this->voter->vote($token, $this->patient, [PatientVoter::VIEW_PRESCRIPTIONS]);

        $this->assertEquals(1, $result);
    }
}
```

## Step 7: Update Documentation

Update the role documentation:

```markdown
## Role Definitions

### Lab Technician Role
- **Lab Results Access**: View and manage lab results
- **Prescription Access**: View prescriptions for drug interactions
- **Limited Patient Data**: Access to necessary patient information

### Pharmacist Role
- **Prescription Access**: Full access to prescription information
- **Drug Interaction Checking**: Check for drug interactions
- **Allergy Information**: Access to patient allergy information
```

## Troubleshooting

### Common Issues

**Permission Errors**
- Check role hierarchy configuration
- Verify voter logic
- Test with different user roles

**UI Issues**
- Ensure frontend role detection works
- Check feature visibility logic
- Test with different browsers

**Database Issues**
- Verify user role storage
- Check role assignment
- Test role-based queries

## Next Steps

- **[Custom Fields Tutorial](/docs/tutorials/custom-fields)** - Adding encrypted fields
- **[Audit Customization Tutorial](/docs/tutorials/audit-customization)** - Custom audit logging
- **[Integration Examples Tutorial](/docs/tutorials/integration-examples)** - Real-world integrations
