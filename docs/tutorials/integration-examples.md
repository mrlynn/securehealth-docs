# Integration Examples Tutorial

This tutorial provides real-world integration examples for SecureHealth, including third-party systems, APIs, and healthcare workflows.

## Prerequisites

- SecureHealth installation
- Understanding of API integration
- Access to third-party systems

## Example 1: EHR Integration

### Connect to Epic EHR

Create an Epic integration service:

```php
<?php

namespace App\Service;

class EpicIntegrationService
{
    private string $epicBaseUrl;
    private string $epicClientId;
    private string $epicClientSecret;

    public function __construct(string $epicBaseUrl, string $epicClientId, string $epicClientSecret)
    {
        $this->epicBaseUrl = $epicBaseUrl;
        $this->epicClientId = $epicClientId;
        $this->epicClientSecret = $epicClientSecret;
    }

    public function syncPatientData(string $patientId): array
    {
        $token = $this->getEpicToken();
        $patientData = $this->fetchPatientFromEpic($patientId, $token);
        
        return $this->transformEpicData($patientData);
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

    private function transformEpicData(array $epicData): array
    {
        return [
            'patientId' => $epicData['identifier'][0]['value'],
            'firstName' => $epicData['name'][0]['given'][0],
            'lastName' => $epicData['name'][0]['family'],
            'dateOfBirth' => $epicData['birthDate'],
            'gender' => $epicData['gender'],
            'address' => [
                'street' => $epicData['address'][0]['line'][0],
                'city' => $epicData['address'][0]['city'],
                'state' => $epicData['address'][0]['state'],
                'zipCode' => $epicData['address'][0]['postalCode']
            ]
        ];
    }
}
```

## Example 2: Pharmacy Integration

### Connect to CVS Pharmacy

Create a pharmacy integration service:

```php
<?php

namespace App\Service;

class PharmacyIntegrationService
{
    private string $pharmacyApiUrl;
    private string $pharmacyApiKey;

    public function __construct(string $pharmacyApiUrl, string $pharmacyApiKey)
    {
        $this->pharmacyApiUrl = $pharmacyApiUrl;
        $this->pharmacyApiKey = $pharmacyApiKey;
    }

    public function sendPrescription(array $prescriptionData): array
    {
        $response = $this->httpClient->request('POST', $this->pharmacyApiUrl . '/prescriptions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->pharmacyApiKey,
                'Content-Type' => 'application/json'
            ],
            'json' => $prescriptionData
        ]);

        return json_decode($response->getBody(), true);
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
        $response = $this->httpClient->request('POST', $this->pharmacyApiUrl . '/drug-interactions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->pharmacyApiKey,
                'Content-Type' => 'application/json'
            ],
            'json' => ['medications' => $medications]
        ]);

        return json_decode($response->getBody(), true);
    }
}
```

## Example 3: Lab Integration

### Connect to LabCorp

Create a lab integration service:

```php
<?php

namespace App\Service;

class LabIntegrationService
{
    private string $labApiUrl;
    private string $labApiKey;

    public function __construct(string $labApiUrl, string $labApiKey)
    {
        $this->labApiUrl = $labApiUrl;
        $this->labApiKey = $labApiKey;
    }

    public function orderLabTest(string $patientId, array $testOrder): array
    {
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

        return json_decode($response->getBody(), true);
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

    public function syncLabResults(string $patientId): array
    {
        $response = $this->httpClient->request('GET', $this->labApiUrl . '/patients/' . $patientId . '/results', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->labApiKey
            ]
        ]);

        $labResults = json_decode($response->getBody(), true);
        
        return $this->transformLabResults($labResults);
    }

    private function transformLabResults(array $labResults): array
    {
        $transformedResults = [];
        
        foreach ($labResults as $result) {
            $transformedResults[] = [
                'testDate' => $result['testDate'],
                'testType' => $result['testType'],
                'result' => $result['result'],
                'normalRange' => $result['normalRange'],
                'status' => $result['status'],
                'labName' => 'LabCorp',
                'orderedBy' => $result['orderedBy']
            ];
        }
        
        return $transformedResults;
    }
}
```

## Example 4: Insurance Integration

### Connect to Insurance Provider

Create an insurance integration service:

```php
<?php

namespace App\Service;

class InsuranceIntegrationService
{
    private string $insuranceApiUrl;
    private string $insuranceApiKey;

    public function __construct(string $insuranceApiUrl, string $insuranceApiKey)
    {
        $this->insuranceApiUrl = $insuranceApiUrl;
        $this->insuranceApiKey = $insuranceApiKey;
    }

    public function verifyCoverage(string $patientId, string $serviceCode): array
    {
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

        return json_decode($response->getBody(), true);
    }

    public function submitClaim(array $claimData): array
    {
        $response = $this->httpClient->request('POST', $this->insuranceApiUrl . '/claims', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->insuranceApiKey,
                'Content-Type' => 'application/json'
            ],
            'json' => $claimData
        ]);

        return json_decode($response->getBody(), true);
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

## Example 5: Notification Integration

### Connect to Twilio SMS

Create a notification service:

```php
<?php

namespace App\Service;

class NotificationService
{
    private string $twilioAccountSid;
    private string $twilioAuthToken;
    private string $twilioPhoneNumber;

    public function __construct(string $twilioAccountSid, string $twilioAuthToken, string $twilioPhoneNumber)
    {
        $this->twilioAccountSid = $twilioAccountSid;
        $this->twilioAuthToken = $twilioAuthToken;
        $this->twilioPhoneNumber = $twilioPhoneNumber;
    }

    public function sendSMS(string $phoneNumber, string $message): array
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

    public function sendAppointmentReminder(string $phoneNumber, array $appointmentData): array
    {
        $message = "Reminder: You have an appointment with " . $appointmentData['doctor'] . 
                   " on " . $appointmentData['date'] . " at " . $appointmentData['time'] . 
                   ". Please arrive 15 minutes early.";

        return $this->sendSMS($phoneNumber, $message);
    }

    public function sendPrescriptionReady(string $phoneNumber, string $pharmacyName): array
    {
        $message = "Your prescription is ready for pickup at " . $pharmacyName . 
                   ". Please bring a valid ID.";

        return $this->sendSMS($phoneNumber, $message);
    }
}
```

## Example 6: Integration Controller

Create an integration controller:

```php
<?php

namespace App\Controller;

class IntegrationController extends AbstractController
{
    #[Route('/api/integrations/epic/sync/{patientId}', methods: ['POST'])]
    #[IsGranted('ROLE_DOCTOR')]
    public function syncEpicPatient(string $patientId): JsonResponse
    {
        try {
            $epicData = $this->epicIntegrationService->syncPatientData($patientId);
            
            // Update patient in SecureHealth
            $patient = $this->patientRepository->findByPatientId($patientId);
            if ($patient) {
                $patient->setFirstName($epicData['firstName']);
                $patient->setLastName($epicData['lastName']);
                $patient->setDateOfBirth(new DateTime($epicData['dateOfBirth']));
                
                $this->patientRepository->save($patient);
                
                return $this->json(['message' => 'Patient data synced successfully']);
            }
            
            return $this->json(['error' => 'Patient not found'], 404);
        } catch (\Exception $e) {
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
            
            return $this->json([
                'message' => 'Prescription sent successfully',
                'prescriptionId' => $result['prescriptionId']
            ]);
        } catch (\Exception $e) {
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
            
            return $this->json([
                'message' => 'Lab test ordered successfully',
                'orderId' => $result['orderId']
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}
```

## Example 7: Integration Testing

Create integration tests:

```php
<?php

namespace App\Tests\Integration;

class IntegrationTest extends WebTestCase
{
    public function testEpicIntegration(): void
    {
        $client = static::createClient();
        $token = $this->getValidToken();

        $client->request('POST', '/api/integrations/epic/sync/PAT-12345', [], [], [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token
        ]);

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        
        $response = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Patient data synced successfully', $response['message']);
    }

    public function testPharmacyIntegration(): void
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
    }
}
```

## Troubleshooting

### Common Issues

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

## Next Steps

- **[Reference](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Community](/docs/community/support)** - Getting help and support
- **[Roadmap](/docs/community/roadmap)** - Future plans and features
