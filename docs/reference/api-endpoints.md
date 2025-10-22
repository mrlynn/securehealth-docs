# API Endpoints Reference

Complete reference for all SecureHealth API endpoints, including request/response formats, authentication requirements, and error codes.

## Base URL

```
https://api.securehealth.dev/v1
```

## Authentication

All API requests require a valid JWT token:

```http
Authorization: Bearer <jwt_token>
```

## Patient Endpoints

### List Patients

```http
GET /patients
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term
- `role` (optional): Filter by role

**Response:**
```json
{
  "data": [
    {
      "id": "patient_123",
      "patientId": "PAT-12345",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-05-15",
      "email": "john.doe@email.com",
      "phone": "+1-555-123-4567"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Patient Details

```http
GET /patients/{id}
```

**Response:**
```json
{
  "id": "patient_123",
  "patientId": "PAT-12345",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "email": "john.doe@email.com",
  "phone": "+1-555-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "medicalHistory": "Patient has diabetes...",
  "labResults": [
    {
      "testDate": "2024-01-15",
      "testType": "Blood Glucose",
      "result": "150 mg/dL",
      "normalRange": "70-100 mg/dL"
    }
  ],
  "prescriptions": [
    {
      "medication": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  ],
  "appointments": [
    {
      "date": "2024-01-15",
      "doctor": "Dr. Smith",
      "type": "Follow-up",
      "notes": "Regular checkup"
    }
  ]
}
```

### Create Patient

```http
POST /patients
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "email": "john.doe@email.com",
  "phone": "+1-555-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "insurance": {
    "provider": "Blue Cross",
    "policyNumber": "BC123456789",
    "groupNumber": "GRP001"
  }
}
```

**Response:**
```json
{
  "id": "patient_123",
  "patientId": "PAT-12345",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "email": "john.doe@email.com",
  "phone": "+1-555-123-4567",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Update Patient

```http
PUT /patients/{id}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@newemail.com",
  "phone": "+1-555-987-6543",
  "address": {
    "street": "456 Oak Ave",
    "city": "Newtown",
    "state": "CA",
    "zipCode": "54321"
  }
}
```

**Response:**
```json
{
  "id": "patient_123",
  "patientId": "PAT-12345",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@newemail.com",
  "phone": "+1-555-987-6543",
  "address": {
    "street": "456 Oak Ave",
    "city": "Newtown",
    "state": "CA",
    "zipCode": "54321"
  },
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### Delete Patient

```http
DELETE /patients/{id}
```

**Response:**
```json
{
  "message": "Patient deleted successfully"
}
```

## Medical Records Endpoints

### Get Medical History

```http
GET /patients/{id}/medical-history
```

**Response:**
```json
{
  "medicalHistory": "Patient has diabetes type 2, diagnosed in 2020. Currently managed with Metformin. No known allergies. Family history of diabetes.",
  "diagnoses": [
    {
      "condition": "Diabetes Type 2",
      "diagnosedDate": "2020-03-15",
      "status": "Active",
      "notes": "Well controlled with medication"
    }
  ],
  "allergies": [
    {
      "allergen": "Penicillin",
      "reaction": "Rash",
      "severity": "Moderate"
    }
  ]
}
```

### Update Medical History

```http
PUT /patients/{id}/medical-history
```

**Request Body:**
```json
{
  "medicalHistory": "Patient has diabetes type 2, diagnosed in 2020. Currently managed with Metformin and diet. No known allergies. Family history of diabetes.",
  "diagnoses": [
    {
      "condition": "Diabetes Type 2",
      "diagnosedDate": "2020-03-15",
      "status": "Active",
      "notes": "Well controlled with medication and diet"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Medical history updated successfully",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

### Get Lab Results

```http
GET /patients/{id}/lab-results
```

**Query Parameters:**
- `startDate` (optional): Start date for results
- `endDate` (optional): End date for results
- `testType` (optional): Filter by test type

**Response:**
```json
{
  "labResults": [
    {
      "id": "lab_123",
      "testDate": "2024-01-15",
      "testType": "Blood Glucose",
      "result": "150 mg/dL",
      "normalRange": "70-100 mg/dL",
      "status": "High",
      "notes": "Patient fasting"
    },
    {
      "id": "lab_124",
      "testDate": "2024-01-15",
      "testType": "HbA1c",
      "result": "7.2%",
      "normalRange": "<7.0%",
      "status": "High",
      "notes": "3-month average"
    }
  ]
}
```

### Add Lab Result

```http
POST /patients/{id}/lab-results
```

**Request Body:**
```json
{
  "testDate": "2024-01-15",
  "testType": "Blood Glucose",
  "result": "150 mg/dL",
  "normalRange": "70-100 mg/dL",
  "status": "High",
  "notes": "Patient fasting"
}
```

**Response:**
```json
{
  "id": "lab_125",
  "testDate": "2024-01-15",
  "testType": "Blood Glucose",
  "result": "150 mg/dL",
  "normalRange": "70-100 mg/dL",
  "status": "High",
  "notes": "Patient fasting",
  "createdAt": "2024-01-15T12:00:00Z"
}
```

## Prescription Endpoints

### Get Prescriptions

```http
GET /patients/{id}/prescriptions
```

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, all)

**Response:**
```json
{
  "prescriptions": [
    {
      "id": "prescription_123",
      "medication": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "status": "Active",
      "prescribedBy": "Dr. Smith",
      "pharmacy": "CVS Pharmacy"
    }
  ]
}
```

### Create Prescription

```http
POST /patients/{id}/prescriptions
```

**Request Body:**
```json
{
  "medication": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "pharmacy": "CVS Pharmacy",
  "instructions": "Take with food"
}
```

**Response:**
```json
{
  "id": "prescription_124",
  "medication": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "Active",
  "prescribedBy": "Dr. Smith",
  "pharmacy": "CVS Pharmacy",
  "instructions": "Take with food",
  "createdAt": "2024-01-15T12:30:00Z"
}
```

### Update Prescription

```http
PUT /prescriptions/{id}
```

**Request Body:**
```json
{
  "dosage": "1000mg",
  "frequency": "Twice daily",
  "instructions": "Take with food, monitor blood sugar"
}
```

**Response:**
```json
{
  "id": "prescription_124",
  "medication": "Metformin",
  "dosage": "1000mg",
  "frequency": "Twice daily",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "status": "Active",
  "prescribedBy": "Dr. Smith",
  "pharmacy": "CVS Pharmacy",
  "instructions": "Take with food, monitor blood sugar",
  "updatedAt": "2024-01-15T13:00:00Z"
}
```

## Appointment Endpoints

### List Appointments

```http
GET /appointments
```

**Query Parameters:**
- `patientId` (optional): Filter by patient ID
- `doctorId` (optional): Filter by doctor ID
- `startDate` (optional): Start date for appointments
- `endDate` (optional): End date for appointments
- `status` (optional): Filter by status (scheduled, completed, cancelled)

**Response:**
```json
{
  "appointments": [
    {
      "id": "appointment_123",
      "patientId": "patient_123",
      "patientName": "John Doe",
      "doctorId": "doctor_456",
      "doctorName": "Dr. Smith",
      "date": "2024-01-15",
      "time": "10:00",
      "type": "Follow-up",
      "status": "Scheduled",
      "notes": "Regular checkup"
    }
  ]
}
```

### Create Appointment

```http
POST /appointments
```

**Request Body:**
```json
{
  "patientId": "patient_123",
  "doctorId": "doctor_456",
  "date": "2024-01-20",
  "time": "14:00",
  "type": "Follow-up",
  "notes": "Regular checkup"
}
```

**Response:**
```json
{
  "id": "appointment_124",
  "patientId": "patient_123",
  "patientName": "John Doe",
  "doctorId": "doctor_456",
  "doctorName": "Dr. Smith",
  "date": "2024-01-20",
  "time": "14:00",
  "type": "Follow-up",
  "status": "Scheduled",
  "notes": "Regular checkup",
  "createdAt": "2024-01-15T13:30:00Z"
}
```

### Update Appointment

```http
PUT /appointments/{id}
```

**Request Body:**
```json
{
  "date": "2024-01-21",
  "time": "15:00",
  "notes": "Rescheduled due to conflict"
}
```

**Response:**
```json
{
  "id": "appointment_124",
  "patientId": "patient_123",
  "patientName": "John Doe",
  "doctorId": "doctor_456",
  "doctorName": "Dr. Smith",
  "date": "2024-01-21",
  "time": "15:00",
  "type": "Follow-up",
  "status": "Scheduled",
  "notes": "Rescheduled due to conflict",
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

### Cancel Appointment

```http
DELETE /appointments/{id}
```

**Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

## User Management Endpoints

### List Users

```http
GET /users
```

**Query Parameters:**
- `role` (optional): Filter by role
- `status` (optional): Filter by status (active, inactive)

**Response:**
```json
{
  "users": [
    {
      "id": "user_123",
      "email": "doctor@securehealth.dev",
      "firstName": "Dr. Jane",
      "lastName": "Smith",
      "roles": ["ROLE_DOCTOR"],
      "department": "Cardiology",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create User

```http
POST /users
```

**Request Body:**
```json
{
  "email": "nurse@securehealth.dev",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "roles": ["ROLE_NURSE"],
  "department": "Cardiology",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": "user_124",
  "email": "nurse@securehealth.dev",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "roles": ["ROLE_NURSE"],
  "department": "Cardiology",
  "isActive": true,
  "createdAt": "2024-01-15T14:30:00Z"
}
```

## Audit Logs Endpoints

### Get Audit Logs

```http
GET /audit-logs
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `action` (optional): Filter by action
- `startDate` (optional): Start date for logs
- `endDate` (optional): End date for logs
- `resourceType` (optional): Filter by resource type

**Response:**
```json
{
  "auditLogs": [
    {
      "id": "audit_123",
      "timestamp": "2024-01-15T10:30:00Z",
      "user": {
        "id": "user_123",
        "email": "doctor@securehealth.dev",
        "role": "ROLE_DOCTOR"
      },
      "action": "VIEW_PATIENT",
      "resource": {
        "type": "Patient",
        "id": "patient_123",
        "patientId": "PAT-12345"
      },
      "result": "SUCCESS",
      "ipAddress": "192.168.1.100"
    }
  ]
}
```

## Error Codes

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

## Rate Limiting

### Rate Limits

- **Authentication**: 5 requests per minute
- **General API**: 100 requests per minute
- **Patient Data**: 50 requests per minute
- **Audit Logs**: 20 requests per minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Next Steps

- **[Configuration Reference](/docs/reference/configuration)** - All configuration options
- **[Environment Variables](/docs/reference/environment-variables)** - Environment setup
- **[Troubleshooting](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Glossary](/docs/reference/glossary)** - Technical terms and definitions
