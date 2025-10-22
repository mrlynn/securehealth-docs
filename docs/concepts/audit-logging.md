# Audit Logging

Audit logging is a critical component of HIPAA compliance and healthcare data security. SecureHealth implements comprehensive audit logging that tracks every access to Protected Health Information (PHI) and system activities.

## What is Audit Logging?

Audit logging in SecureHealth captures:
- **Who** accessed the data (user identity)
- **What** data was accessed (resource and fields)
- **When** the access occurred (timestamp)
- **Where** the access originated (IP address, location)
- **Why** the access was made (action context)
- **How** the access was performed (method, device)

## Audit Log Structure

### Core Audit Log Fields

```json
{
  "id": "audit_12345",
  "timestamp": "2024-01-15T10:30:00Z",
  "user": {
    "id": "user_456",
    "email": "doctor@securehealth.dev",
    "role": "ROLE_DOCTOR",
    "department": "Cardiology"
  },
  "action": "VIEW_PATIENT",
  "resource": {
    "type": "Patient",
    "id": "patient_789",
    "patientId": "PAT-12345",
    "fields": ["firstName", "lastName", "medicalHistory"]
  },
  "request": {
    "method": "GET",
    "url": "/api/patients/PAT-12345",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "sessionId": "session_abc123"
  },
  "result": {
    "status": "SUCCESS",
    "httpCode": 200,
    "responseTime": 150
  },
  "compliance": {
    "hipaaCompliant": true,
    "auditRequired": true,
    "retentionPeriod": "7_years"
  },
  "metadata": {
    "encryptionStatus": "ENCRYPTED",
    "dataClassification": "PHI",
    "accessReason": "Patient care"
  }
}
```

## Types of Audit Events

### 1. Authentication Events

```json
{
  "action": "LOGIN",
  "details": {
    "loginMethod": "PASSWORD",
    "success": true,
    "failureReason": null
  }
}
```

```json
{
  "action": "LOGIN_FAILED",
  "details": {
    "loginMethod": "PASSWORD",
    "success": false,
    "failureReason": "INVALID_CREDENTIALS",
    "attemptCount": 3
  }
}
```

### 2. Data Access Events

```json
{
  "action": "VIEW_PATIENT",
  "resource": {
    "type": "Patient",
    "id": "patient_789",
    "fields": ["firstName", "lastName", "dateOfBirth"]
  }
}
```

```json
{
  "action": "SEARCH_PATIENTS",
  "resource": {
    "type": "Patient",
    "searchCriteria": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "resultCount": 5
  }
}
```

### 3. Data Modification Events

```json
{
  "action": "UPDATE_PATIENT",
  "resource": {
    "type": "Patient",
    "id": "patient_789",
    "fields": ["medicalHistory", "prescriptions"]
  },
  "changes": {
    "medicalHistory": {
      "old": "Previous medical history...",
      "new": "Updated medical history..."
    }
  }
}
```

### 4. Administrative Events

```json
{
  "action": "CREATE_USER",
  "resource": {
    "type": "User",
    "id": "user_new",
    "email": "newuser@securehealth.dev",
    "role": "ROLE_NURSE"
  }
}
```

```json
{
  "action": "CHANGE_PERMISSIONS",
  "resource": {
    "type": "User",
    "id": "user_456",
    "oldRole": "ROLE_NURSE",
    "newRole": "ROLE_DOCTOR"
  }
}
```

## Implementation in SecureHealth

### Audit Logger Service

```php
<?php

namespace App\Service;

use App\Entity\AuditLog;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;

class AuditLogger
{
    private $auditRepository;
    private $encryptionService;

    public function logAccess(User $user, string $action, $resource, Request $request, array $details = []): void
    {
        $auditLog = new AuditLog();
        
        // Basic information
        $auditLog->setUser($user);
        $auditLog->setAction($action);
        $auditLog->setTimestamp(new DateTime());
        
        // Resource information
        if ($resource) {
            $auditLog->setResourceType(get_class($resource));
            $auditLog->setResourceId($resource->getId());
            
            if (method_exists($resource, 'getPatientId')) {
                $auditLog->setPatientId($resource->getPatientId());
            }
        }
        
        // Request information
        $auditLog->setIpAddress($request->getClientIp());
        $auditLog->setUserAgent($request->headers->get('User-Agent'));
        $auditLog->setRequestMethod($request->getMethod());
        $auditLog->setRequestUrl($request->getUri());
        $auditLog->setSessionId($request->getSession()->getId());
        
        // Additional details
        $auditLog->setDetails($details);
        
        // Compliance information
        $auditLog->setHipaaCompliant(true);
        $auditLog->setAuditRequired(true);
        $auditLog->setRetentionPeriod('7_years');
        
        // Encrypt sensitive audit data
        $this->encryptAuditLog($auditLog);
        
        $this->auditRepository->save($auditLog);
    }

    public function logAuthentication(User $user, string $action, Request $request, bool $success, string $failureReason = null): void
    {
        $auditLog = new AuditLog();
        
        $auditLog->setUser($user);
        $auditLog->setAction($action);
        $auditLog->setTimestamp(new DateTime());
        $auditLog->setIpAddress($request->getClientIp());
        $auditLog->setUserAgent($request->headers->get('User-Agent'));
        $auditLog->setResult($success ? 'SUCCESS' : 'FAILURE');
        
        $details = [
            'success' => $success,
            'failureReason' => $failureReason,
            'loginMethod' => 'PASSWORD'
        ];
        
        $auditLog->setDetails($details);
        $auditLog->setHipaaCompliant(true);
        $auditLog->setAuditRequired(true);
        
        $this->auditRepository->save($auditLog);
    }

    private function encryptAuditLog(AuditLog $auditLog): void
    {
        // Encrypt sensitive fields in audit log
        if ($auditLog->getDetails()) {
            $encryptedDetails = $this->encryptionService->encrypt(json_encode($auditLog->getDetails()));
            $auditLog->setEncryptedDetails($encryptedDetails);
            $auditLog->setDetails(null); // Remove unencrypted data
        }
    }
}
```

### Event Listeners

```php
<?php

namespace App\EventListener;

use App\Service\AuditLogger;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Event\AuthenticationEvent;
use Symfony\Component\Security\Core\Event\AuthenticationFailureEvent;

class AuditEventListener
{
    private $auditLogger;

    public function __construct(AuditLogger $auditLogger)
    {
        $this->auditLogger = $auditLogger;
    }

    public function onAuthenticationSuccess(AuthenticationEvent $event): void
    {
        $user = $event->getAuthenticationToken()->getUser();
        $request = $this->getCurrentRequest();
        
        if ($request) {
            $this->auditLogger->logAuthentication($user, 'LOGIN', $request, true);
        }
    }

    public function onAuthenticationFailure(AuthenticationFailureEvent $event): void
    {
        $token = $event->getAuthenticationToken();
        $user = $token->getUser();
        $request = $this->getCurrentRequest();
        
        if ($request && $user) {
            $this->auditLogger->logAuthentication($user, 'LOGIN_FAILED', $request, false, 'INVALID_CREDENTIALS');
        }
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        
        // Log API requests
        if (str_starts_with($request->getPathInfo(), '/api/')) {
            $this->logApiRequest($request);
        }
    }

    private function logApiRequest(Request $request): void
    {
        $user = $this->getCurrentUser();
        if (!$user) {
            return;
        }

        $action = $this->determineAction($request);
        $resource = $this->extractResource($request);
        
        $this->auditLogger->logAccess($user, $action, $resource, $request);
    }

    private function determineAction(Request $request): string
    {
        $method = $request->getMethod();
        $path = $request->getPathInfo();
        
        if (str_contains($path, '/patients')) {
            return match($method) {
                'GET' => 'VIEW_PATIENT',
                'POST' => 'CREATE_PATIENT',
                'PUT', 'PATCH' => 'UPDATE_PATIENT',
                'DELETE' => 'DELETE_PATIENT',
                default => 'UNKNOWN_ACTION'
            };
        }
        
        return 'UNKNOWN_ACTION';
    }
}
```

## Audit Log Storage

### MongoDB Document Structure

```javascript
// Audit log document in MongoDB
{
  "_id": ObjectId("..."),
  "timestamp": ISODate("2024-01-15T10:30:00Z"),
  "user": {
    "id": "user_456",
    "email": "doctor@securehealth.dev",
    "role": "ROLE_DOCTOR"
  },
  "action": "VIEW_PATIENT",
  "resource": {
    "type": "Patient",
    "id": "patient_789",
    "patientId": "PAT-12345"
  },
  "request": {
    "method": "GET",
    "url": "/api/patients/PAT-12345",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "sessionId": "session_abc123"
  },
  "result": {
    "status": "SUCCESS",
    "httpCode": 200,
    "responseTime": 150
  },
  "compliance": {
    "hipaaCompliant": true,
    "auditRequired": true,
    "retentionPeriod": "7_years"
  },
  "encryptedDetails": "encrypted_data_here",
  "createdAt": ISODate("2024-01-15T10:30:00Z")
}
```

### Indexing Strategy

```javascript
// Create indexes for efficient audit log queries
db.audit_logs.createIndex({ "timestamp": 1 })
db.audit_logs.createIndex({ "user.id": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "action": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "resource.patientId": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "request.ipAddress": 1, "timestamp": 1 })
db.audit_logs.createIndex({ "result.status": 1, "timestamp": 1 })
```

## Compliance Reporting

### Automated Reports

```php
<?php

namespace App\Service;

class ComplianceReporter
{
    public function generateAccessReport(DateTime $startDate, DateTime $endDate): array
    {
        $auditLogs = $this->auditRepository->findByDateRange($startDate, $endDate);
        
        $report = [
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ],
            'summary' => [
                'totalAccesses' => count($auditLogs),
                'uniqueUsers' => $this->countUniqueUsers($auditLogs),
                'uniquePatients' => $this->countUniquePatients($auditLogs),
                'failedAccesses' => $this->countFailedAccesses($auditLogs)
            ],
            'byUser' => $this->groupByUser($auditLogs),
            'byPatient' => $this->groupByPatient($auditLogs),
            'byAction' => $this->groupByAction($auditLogs),
            'securityIncidents' => $this->identifySecurityIncidents($auditLogs)
        ];
        
        return $report;
    }

    public function generateBreachReport(array $incidentIds): array
    {
        $incidents = $this->auditRepository->findByIds($incidentIds);
        
        $report = [
            'incidentSummary' => [
                'totalIncidents' => count($incidents),
                'affectedPatients' => $this->countAffectedPatients($incidents),
                'incidentTypes' => $this->categorizeIncidents($incidents)
            ],
            'detailedIncidents' => $incidents,
            'recommendations' => $this->generateRecommendations($incidents)
        ];
        
        return $report;
    }
}
```

## Real-time Monitoring

### Security Alerts

```php
<?php

namespace App\Service;

class SecurityMonitor
{
    public function monitorAccessPatterns(): void
    {
        $recentLogs = $this->auditRepository->findRecent(3600); // Last hour
        
        $this->checkForSuspiciousActivity($recentLogs);
        $this->checkForPrivilegeEscalation($recentLogs);
        $this->checkForDataExfiltration($recentLogs);
    }

    private function checkForSuspiciousActivity(array $logs): void
    {
        $userAccessCounts = [];
        
        foreach ($logs as $log) {
            $userId = $log->getUser()->getId();
            $userAccessCounts[$userId] = ($userAccessCounts[$userId] ?? 0) + 1;
        }
        
        // Alert if user has excessive access
        foreach ($userAccessCounts as $userId => $count) {
            if ($count > 100) { // Threshold
                $this->sendSecurityAlert('EXCESSIVE_ACCESS', [
                    'userId' => $userId,
                    'accessCount' => $count,
                    'timeframe' => '1_hour'
                ]);
            }
        }
    }

    private function checkForPrivilegeEscalation(array $logs): void
    {
        foreach ($logs as $log) {
            if ($log->getAction() === 'CHANGE_PERMISSIONS') {
                $this->sendSecurityAlert('PRIVILEGE_ESCALATION', [
                    'userId' => $log->getUser()->getId(),
                    'action' => $log->getAction(),
                    'details' => $log->getDetails()
                ]);
            }
        }
    }

    private function sendSecurityAlert(string $type, array $details): void
    {
        $alert = new SecurityAlert();
        $alert->setType($type);
        $alert->setDetails($details);
        $alert->setTimestamp(new DateTime());
        $alert->setStatus('ACTIVE');
        
        $this->alertRepository->save($alert);
        
        // Send notification to security team
        $this->notificationService->sendSecurityAlert($alert);
    }
}
```

## Audit Log Retention

### Retention Policies

```php
<?php

namespace App\Service;

class AuditRetentionManager
{
    public function enforceRetentionPolicies(): void
    {
        $policies = [
            'PHI_ACCESS' => '7_years',
            'AUTHENTICATION' => '1_year',
            'ADMIN_ACTIONS' => '7_years',
            'SYSTEM_EVENTS' => '1_year'
        ];
        
        foreach ($policies as $logType => $retentionPeriod) {
            $this->archiveOldLogs($logType, $retentionPeriod);
        }
    }

    private function archiveOldLogs(string $logType, string $retentionPeriod): void
    {
        $cutoffDate = $this->calculateCutoffDate($retentionPeriod);
        
        $oldLogs = $this->auditRepository->findOlderThan($logType, $cutoffDate);
        
        foreach ($oldLogs as $log) {
            $this->archiveLog($log);
            $this->auditRepository->delete($log);
        }
    }

    private function archiveLog(AuditLog $log): void
    {
        $archivedLog = new ArchivedAuditLog();
        $archivedLog->setOriginalId($log->getId());
        $archivedLog->setTimestamp($log->getTimestamp());
        $archivedLog->setAction($log->getAction());
        $archivedLog->setEncryptedData($this->encryptForArchive($log));
        $archivedLog->setArchivedAt(new DateTime());
        
        $this->archiveRepository->save($archivedLog);
    }
}
```

## Best Practices

### 1. Comprehensive Logging
- Log all access to PHI
- Include sufficient context for investigations
- Capture both successful and failed access attempts

### 2. Data Protection
- Encrypt sensitive audit log data
- Implement proper access controls for audit logs
- Use secure storage for audit data

### 3. Performance Optimization
- Use appropriate indexing strategies
- Implement log rotation and archival
- Monitor audit log performance

### 4. Compliance
- Meet HIPAA audit requirements
- Implement proper retention policies
- Generate compliance reports

## Next Steps

- **[Security Architecture](/docs/concepts/security-architecture)** - Overall security design
- **[User Guides](/docs/user-guides/admin-guide)** - Role-specific documentation
- **[Tutorials](/docs/tutorials/audit-customization)** - Step-by-step implementation guides
- **[Reference](/docs/reference/troubleshooting)** - Common issues and solutions
