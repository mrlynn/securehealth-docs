# Integration Examples Tutorial

This tutorial provides real-world integration examples for SecureHealth, demonstrating how to integrate third-party systems, APIs, and healthcare workflows while maintaining MongoDB Queryable Encryption security.

:::info Prerequisites
- SecureHealth installation with MongoDB Queryable Encryption
- Understanding of API integration
- Access to third-party systems
- Knowledge of encryption field types (Deterministic, Range, Standard)
:::

## Encryption Service Overview

Before diving into integrations, understand the encryption service patterns:

```php title="EncryptionService.php"
<?php

namespace App\Service;

class EncryptionService
{
    public function encryptField(string $value, string $fieldName, string $encryptionType): string
    {
        // Deterministic: Allows equality search
        // Range: Allows range queries
        // Standard: No search capability, highest security
        return $this->encryptionManager->encrypt($value, $fieldName, $encryptionType);
    }

    public function decryptField(string $encryptedValue, string $fieldName): string
    {
        return $this->encryptionManager->decrypt($encryptedValue, $fieldName);
    }

    public function getEncryptionType(string $fieldName, string $dataType): string
    {
        $encryptionMap = [
            'firstName' => 'deterministic',
            'lastName' => 'deterministic',
            'dateOfBirth' => 'deterministic',
            'ssn' => 'deterministic',
            'address.street' => 'standard',
            'address.city' => 'deterministic',
            'address.state' => 'deterministic',
            'address.zipCode' => 'deterministic',
            'medication' => 'deterministic',
            'dosage' => 'standard',
            'frequency' => 'standard',
            'pharmacy' => 'deterministic',
            'labResults' => 'standard',
            'testType' => 'deterministic',
            'insuranceNumber' => 'deterministic',
            'phoneNumber' => 'deterministic'
        ];

        return $encryptionMap[$fieldName] ?? 'standard';
    }
}
```

:::tip Encryption Types
- **Deterministic**: Allows equality search (names, dates, IDs)
- **Range**: Allows range queries (future feature)
- **Standard**: Highest security, no search capability (addresses, dosages)
:::

## Example 1: EHR Integration with Encryption

### Connect to Epic EHR with Encrypted Data Storage

```php
<?php

namespace App\Service;

class EpicIntegrationService
{
    private EncryptionService $encryptionService;
    private PatientRepository $patientRepository;
    private AuditLogger $auditLogger;

    public function __construct(
        EncryptionService $encryptionService,
        PatientRepository $patientRepository,
        AuditLogger $auditLogger
    ) {
        $this->encryptionService = $encryptionService;
        $this->patientRepository = $patientRepository;
        $this->auditLogger = $auditLogger;
    }

    public function syncPatientData(string $patientId): array
    {
        try {
            $token = $this->getEpicToken();
            $patientData = $this->fetchPatientFromEpic($patientId, $token);
            
            // Transform and encrypt sensitive data
            $encryptedData = $this->transformAndEncryptEpicData($patientData);
            
            // Store encrypted data in MongoDB
            $patient = $this->patientRepository->createOrUpdate($encryptedData);
            
            // Log integration activity
            $this->auditLogger->logIntegrationActivity(
                'epic_sync',
                ['patientId' => $patientId],
                'Epic EHR'
            );
            
            return ['status' => 'success', 'patientId' => $patient->getId()];
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['patientId' => $patientId]);
            throw $e;
        }
    }

    private function transformAndEncryptEpicData(array $epicData): array
    {
        return [
            'patientId' => $epicData['identifier'][0]['value'],
            // Encrypt PII fields with appropriate encryption types
            'firstName' => $this->encryptionService->encryptField(
                $epicData['name'][0]['given'][0], 
                'firstName', 
                'deterministic'
            ),
            'lastName' => $this->encryptionService->encryptField(
                $epicData['name'][0]['family'], 
                'lastName', 
                'deterministic'
            ),
            'dateOfBirth' => $this->encryptionService->encryptField(
                $epicData['birthDate'], 
                'dateOfBirth', 
                'deterministic'
            ),
            'gender' => $this->encryptionService->encryptField(
                $epicData['gender'], 
                'gender', 
                'deterministic'
            ),
            'ssn' => $this->encryptionService->encryptField(
                $epicData['identifier'][1]['value'] ?? '', 
                'ssn', 
                'deterministic'
            ),
            'address' => [
                'street' => $this->encryptionService->encryptField(
                    $epicData['address'][0]['line'][0], 
                    'address.street', 
                    'standard'
                ),
                'city' => $this->encryptionService->encryptField(
                    $epicData['address'][0]['city'], 
                    'address.city', 
                    'deterministic'
                ),
                'state' => $this->encryptionService->encryptField(
                    $epicData['address'][0]['state'], 
                    'address.state', 
                    'deterministic'
                ),
                'zipCode' => $this->encryptionService->encryptField(
                    $epicData['address'][0]['postalCode'], 
                    'address.zipCode', 
                    'deterministic'
                )
            ],
            'phoneNumber' => $this->encryptionService->encryptField(
                $epicData['telecom'][0]['value'] ?? '', 
                'phoneNumber', 
                'deterministic'
            ),
            'email' => $this->encryptionService->encryptField(
                $epicData['telecom'][1]['value'] ?? '', 
                'email', 
                'deterministic'
            )
        ];
    }

    private function getEpicToken(): string
    {
        $response = $this->httpClient->request('POST', $this->epicBaseUrl . '/oauth2/token', [
            'form_params' => [
                'grant_type' => 'client_credentials',
                'client_id' => $this->epicClientId,
                'client_secret' => $this->epicClientSecret
            ]
        ]);

        $data = json_decode($response->getBody(), true);
        return $data['access_token'];
    }

    private function fetchPatientFromEpic(string $patientId, string $token): array
    {
        $response = $this->httpClient->request('GET', $this->epicBaseUrl . '/Patient/' . $patientId, [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json'
            ]
        ]);

        return json_decode($response->getBody(), true);
    }

    private function handleIntegrationError(\Exception $e, array $context): void
    {
        $this->auditLogger->logError('epic_integration_error', [
            'error' => $e->getMessage(),
            'context' => $context,
            'timestamp' => new DateTime()
        ]);
    }
}
```

## Example 2: Pharmacy Integration with Encrypted Prescriptions

### Connect to CVS Pharmacy with Encrypted Prescription Data

```php
<?php

namespace App\Service;

class PharmacyIntegrationService
{
    private EncryptionService $encryptionService;
    private PrescriptionRepository $prescriptionRepository;
    private AuditLogger $auditLogger;

    public function sendPrescription(array $prescriptionData): array
    {
        try {
            // Encrypt sensitive prescription data
            $encryptedPrescription = $this->encryptPrescriptionData($prescriptionData);
            
            // Store encrypted prescription in database
            $prescription = $this->prescriptionRepository->create($encryptedPrescription);
            
            // Send only necessary data to external pharmacy API
            $externalData = $this->prepareExternalData($prescriptionData);
            
            $response = $this->httpClient->request('POST', $this->pharmacyApiUrl . '/prescriptions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->pharmacyApiKey,
                    'Content-Type' => 'application/json'
                ],
                'json' => $externalData
            ]);

            $result = json_decode($response->getBody(), true);
            
            // Update prescription with external ID
            $prescription->setExternalId($result['prescriptionId']);
            $this->prescriptionRepository->save($prescription);
            
            $this->auditLogger->logIntegrationActivity(
                'pharmacy_prescription_sent',
                ['prescriptionId' => $prescription->getId()],
                'CVS Pharmacy'
            );
            
            return $result;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['prescriptionData' => $prescriptionData]);
            throw $e;
        }
    }

    private function encryptPrescriptionData(array $prescriptionData): array
    {
        return [
            'patientId' => $prescriptionData['patientId'],
            'medication' => $this->encryptionService->encryptField(
                $prescriptionData['medication'], 
                'medication', 
                'deterministic'
            ),
            'dosage' => $this->encryptionService->encryptField(
                $prescriptionData['dosage'], 
                'dosage', 
                'standard'
            ),
            'frequency' => $this->encryptionService->encryptField(
                $prescriptionData['frequency'], 
                'frequency', 
                'standard'
            ),
            'pharmacy' => $this->encryptionService->encryptField(
                $prescriptionData['pharmacy'], 
                'pharmacy', 
                'deterministic'
            ),
            'prescribingDoctor' => $this->encryptionService->encryptField(
                $prescriptionData['prescribingDoctor'], 
                'prescribingDoctor', 
                'deterministic'
            ),
            'prescriptionDate' => $this->encryptionService->encryptField(
                $prescriptionData['prescriptionDate'], 
                'prescriptionDate', 
                'deterministic'
            ),
            'instructions' => $this->encryptionService->encryptField(
                $prescriptionData['instructions'], 
                'instructions', 
                'standard'
            )
        ];
    }

    private function prepareExternalData(array $prescriptionData): array
    {
        // Only include data needed for external API (decrypted)
        return [
            'patientId' => $prescriptionData['patientId'],
            'medication' => $prescriptionData['medication'],
            'dosage' => $prescriptionData['dosage'],
            'frequency' => $prescriptionData['frequency'],
            'pharmacy' => $prescriptionData['pharmacy'],
            'prescribingDoctor' => $prescriptionData['prescribingDoctor'],
            'prescriptionDate' => $prescriptionData['prescriptionDate'],
            'instructions' => $prescriptionData['instructions']
        ];
    }

    public function checkPrescriptionStatus(string $prescriptionId): array
    {
        $response = $this->httpClient->request('GET', $this->pharmacyApiUrl . '/prescriptions/' . $prescriptionId, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->pharmacyApiKey
            ]
        ]);

        return json_decode($response->getBody(), true);
    }

    public function getDrugInteractions(array $medications): array
    {
        // Decrypt medications for interaction check
        $decryptedMedications = array_map(function($med) {
            return $this->encryptionService->decryptField($med, 'medication');
        }, $medications);

        $response = $this->httpClient->request('POST', $this->pharmacyApiUrl . '/drug-interactions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->pharmacyApiKey,
                'Content-Type' => 'application/json'
            ],
            'json' => ['medications' => $decryptedMedications]
        ]);

        return json_decode($response->getBody(), true);
    }
}
```

## Example 3: Lab Integration with Encrypted Results

### Connect to LabCorp with Encrypted Lab Results

```php
<?php

namespace App\Service;

class LabIntegrationService
{
    private EncryptionService $encryptionService;
    private LabResultRepository $labResultRepository;
    private AuditLogger $auditLogger;

    public function orderLabTest(string $patientId, array $testOrder): array
    {
        try {
            $orderData = [
                'patientId' => $patientId,
                'tests' => $testOrder['tests'],
                'orderedBy' => $testOrder['orderedBy'],
                'orderDate' => $testOrder['orderDate'],
                'priority' => $testOrder['priority']
            ];

            $response = $this->httpClient->request('POST', $this->labApiUrl . '/orders', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->labApiKey,
                    'Content-Type' => 'application/json'
                ],
                'json' => $orderData
            ]);

            $result = json_decode($response->getBody(), true);
            
            $this->auditLogger->logIntegrationActivity(
                'lab_test_ordered',
                ['patientId' => $patientId, 'orderId' => $result['orderId']],
                'LabCorp'
            );
            
            return $result;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['patientId' => $patientId, 'testOrder' => $testOrder]);
            throw $e;
        }
    }

    public function syncLabResults(string $patientId): array
    {
        try {
            $response = $this->httpClient->request('GET', $this->labApiUrl . '/patients/' . $patientId . '/results', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->labApiKey
                ]
            ]);

            $labResults = json_decode($response->getBody(), true);
            
            // Encrypt and store lab results
            $encryptedResults = $this->encryptLabResults($labResults);
            $this->labResultRepository->bulkInsert($encryptedResults);
            
            $this->auditLogger->logIntegrationActivity(
                'lab_results_synced',
                ['patientId' => $patientId, 'resultCount' => count($encryptedResults)],
                'LabCorp'
            );
            
            return $encryptedResults;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['patientId' => $patientId]);
            throw $e;
        }
    }

    private function encryptLabResults(array $labResults): array
    {
        $encryptedResults = [];
        
        foreach ($labResults as $result) {
            $encryptedResults[] = [
                'patientId' => $result['patientId'],
                'testDate' => $this->encryptionService->encryptField(
                    $result['testDate'], 
                    'testDate', 
                    'deterministic'
                ),
                'testType' => $this->encryptionService->encryptField(
                    $result['testType'], 
                    'testType', 
                    'deterministic'
                ),
                'result' => $this->encryptionService->encryptField(
                    $result['result'], 
                    'result', 
                    'standard'
                ),
                'normalRange' => $this->encryptionService->encryptField(
                    $result['normalRange'], 
                    'normalRange', 
                    'standard'
                ),
                'status' => $this->encryptionService->encryptField(
                    $result['status'], 
                    'status', 
                    'deterministic'
                ),
                'labName' => $this->encryptionService->encryptField(
                    'LabCorp', 
                    'labName', 
                    'deterministic'
                ),
                'orderedBy' => $this->encryptionService->encryptField(
                    $result['orderedBy'], 
                    'orderedBy', 
                    'deterministic'
                )
            ];
        }
        
        return $encryptedResults;
    }

    public function getLabResults(string $orderId): array
    {
        $response = $this->httpClient->request('GET', $this->labApiUrl . '/orders/' . $orderId . '/results', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->labApiKey
            ]
        ]);

        return json_decode($response->getBody(), true);
    }
}
```

## Example 4: Insurance Integration with Encrypted Claims

### Connect to Insurance Provider with Encrypted Claim Data

```php
<?php

namespace App\Service;

class InsuranceIntegrationService
{
    private EncryptionService $encryptionService;
    private ClaimRepository $claimRepository;
    private AuditLogger $auditLogger;

    public function verifyCoverage(string $patientId, string $serviceCode): array
    {
        try {
            $verificationData = [
                'patientId' => $patientId,
                'serviceCode' => $serviceCode,
                'verificationDate' => date('Y-m-d')
            ];

            $response = $this->httpClient->request('POST', $this->insuranceApiUrl . '/coverage/verify', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->insuranceApiKey,
                    'Content-Type' => 'application/json'
                ],
                'json' => $verificationData
            ]);

            $result = json_decode($response->getBody(), true);
            
            $this->auditLogger->logIntegrationActivity(
                'insurance_coverage_verified',
                ['patientId' => $patientId, 'serviceCode' => $serviceCode],
                'Insurance Provider'
            );
            
            return $result;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['patientId' => $patientId, 'serviceCode' => $serviceCode]);
            throw $e;
        }
    }

    public function submitClaim(array $claimData): array
    {
        try {
            // Encrypt sensitive claim data
            $encryptedClaim = $this->encryptClaimData($claimData);
            
            // Store encrypted claim in database
            $claim = $this->claimRepository->create($encryptedClaim);
            
            // Prepare external data (decrypted for API)
            $externalData = $this->prepareExternalClaimData($claimData);
            
            $response = $this->httpClient->request('POST', $this->insuranceApiUrl . '/claims', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->insuranceApiKey,
                    'Content-Type' => 'application/json'
                ],
                'json' => $externalData
            ]);

            $result = json_decode($response->getBody(), true);
            
            // Update claim with external ID
            $claim->setExternalId($result['claimId']);
            $this->claimRepository->save($claim);
            
            $this->auditLogger->logIntegrationActivity(
                'insurance_claim_submitted',
                ['claimId' => $claim->getId()],
                'Insurance Provider'
            );
            
            return $result;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['claimData' => $claimData]);
            throw $e;
        }
    }

    private function encryptClaimData(array $claimData): array
    {
        return [
            'patientId' => $claimData['patientId'],
            'serviceCode' => $this->encryptionService->encryptField(
                $claimData['serviceCode'], 
                'serviceCode', 
                'deterministic'
            ),
            'amount' => $this->encryptionService->encryptField(
                $claimData['amount'], 
                'amount', 
                'standard'
            ),
            'dateOfService' => $this->encryptionService->encryptField(
                $claimData['dateOfService'], 
                'dateOfService', 
                'deterministic'
            ),
            'providerId' => $this->encryptionService->encryptField(
                $claimData['providerId'], 
                'providerId', 
                'deterministic'
            ),
            'diagnosisCode' => $this->encryptionService->encryptField(
                $claimData['diagnosisCode'], 
                'diagnosisCode', 
                'deterministic'
            ),
            'insuranceNumber' => $this->encryptionService->encryptField(
                $claimData['insuranceNumber'], 
                'insuranceNumber', 
                'deterministic'
            )
        ];
    }

    private function prepareExternalClaimData(array $claimData): array
    {
        return [
            'patientId' => $claimData['patientId'],
            'serviceCode' => $claimData['serviceCode'],
            'amount' => $claimData['amount'],
            'dateOfService' => $claimData['dateOfService'],
            'providerId' => $claimData['providerId'],
            'diagnosisCode' => $claimData['diagnosisCode'],
            'insuranceNumber' => $claimData['insuranceNumber']
        ];
    }

    public function getClaimStatus(string $claimId): array
    {
        $response = $this->httpClient->request('GET', $this->insuranceApiUrl . '/claims/' . $claimId, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->insuranceApiKey
            ]
        ]);

        return json_decode($response->getBody(), true);
    }
}
```

## Example 5: Notification Integration with Encrypted Patient Data

### Connect to Twilio SMS with Encrypted Patient Information

```php
<?php

namespace App\Service;

class NotificationService
{
    private EncryptionService $encryptionService;
    private PatientRepository $patientRepository;
    private AuditLogger $auditLogger;

    public function sendAppointmentReminder(string $patientId, array $appointmentData): array
    {
        try {
            // Get patient data and decrypt only needed fields
            $patient = $this->patientRepository->findByPatientId($patientId);
            if (!$patient) {
                throw new PatientNotFoundException();
            }
            
            $phoneNumber = $this->encryptionService->decryptField(
                $patient->getPhoneNumber(), 
                'phoneNumber'
            );
            
            $firstName = $this->encryptionService->decryptField(
                $patient->getFirstName(), 
                'firstName'
            );
            
            $message = "Hello {$firstName}, you have an appointment with " . 
                      $appointmentData['doctor'] . " on " . $appointmentData['date'] . 
                      " at " . $appointmentData['time'] . ". Please arrive 15 minutes early.";
            
            $result = $this->sendSMS($phoneNumber, $message);
            
            $this->auditLogger->logIntegrationActivity(
                'appointment_reminder_sent',
                ['patientId' => $patientId, 'phoneNumber' => $this->maskPhoneNumber($phoneNumber)],
                'Twilio SMS'
            );
            
            return $result;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['patientId' => $patientId, 'appointmentData' => $appointmentData]);
            throw $e;
        }
    }

    public function sendPrescriptionReady(string $patientId, string $pharmacyName): array
    {
        try {
            $patient = $this->patientRepository->findByPatientId($patientId);
            if (!$patient) {
                throw new PatientNotFoundException();
            }
            
            $phoneNumber = $this->encryptionService->decryptField(
                $patient->getPhoneNumber(), 
                'phoneNumber'
            );
            
            $firstName = $this->encryptionService->decryptField(
                $patient->getFirstName(), 
                'firstName'
            );
            
            $message = "Hello {$firstName}, your prescription is ready for pickup at " . 
                      $pharmacyName . ". Please bring a valid ID.";
            
            $result = $this->sendSMS($phoneNumber, $message);
            
            $this->auditLogger->logIntegrationActivity(
                'prescription_ready_notification_sent',
                ['patientId' => $patientId, 'pharmacyName' => $pharmacyName],
                'Twilio SMS'
            );
            
            return $result;
        } catch (\Exception $e) {
            $this->handleIntegrationError($e, ['patientId' => $patientId, 'pharmacyName' => $pharmacyName]);
            throw $e;
        }
    }

    private function sendSMS(string $phoneNumber, string $message): array
    {
        $twilio = new Client($this->twilioAccountSid, $this->twilioAuthToken);

        $message = $twilio->messages->create(
            $phoneNumber,
            [
                'from' => $this->twilioPhoneNumber,
                'body' => $message
            ]
        );

        return [
            'sid' => $message->sid,
            'status' => $message->status,
            'to' => $message->to
        ];
    }

    private function maskPhoneNumber(string $phoneNumber): string
    {
        return substr($phoneNumber, 0, 3) . '***' . substr($phoneNumber, -4);
    }
}
```

## Example 6: Integration Controller with Encryption

Create an integration controller that handles encrypted data:

```php
<?php

namespace App\Controller;

class IntegrationController extends AbstractController
{
    private EncryptionService $encryptionService;
    private AuditLogger $auditLogger;

    #[Route('/api/integrations/epic/sync/{patientId}', methods: ['POST'])]
    #[IsGranted('ROLE_DOCTOR')]
    public function syncEpicPatient(string $patientId): JsonResponse
    {
        try {
            $epicData = $this->epicIntegrationService->syncPatientData($patientId);
            
            $this->auditLogger->logUserAction(
                'epic_patient_sync',
                ['patientId' => $patientId],
                $this->getUser()
            );
            
            return $this->json(['message' => 'Patient data synced successfully']);
        } catch (\Exception $e) {
            $this->auditLogger->logError('epic_sync_error', [
                'error' => $e->getMessage(),
                'patientId' => $patientId
            ]);
            
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/integrations/pharmacy/prescription', methods: ['POST'])]
    #[IsGranted('ROLE_DOCTOR')]
    public function sendPrescription(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $result = $this->pharmacyIntegrationService->sendPrescription($data);
            
            $this->auditLogger->logUserAction(
                'prescription_sent',
                ['prescriptionData' => $data],
                $this->getUser()
            );
            
            return $this->json([
                'message' => 'Prescription sent successfully',
                'prescriptionId' => $result['prescriptionId']
            ]);
        } catch (\Exception $e) {
            $this->auditLogger->logError('prescription_send_error', [
                'error' => $e->getMessage(),
                'prescriptionData' => $data
            ]);
            
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/integrations/lab/order', methods: ['POST'])]
    #[IsGranted('ROLE_DOCTOR')]
    public function orderLabTest(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $result = $this->labIntegrationService->orderLabTest($data['patientId'], $data);
            
            $this->auditLogger->logUserAction(
                'lab_test_ordered',
                ['labOrderData' => $data],
                $this->getUser()
            );
            
            return $this->json([
                'message' => 'Lab test ordered successfully',
                'orderId' => $result['orderId']
            ]);
        } catch (\Exception $e) {
            $this->auditLogger->logError('lab_order_error', [
                'error' => $e->getMessage(),
                'labOrderData' => $data
            ]);
            
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
```

## Example 7: Integration Testing with Encryption

Create integration tests that verify encryption behavior:

```php
<?php

namespace App\Tests\Integration;

class IntegrationTest extends WebTestCase
{
    public function testEpicIntegrationWithEncryption(): void
    {
        $client = static::createClient();
        $token = $this->getValidToken();

        $client->request('POST', '/api/integrations/epic/sync/PAT-12345', [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token
        ]);

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Patient data synced successfully', $response['message']);
        
        // Verify data is encrypted in database
        $patient = $this->patientRepository->findByPatientId('PAT-12345');
        $this->assertTrue($this->isEncrypted($patient->getFirstName()));
        $this->assertTrue($this->isEncrypted($patient->getLastName()));
    }

    public function testPharmacyIntegrationWithEncryption(): void
    {
        $client = static::createClient();
        $token = $this->getValidToken();

        $prescriptionData = [
            'patientId' => 'PAT-12345',
            'medication' => 'Metformin',
            'dosage' => '500mg',
            'frequency' => 'Twice daily',
            'pharmacy' => 'CVS Pharmacy'
        ];

        $client->request('POST', '/api/integrations/pharmacy/prescription', [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            'CONTENT_TYPE' => 'application/json'
        ], json_encode($prescriptionData));

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Prescription sent successfully', $response['message']);
        
        // Verify prescription data is encrypted
        $prescription = $this->prescriptionRepository->findByPatientId('PAT-12345');
        $this->assertTrue($this->isEncrypted($prescription->getMedication()));
        $this->assertTrue($this->isEncrypted($prescription->getDosage()));
    }

    private function isEncrypted(string $value): bool
    {
        // Check if value appears to be encrypted (base64 encoded, etc.)
        return base64_decode($value, true) !== false && strlen($value) > 50;
    }
}
```

## Security Best Practices

:::success Best Practices
1. **Data Minimization**: Only decrypt data needed for external APIs
2. **Use field-level encryption** to protect sensitive information
3. **Implement proper access controls**
:::

### 2. **Audit Logging**

```php title="AuditLogger.php"
public function logIntegrationActivity(string $action, array $data, string $externalSystem): void
{
    $this->auditLogger->log([
        'action' => $action,
        'externalSystem' => $externalSystem,
        'timestamp' => new DateTime(),
        'user' => $this->security->getUser()->getUsername(),
        'dataHash' => hash('sha256', json_encode($data))
    ]);
}
```

### 3. **Error Handling with Encryption**

```php title="ErrorHandler.php"
public function handleIntegrationError(\Exception $e, array $encryptedData): void
{
    // Log error without exposing encrypted data
    $this->logger->error('Integration failed', [
        'error' => $e->getMessage(),
        'dataType' => 'encrypted',
        'timestamp' => new DateTime()
    ]);
    
    // Store failed integration for retry
    $this->failedIntegrationRepository->store([
        'encryptedData' => $encryptedData,
        'error' => $e->getMessage(),
        'retryCount' => 0
    ]);
}
```

### 4. **Encryption Field Mapping**

```php title="EncryptionFieldMapping.php"
private function getEncryptionType(string $fieldName, string $dataType): string
{
    $encryptionMap = [
        // Deterministic: Allows equality search
        'firstName' => 'deterministic',
        'lastName' => 'deterministic',
        'dateOfBirth' => 'deterministic',
        'ssn' => 'deterministic',
        'medication' => 'deterministic',
        'pharmacy' => 'deterministic',
        'testType' => 'deterministic',
        'insuranceNumber' => 'deterministic',
        'phoneNumber' => 'deterministic',
        
        // Standard: Highest security, no search
        'address.street' => 'standard',
        'dosage' => 'standard',
        'frequency' => 'standard',
        'instructions' => 'standard',
        'result' => 'standard',
        'normalRange' => 'standard',
        'amount' => 'standard'
    ];

    return $encryptionMap[$fieldName] ?? 'standard';
}
```

## Troubleshooting

:::warning Common Issues

**Encryption/Decryption Errors**
- Verify encryption keys are properly configured
- Check field encryption type mappings
- Test encryption service independently

**API Authentication**
- Verify API keys and tokens
- Check authentication headers
- Test API endpoints independently

**Data Transformation**
- Validate data formats
- Handle missing fields
- Test data mapping

**Error Handling**
- Implement proper error handling
- Log integration errors
- Provide meaningful error messages
:::

## Next Steps

- **[Reference](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Community](/docs/community/support)** - Getting help and support
- **[Roadmap](/docs/community/roadmap)** - Future plans and features
