# Audit Customization Tutorial

This tutorial shows how to customize audit logging in SecureHealth, including custom events, data filtering, and compliance reporting.

## Prerequisites

- SecureHealth installation
- Admin access to the system
- Understanding of audit logging requirements

## Step 1: Define Custom Audit Events

Create custom audit event types:

```php
<?php

namespace App\Security;

class AuditEventTypes
{
    const CUSTOM_EVENTS = [
        'PATIENT_TRANSFER' => 'Patient transferred between departments',
        'MEDICATION_CHANGE' => 'Medication dosage or type changed',
        'EMERGENCY_ACCESS' => 'Emergency access to patient data',
        'DATA_EXPORT' => 'Patient data exported',
        'CONSENT_UPDATE' => 'Patient consent updated'
    ];

    public static function getAllEvents(): array
    {
        return array_merge(self::STANDARD_EVENTS, self::CUSTOM_EVENTS);
    }
}
```

## Step 2: Create Custom Audit Logger

Extend the base audit logger:

```php
<?php

namespace App\Service;

use App\Entity\AuditLog;
use App\Entity\User;
use App\Security\AuditEventTypes;

class CustomAuditLogger extends AuditLogger
{
    public function logPatientTransfer(User $user, Patient $fromPatient, Patient $toPatient, string $reason): void
    {
        $details = [
            'fromPatientId' => $fromPatient->getPatientId(),
            'toPatientId' => $toPatient->getPatientId(),
            'reason' => $reason,
            'transferType' => 'DEPARTMENT_TRANSFER'
        ];

        $this->logCustomEvent($user, 'PATIENT_TRANSFER', $fromPatient, $details);
    }

    public function logMedicationChange(User $user, Patient $patient, array $oldMedication, array $newMedication): void
    {
        $details = [
            'oldMedication' => $oldMedication,
            'newMedication' => $newMedication,
            'changeType' => 'MEDICATION_UPDATE',
            'prescribedBy' => $user->getEmail()
        ];

        $this->logCustomEvent($user, 'MEDICATION_CHANGE', $patient, $details);
    }

    public function logEmergencyAccess(User $user, Patient $patient, string $emergencyReason): void
    {
        $details = [
            'emergencyReason' => $emergencyReason,
            'accessType' => 'EMERGENCY_OVERRIDE',
            'justification' => 'Emergency medical situation'
        ];

        $this->logCustomEvent($user, 'EMERGENCY_ACCESS', $patient, $details);
    }

    private function logCustomEvent(User $user, string $eventType, $resource, array $details): void
    {
        $auditLog = new AuditLog();
        $auditLog->setUser($user);
        $auditLog->setAction($eventType);
        $auditLog->setTimestamp(new DateTime());
        $auditLog->setResource($resource);
        $auditLog->setDetails($details);
        $auditLog->setHipaaCompliant(true);
        $auditLog->setAuditRequired(true);
        $auditLog->setRetentionPeriod('7_years');
        
        $this->auditRepository->save($auditLog);
    }
}
```

## Step 3: Create Audit Event Listeners

Add custom event listeners:

```php
<?php

namespace App\EventListener;

use App\Service\CustomAuditLogger;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomAuditEventListener implements EventSubscriberInterface
{
    private CustomAuditLogger $auditLogger;

    public function __construct(CustomAuditLogger $auditLogger)
    {
        $this->auditLogger = $auditLogger;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'patient.transfer' => 'onPatientTransfer',
            'medication.change' => 'onMedicationChange',
            'emergency.access' => 'onEmergencyAccess',
            'data.export' => 'onDataExport'
        ];
    }

    public function onPatientTransfer(PatientTransferEvent $event): void
    {
        $this->auditLogger->logPatientTransfer(
            $event->getUser(),
            $event->getFromPatient(),
            $event->getToPatient(),
            $event->getReason()
        );
    }

    public function onMedicationChange(MedicationChangeEvent $event): void
    {
        $this->auditLogger->logMedicationChange(
            $event->getUser(),
            $event->getPatient(),
            $event->getOldMedication(),
            $event->getNewMedication()
        );
    }

    public function onEmergencyAccess(EmergencyAccessEvent $event): void
    {
        $this->auditLogger->logEmergencyAccess(
            $event->getUser(),
            $event->getPatient(),
            $event->getReason()
        );
    }

    public function onDataExport(DataExportEvent $event): void
    {
        $this->auditLogger->logDataExport(
            $event->getUser(),
            $event->getPatient(),
            $event->getExportType(),
            $event->getDataFields()
        );
    }
}
```

## Step 4: Create Custom Events

Define custom event classes:

```php
<?php

namespace App\Event;

use App\Entity\Patient;
use App\Entity\User;
use Symfony\Contracts\EventDispatcher\Event;

class PatientTransferEvent extends Event
{
    private User $user;
    private Patient $fromPatient;
    private Patient $toPatient;
    private string $reason;

    public function __construct(User $user, Patient $fromPatient, Patient $toPatient, string $reason)
    {
        $this->user = $user;
        $this->fromPatient = $fromPatient;
        $this->toPatient = $toPatient;
        $this->reason = $reason;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getFromPatient(): Patient
    {
        return $this->fromPatient;
    }

    public function getToPatient(): Patient
    {
        return $this->toPatient;
    }

    public function getReason(): string
    {
        return $this->reason;
    }
}
```

## Step 5: Create Custom Reports

Add custom compliance reports:

```php
<?php

namespace App\Service;

class CustomComplianceReporter
{
    public function generatePatientTransferReport(DateTime $startDate, DateTime $endDate): array
    {
        $auditLogs = $this->auditRepository->findByActionAndDateRange('PATIENT_TRANSFER', $startDate, $endDate);
        
        $report = [
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ],
            'summary' => [
                'totalTransfers' => count($auditLogs),
                'uniquePatients' => $this->countUniquePatients($auditLogs),
                'transferReasons' => $this->categorizeTransferReasons($auditLogs)
            ],
            'transfers' => $auditLogs
        ];
        
        return $report;
    }

    public function generateMedicationChangeReport(DateTime $startDate, DateTime $endDate): array
    {
        $auditLogs = $this->auditRepository->findByActionAndDateRange('MEDICATION_CHANGE', $startDate, $endDate);
        
        $report = [
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ],
            'summary' => [
                'totalChanges' => count($auditLogs),
                'uniquePatients' => $this->countUniquePatients($auditLogs),
                'changeTypes' => $this->categorizeChangeTypes($auditLogs)
            ],
            'changes' => $auditLogs
        ];
        
        return $report;
    }

    private function countUniquePatients(array $auditLogs): int
    {
        $patientIds = array_unique(array_map(function($log) {
            return $log->getResourceId();
        }, $auditLogs));
        
        return count($patientIds);
    }

    private function categorizeTransferReasons(array $auditLogs): array
    {
        $reasons = [];
        foreach ($auditLogs as $log) {
            $reason = $log->getDetails()['reason'] ?? 'Unknown';
            $reasons[$reason] = ($reasons[$reason] ?? 0) + 1;
        }
        
        return $reasons;
    }
}
```

## Step 6: Create Audit Dashboard

Add custom audit dashboard:

```php
<?php

namespace App\Controller;

class CustomAuditController extends AbstractController
{
    #[Route('/admin/audit/custom-events', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function customEvents(Request $request): JsonResponse
    {
        $startDate = new DateTime($request->query->get('startDate', '-30 days'));
        $endDate = new DateTime($request->query->get('endDate', 'now'));
        $eventType = $request->query->get('eventType');

        $auditLogs = $this->auditRepository->findCustomEvents($startDate, $endDate, $eventType);
        
        return $this->json([
            'events' => $auditLogs,
            'summary' => $this->generateEventSummary($auditLogs)
        ]);
    }

    #[Route('/admin/audit/patient-transfers', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function patientTransfers(Request $request): JsonResponse
    {
        $startDate = new DateTime($request->query->get('startDate', '-30 days'));
        $endDate = new DateTime($request->query->get('endDate', 'now'));

        $report = $this->customComplianceReporter->generatePatientTransferReport($startDate, $endDate);
        
        return $this->json($report);
    }

    #[Route('/admin/audit/medication-changes', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function medicationChanges(Request $request): JsonResponse
    {
        $startDate = new DateTime($request->query->get('startDate', '-30 days'));
        $endDate = new DateTime($request->query->get('endDate', 'now'));

        $report = $this->customComplianceReporter->generateMedicationChangeReport($startDate, $endDate);
        
        return $this->json($report);
    }
}
```

## Step 7: Test Custom Audit Logging

Create test cases:

```php
<?php

namespace App\Tests\Service;

class CustomAuditLoggerTest extends TestCase
{
    public function testPatientTransferLogging(): void
    {
        $user = new User();
        $user->setEmail('doctor@securehealth.dev');
        
        $fromPatient = new Patient();
        $fromPatient->setPatientId('PAT-12345');
        
        $toPatient = new Patient();
        $toPatient->setPatientId('PAT-12346');

        $this->auditLogger->logPatientTransfer($user, $fromPatient, $toPatient, 'Department transfer');

        $auditLogs = $this->auditRepository->findByAction('PATIENT_TRANSFER');
        
        $this->assertCount(1, $auditLogs);
        $this->assertEquals('PATIENT_TRANSFER', $auditLogs[0]->getAction());
        $this->assertEquals('Department transfer', $auditLogs[0]->getDetails()['reason']);
    }

    public function testMedicationChangeLogging(): void
    {
        $user = new User();
        $user->setEmail('doctor@securehealth.dev');
        
        $patient = new Patient();
        $patient->setPatientId('PAT-12345');

        $oldMedication = ['medication' => 'Metformin', 'dosage' => '500mg'];
        $newMedication = ['medication' => 'Metformin', 'dosage' => '1000mg'];

        $this->auditLogger->logMedicationChange($user, $patient, $oldMedication, $newMedication);

        $auditLogs = $this->auditRepository->findByAction('MEDICATION_CHANGE');
        
        $this->assertCount(1, $auditLogs);
        $this->assertEquals('MEDICATION_CHANGE', $auditLogs[0]->getAction());
        $this->assertEquals($oldMedication, $auditLogs[0]->getDetails()['oldMedication']);
        $this->assertEquals($newMedication, $auditLogs[0]->getDetails()['newMedication']);
    }
}
```

## Step 8: Update Frontend

Add custom audit dashboard to the UI:

```javascript
class CustomAuditDashboard {
    renderCustomEvents(events) {
        return `
            <div class="custom-audit-dashboard">
                <h2>Custom Audit Events</h2>
                <div class="event-filters">
                    <select id="eventType">
                        <option value="">All Events</option>
                        <option value="PATIENT_TRANSFER">Patient Transfers</option>
                        <option value="MEDICATION_CHANGE">Medication Changes</option>
                        <option value="EMERGENCY_ACCESS">Emergency Access</option>
                    </select>
                    <input type="date" id="startDate">
                    <input type="date" id="endDate">
                    <button onclick="loadCustomEvents()">Filter</button>
                </div>
                <div class="events-list">
                    ${events.map(event => this.renderEvent(event)).join('')}
                </div>
            </div>
        `;
    }

    renderEvent(event) {
        return `
            <div class="audit-event">
                <div class="event-header">
                    <span class="event-type">${event.action}</span>
                    <span class="event-time">${event.timestamp}</span>
                </div>
                <div class="event-details">
                    <p><strong>User:</strong> ${event.user.email}</p>
                    <p><strong>Resource:</strong> ${event.resource.patientId}</p>
                    <p><strong>Details:</strong> ${JSON.stringify(event.details)}</p>
                </div>
            </div>
        `;
    }
}
```

## Troubleshooting

### Common Issues

**Event Not Logged**
- Check event listener registration
- Verify event dispatch
- Check audit logger configuration

**Report Generation Issues**
- Verify date range parameters
- Check database queries
- Test report generation

**Performance Issues**
- Optimize audit queries
- Use appropriate indexes
- Implement pagination

## Next Steps

- **[Integration Examples Tutorial](/docs/tutorials/integration-examples)** - Real-world integrations
- **[Reference](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Community](/docs/community/support)** - Getting help and support
