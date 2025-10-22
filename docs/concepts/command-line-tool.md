# Command-Line Management Tool

The SecureHealth Command-Line Management Tool provides comprehensive system administration capabilities for managing patients, encryption operations, audit logs, and system configuration. This tool is essential for system administrators and developers working with the SecureHealth platform.

## Overview

The CLI tool is built using Symfony Console and provides a comprehensive interface for managing all aspects of the SecureHealth system. It includes commands for patient management, encryption operations, audit logging, and system administration.

### Key Features

- **Patient Management**: Create, update, and manage patient records
- **Encryption Operations**: Manage encryption keys and operations
- **Audit Logging**: View and manage audit logs
- **System Administration**: Complete system management capabilities
- **Database Operations**: Direct database management and maintenance
- **Security Management**: User and role management

## Installation and Setup

### Prerequisites

- PHP 8.2 or higher
- Symfony Console
- MongoDB 8.2 with Queryable Encryption
- SecureHealth application installed

### Installation

```bash
# Navigate to SecureHealth directory
cd /path/to/securehealth

# Install dependencies
composer install

# Make CLI executable
chmod +x bin/console
```

### Configuration

The CLI tool uses the same configuration as the main application:

```bash
# Environment variables
MONGODB_URI=mongodb://localhost:27017/securehealth
MONGODB_DB=securehealth
APP_SECRET=your-app-secret
JWT_SECRET_KEY=your-jwt-secret
ENCRYPTION_KEY_PATH=/path/to/encryption.key
```

## Available Commands

### Patient Management

#### Create Patient

```bash
# Create a new patient
php bin/console app:create-patient \
  --firstName="John" \
  --lastName="Doe" \
  --email="john.doe@email.com" \
  --phone="555-123-4567" \
  --dateOfBirth="1990-01-01" \
  --ssn="123-45-6789"
```

#### Update Patient

```bash
# Update patient information
php bin/console app:update-patient \
  --id="patient_123" \
  --firstName="John" \
  --lastName="Smith" \
  --email="john.smith@email.com"
```

#### List Patients

```bash
# List all patients
php bin/console app:list-patients

# List patients with filters
php bin/console app:list-patients \
  --role="doctor" \
  --limit=10 \
  --search="John"
```

#### Delete Patient

```bash
# Delete a patient
php bin/console app:delete-patient --id="patient_123"
```

### Encryption Operations

#### Generate Encryption Key

```bash
# Generate new encryption key
php bin/console app:generate-encryption-key

# Generate key with specific parameters
php bin/console app:generate-encryption-key \
  --key-id="key_123" \
  --algorithm="AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
```

#### Initialize MongoDB

```bash
# Initialize MongoDB with encryption configuration
php bin/console app:init-mongodb

# Initialize with specific database
php bin/console app:init-mongodb --database="securehealth_prod"
```

#### Encrypt Data

```bash
# Encrypt specific data
php bin/console app:encrypt-data \
  --field="lastName" \
  --value="Smith" \
  --algorithm="deterministic"
```

#### Decrypt Data

```bash
# Decrypt specific data
php bin/console app:decrypt-data \
  --field="lastName" \
  --encrypted-value="encrypted_value_here"
```

### Audit Logging

#### View Audit Logs

```bash
# View recent audit logs
php bin/console app:view-audit-logs

# View logs with filters
php bin/console app:view-audit-logs \
  --user="doctor_123" \
  --action="patient_view" \
  --start-date="2024-01-01" \
  --end-date="2024-01-31"
```

#### Export Audit Logs

```bash
# Export audit logs to CSV
php bin/console app:export-audit-logs \
  --format="csv" \
  --output="audit_logs_2024.csv" \
  --start-date="2024-01-01" \
  --end-date="2024-01-31"
```

#### Clear Audit Logs

```bash
# Clear old audit logs
php bin/console app:clear-audit-logs \
  --older-than="2023-01-01" \
  --confirm
```

### User Management

#### Create User

```bash
# Create a new user
php bin/console app:create-user \
  --email="doctor@securehealth.dev" \
  --firstName="Dr. Jane" \
  --lastName="Smith" \
  --roles="ROLE_DOCTOR" \
  --password="securepassword123"
```

#### Update User

```bash
# Update user information
php bin/console app:update-user \
  --id="user_123" \
  --firstName="Dr. Jane" \
  --lastName="Johnson" \
  --roles="ROLE_DOCTOR,ROLE_ADMIN"
```

#### List Users

```bash
# List all users
php bin/console app:list-users

# List users by role
php bin/console app:list-users --role="ROLE_DOCTOR"
```

#### Reset Password

```bash
# Reset user password
php bin/console app:reset-password \
  --email="doctor@securehealth.dev" \
  --new-password="newpassword123"
```

### System Administration

#### System Status

```bash
# Check system status
php bin/console app:system-status

# Check specific components
php bin/console app:system-status --component="mongodb"
php bin/console app:system-status --component="encryption"
```

#### Database Maintenance

```bash
# Optimize database
php bin/console app:optimize-database

# Rebuild indexes
php bin/console app:rebuild-indexes

# Check database integrity
php bin/console app:check-database-integrity
```

#### Cache Management

```bash
# Clear application cache
php bin/console app:clear-cache

# Warm up cache
php bin/console app:warm-cache

# Clear specific cache
php bin/console app:clear-cache --type="doctrine"
```

#### Backup and Restore

```bash
# Create database backup
php bin/console app:backup-database \
  --output="/backups/securehealth_2024-01-15.bak"

# Restore database
php bin/console app:restore-database \
  --input="/backups/securehealth_2024-01-15.bak"
```

## Advanced Usage

### Batch Operations

#### Batch Patient Import

```bash
# Import patients from CSV
php bin/console app:import-patients \
  --file="/data/patients.csv" \
  --format="csv" \
  --batch-size=100
```

#### Batch User Creation

```bash
# Create multiple users
php bin/console app:create-users \
  --file="/data/users.json" \
  --format="json"
```

### Monitoring and Alerts

#### Health Check

```bash
# Run comprehensive health check
php bin/console app:health-check

# Check specific services
php bin/console app:health-check --service="mongodb"
php bin/console app:health-check --service="encryption"
```

#### Performance Monitoring

```bash
# Monitor system performance
php bin/console app:monitor-performance

# Generate performance report
php bin/console app:performance-report \
  --output="/reports/performance_2024-01-15.pdf"
```

### Security Operations

#### Security Audit

```bash
# Run security audit
php bin/console app:security-audit

# Audit specific components
php bin/console app:security-audit --component="encryption"
php bin/console app:security-audit --component="users"
```

#### Key Rotation

```bash
# Rotate encryption keys
php bin/console app:rotate-encryption-keys \
  --old-key-id="key_123" \
  --new-key-id="key_456"
```

## Configuration Options

### Command Line Options

Most commands support common options:

- `--verbose` or `-v`: Verbose output
- `--quiet` or `-q`: Quiet mode
- `--no-interaction` or `-n`: Non-interactive mode
- `--env=prod`: Environment specification
- `--help` or `-h`: Command help

### Environment-Specific Commands

```bash
# Development environment
php bin/console app:create-patient --env=dev

# Production environment
php bin/console app:create-patient --env=prod

# Test environment
php bin/console app:create-patient --env=test
```

## Error Handling

### Common Errors

#### Database Connection Issues

```bash
# Check MongoDB connection
php bin/console app:check-mongodb-connection

# Test encryption configuration
php bin/console app:test-encryption-config
```

#### Permission Issues

```bash
# Check file permissions
php bin/console app:check-permissions

# Fix permission issues
php bin/console app:fix-permissions
```

#### Encryption Errors

```bash
# Validate encryption keys
php bin/console app:validate-encryption-keys

# Test encryption operations
php bin/console app:test-encryption
```

## Logging and Debugging

### Enable Debug Mode

```bash
# Run commands with debug output
php bin/console app:create-patient --verbose --debug
```

### View Command Logs

```bash
# View command execution logs
tail -f var/log/console.log

# View specific command logs
grep "create-patient" var/log/console.log
```

## Integration with CI/CD

### Automated Deployment

```bash
# Deploy application
php bin/console app:deploy --environment=production

# Run post-deployment tasks
php bin/console app:post-deploy --environment=production
```

### Health Checks

```bash
# Run health checks for monitoring
php bin/console app:health-check --format=json > health_status.json
```

## Next Steps

- **[API Reference](/docs/reference/api-endpoints)** - Complete API documentation
- **[Security Implementation](/docs/developer-guides/security-implementation)** - Security patterns
- **[Troubleshooting](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Live Demo](https://securehealth.dev)** - Try the system
