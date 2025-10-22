# Configuration Reference

Complete reference for all SecureHealth configuration options, including environment variables, database settings, and security configurations.

## Environment Variables

### Required Variables

```bash
# Application
APP_ENV=prod
APP_SECRET=your-secret-key-here
APP_URL=https://securehealth.dev

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/securehealth?retryWrites=true&w=majority

# MongoDB Queryable Encryption
MONGODB_ENCRYPTION_KEY_ID=your-key-id
MONGODB_ENCRYPTION_MASTER_KEY=your-master-key

# Authentication
JWT_SECRET=your-jwt-secret
JWT_TTL=3600

# Email
MAILER_DSN=smtp://username:password@smtp.example.com:587
FROM_EMAIL=noreply@securehealth.dev

# Audit Logging
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=2555
```

### Optional Variables

```bash
# Application
APP_NAME=SecureHealth
APP_VERSION=1.0.0
APP_DEBUG=false

# Database
MONGODB_DATABASE=securehealth
MONGODB_CONNECTION_TIMEOUT=30000
MONGODB_SOCKET_TIMEOUT=30000

# Security
CORS_ALLOWED_ORIGINS=https://securehealth.dev,https://www.securehealth.dev
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=/var/log/securehealth/app.log

# Monitoring
MONITORING_ENABLED=true
MONITORING_ENDPOINT=https://monitoring.securehealth.dev
```

## Database Configuration

### MongoDB Connection

```yaml
# config/packages/doctrine_mongodb.yaml
doctrine_mongodb:
    connections:
        default:
            server: '%env(MONGODB_URL)%'
            options:
                connectTimeoutMS: 30000
                socketTimeoutMS: 30000
                serverSelectionTimeoutMS: 30000
                maxPoolSize: 10
                minPoolSize: 1
    default_database: '%env(MONGODB_DATABASE)%'
    document_managers:
        default:
            auto_mapping: true
            mappings:
                App:
                    is_bundle: false
                    dir: '%kernel.project_dir%/src/Document'
                    prefix: 'App\Document'
                    alias: App
```

### Encryption Configuration

```yaml
# config/packages/encryption.yaml
encryption:
    mongodb:
        key_id: '%env(MONGODB_ENCRYPTION_KEY_ID)%'
        master_key: '%env(MONGODB_ENCRYPTION_MASTER_KEY)%'
        key_vault_namespace: 'encryption.__keyVault'
        kms_providers:
            local:
                key: '%env(MONGODB_ENCRYPTION_MASTER_KEY)%'
        schema_map:
            'securehealth.patients':
                bsonType: 'object'
                properties:
                    firstName:
                        encrypt:
                            bsonType: 'string'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                    lastName:
                        encrypt:
                            bsonType: 'string'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                    dateOfBirth:
                        encrypt:
                            bsonType: 'date'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                    email:
                        encrypt:
                            bsonType: 'string'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                    phone:
                        encrypt:
                            bsonType: 'string'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                    address:
                        encrypt:
                            bsonType: 'object'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
                    medicalHistory:
                        encrypt:
                            bsonType: 'string'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
                    labResults:
                        encrypt:
                            bsonType: 'array'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
                    prescriptions:
                        encrypt:
                            bsonType: 'array'
                            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
```

## Security Configuration

### Authentication

```yaml
# config/packages/security.yaml
security:
    encoders:
        App\Entity\User:
            algorithm: auto

    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email

    firewalls:
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false
        main:
            anonymous: true
            provider: app_user_provider
            jwt:
                secret_key: '%env(JWT_SECRET)%'
                ttl: '%env(JWT_TTL)%'
                user_identity_field: email

    access_control:
        - { path: ^/api/auth, roles: PUBLIC_ACCESS }
        - { path: ^/api/patients, roles: ROLE_DOCTOR, ROLE_NURSE, ROLE_RECEPTIONIST }
        - { path: ^/api/patients/.*/medical-history, roles: ROLE_DOCTOR, ROLE_NURSE }
        - { path: ^/api/patients/.*/lab-results, roles: ROLE_DOCTOR, ROLE_NURSE }
        - { path: ^/api/patients/.*/prescriptions, roles: ROLE_DOCTOR }
        - { path: ^/api/appointments, roles: ROLE_DOCTOR, ROLE_NURSE, ROLE_RECEPTIONIST }
        - { path: ^/api/users, roles: ROLE_ADMIN }
        - { path: ^/api/audit-logs, roles: ROLE_ADMIN, ROLE_COMPLIANCE_OFFICER }
```

### CORS Configuration

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['%env(CORS_ALLOWED_ORIGINS)%']
        allow_methods: ['%env(CORS_ALLOWED_METHODS)%']
        allow_headers: ['%env(CORS_ALLOWED_HEADERS)%']
        expose_headers: ['Link']
        max_age: 3600
    paths:
        '^/api/':
            allow_origin: ['%env(CORS_ALLOWED_ORIGINS)%']
            allow_headers: ['Content-Type', 'Authorization', 'X-Requested-With']
            allow_methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS']
            max_age: 3600
```

## Audit Logging Configuration

```yaml
# config/packages/audit.yaml
audit:
    enabled: '%env(AUDIT_LOG_ENABLED)%'
    retention_days: '%env(AUDIT_LOG_RETENTION_DAYS)%'
    log_level: info
    log_format: json
    log_file: '%env(LOG_FILE)%'
    events:
        - 'patient.view'
        - 'patient.create'
        - 'patient.update'
        - 'patient.delete'
        - 'medical_history.view'
        - 'medical_history.update'
        - 'lab_result.view'
        - 'lab_result.create'
        - 'prescription.view'
        - 'prescription.create'
        - 'prescription.update'
        - 'appointment.view'
        - 'appointment.create'
        - 'appointment.update'
        - 'appointment.delete'
        - 'user.login'
        - 'user.logout'
        - 'user.create'
        - 'user.update'
        - 'user.delete'
```

## Rate Limiting Configuration

```yaml
# config/packages/rate_limiter.yaml
framework:
    rate_limiter:
        auth_limiter:
            policy: 'token_bucket'
            limit: 5
            interval: '1 minute'
        api_limiter:
            policy: 'token_bucket'
            limit: 100
            interval: '1 minute'
        patient_data_limiter:
            policy: 'token_bucket'
            limit: 50
            interval: '1 minute'
        audit_log_limiter:
            policy: 'token_bucket'
            limit: 20
            interval: '1 minute'
```

## Email Configuration

```yaml
# config/packages/mailer.yaml
framework:
    mailer:
        dsn: '%env(MAILER_DSN)%'
        envelope:
            sender: '%env(FROM_EMAIL)%'
```

## Monitoring Configuration

```yaml
# config/packages/monitoring.yaml
monitoring:
    enabled: '%env(MONITORING_ENABLED)%'
    endpoint: '%env(MONITORING_ENDPOINT)%'
    metrics:
        - 'http_requests_total'
        - 'http_request_duration_seconds'
        - 'database_connections_active'
        - 'database_queries_total'
        - 'encryption_operations_total'
        - 'audit_logs_total'
```

## Logging Configuration

```yaml
# config/packages/monolog.yaml
monolog:
    handlers:
        main:
            type: stream
            path: '%env(LOG_FILE)%'
            level: '%env(LOG_LEVEL)%'
            formatter: monolog.formatter.json
        console:
            type: console
            level: '%env(LOG_LEVEL)%'
            formatter: monolog.formatter.line
```

## Next Steps

- **[Environment Variables](/docs/reference/environment-variables)** - Environment setup
- **[Troubleshooting](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Glossary](/docs/reference/glossary)** - Technical terms and definitions
