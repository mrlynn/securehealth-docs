# Environment Variables Reference

Complete reference for all SecureHealth environment variables, including setup instructions and examples.

## Required Variables

### Application Configuration

```bash
# Application Environment
APP_ENV=prod                    # Environment: dev, test, prod
APP_SECRET=your-secret-key-here # 32-character random string
APP_URL=https://securehealth.dev # Base URL for the application
```

**Setup:**
```bash
# Generate a secure secret key
openssl rand -hex 32
```

### Database Configuration

```bash
# MongoDB Connection
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/securehealth?retryWrites=true&w=majority
MONGODB_DATABASE=securehealth
MONGODB_CONNECTION_TIMEOUT=30000
MONGODB_SOCKET_TIMEOUT=30000
```

**Setup:**
```bash
# Create MongoDB Atlas cluster
# Get connection string from Atlas dashboard
# Replace username, password, and cluster URL
```

### Encryption Configuration

```bash
# MongoDB Queryable Encryption
MONGODB_ENCRYPTION_KEY_ID=your-key-id
MONGODB_ENCRYPTION_MASTER_KEY=your-master-key
```

**Setup:**
```bash
# Generate encryption keys
node -e "console.log(require('crypto').randomBytes(96).toString('base64'))"
```

### Authentication Configuration

```bash
# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_TTL=3600
```

**Setup:**
```bash
# Generate JWT secret
openssl rand -hex 32
```

### Email Configuration

```bash
# Email Service
MAILER_DSN=smtp://username:password@smtp.example.com:587
FROM_EMAIL=noreply@securehealth.dev
```

**Setup:**
```bash
# Configure SMTP server
# Use services like SendGrid, Mailgun, or AWS SES
```

### Audit Logging Configuration

```bash
# Audit Logging
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=2555
```

## Optional Variables

### Application Settings

```bash
# Application Details
APP_NAME=SecureHealth
APP_VERSION=1.0.0
APP_DEBUG=false
```

### Security Settings

```bash
# CORS Configuration
CORS_ALLOWED_ORIGINS=https://securehealth.dev,https://www.securehealth.dev
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
```

### Rate Limiting

```bash
# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

### Logging Configuration

```bash
# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=/var/log/securehealth/app.log
```

### Monitoring Configuration

```bash
# Monitoring
MONITORING_ENABLED=true
MONITORING_ENDPOINT=https://monitoring.securehealth.dev
```

## Environment Setup

### Development Environment

Create a `.env.local` file for local development:

```bash
# .env.local
APP_ENV=dev
APP_SECRET=dev-secret-key-32-characters-long
APP_URL=http://localhost:8000

# MongoDB (use local MongoDB or Atlas)
DATABASE_URL=mongodb://localhost:27017/securehealth_dev
MONGODB_DATABASE=securehealth_dev

# Encryption (use test keys for development)
MONGODB_ENCRYPTION_KEY_ID=dev-key-id
MONGODB_ENCRYPTION_MASTER_KEY=dev-master-key

# JWT
JWT_SECRET=dev-jwt-secret-32-characters-long
JWT_TTL=3600

# Email (use MailHog or similar for development)
MAILER_DSN=smtp://localhost:1025
FROM_EMAIL=noreply@localhost

# Audit Logging
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=30

# CORS (allow localhost for development)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=line
LOG_FILE=var/log/dev.log
```

### Production Environment

Set environment variables in your production environment:

```bash
# Production Environment Variables
APP_ENV=prod
APP_SECRET=production-secret-key-32-characters-long
APP_URL=https://securehealth.dev

# MongoDB Atlas
DATABASE_URL=mongodb+srv://prod-user:prod-password@prod-cluster.mongodb.net/securehealth?retryWrites=true&w=majority
MONGODB_DATABASE=securehealth

# Production Encryption Keys
MONGODB_ENCRYPTION_KEY_ID=prod-key-id
MONGODB_ENCRYPTION_MASTER_KEY=prod-master-key

# JWT
JWT_SECRET=production-jwt-secret-32-characters-long
JWT_TTL=3600

# Production Email Service
MAILER_DSN=smtp://prod-user:prod-password@smtp.sendgrid.net:587
FROM_EMAIL=noreply@securehealth.dev

# Audit Logging
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=2555

# CORS
CORS_ALLOWED_ORIGINS=https://securehealth.dev,https://www.securehealth.dev

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

## Docker Environment

Create a `docker-compose.yml` file for containerized deployment:

```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - APP_ENV=prod
      - APP_SECRET=${APP_SECRET}
      - APP_URL=${APP_URL}
      - DATABASE_URL=${DATABASE_URL}
      - MONGODB_DATABASE=${MONGODB_DATABASE}
      - MONGODB_ENCRYPTION_KEY_ID=${MONGODB_ENCRYPTION_KEY_ID}
      - MONGODB_ENCRYPTION_MASTER_KEY=${MONGODB_ENCRYPTION_MASTER_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_TTL=${JWT_TTL}
      - MAILER_DSN=${MAILER_DSN}
      - FROM_EMAIL=${FROM_EMAIL}
      - AUDIT_LOG_ENABLED=${AUDIT_LOG_ENABLED}
      - AUDIT_LOG_RETENTION_DAYS=${AUDIT_LOG_RETENTION_DAYS}
      - CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
      - RATE_LIMIT_ENABLED=${RATE_LIMIT_ENABLED}
      - RATE_LIMIT_REQUESTS=${RATE_LIMIT_REQUESTS}
      - RATE_LIMIT_WINDOW=${RATE_LIMIT_WINDOW}
      - LOG_LEVEL=${LOG_LEVEL}
      - LOG_FORMAT=${LOG_FORMAT}
      - LOG_FILE=${LOG_FILE}
      - MONITORING_ENABLED=${MONITORING_ENABLED}
      - MONITORING_ENDPOINT=${MONITORING_ENDPOINT}
    ports:
      - "8000:8000"
    volumes:
      - ./var/log:/var/log/securehealth
```

## Environment Validation

Create a validation script to check required environment variables:

```php
<?php
// scripts/validate-env.php

$required = [
    'APP_ENV',
    'APP_SECRET',
    'APP_URL',
    'DATABASE_URL',
    'MONGODB_ENCRYPTION_KEY_ID',
    'MONGODB_ENCRYPTION_MASTER_KEY',
    'JWT_SECRET',
    'MAILER_DSN',
    'FROM_EMAIL',
    'AUDIT_LOG_ENABLED',
    'AUDIT_LOG_RETENTION_DAYS'
];

$missing = [];
foreach ($required as $var) {
    if (!getenv($var)) {
        $missing[] = $var;
    }
}

if (!empty($missing)) {
    echo "Missing required environment variables:\n";
    foreach ($missing as $var) {
        echo "  - $var\n";
    }
    exit(1);
}

echo "All required environment variables are set.\n";
```

## Security Best Practices

### Environment Variable Security

1. **Never commit secrets to version control**
2. **Use different secrets for each environment**
3. **Rotate secrets regularly**
4. **Use environment variable management tools**
5. **Encrypt sensitive environment variables**

### Secret Management Tools

- **HashiCorp Vault**: Enterprise secret management
- **AWS Secrets Manager**: Cloud-based secret storage
- **Azure Key Vault**: Microsoft's secret management
- **Kubernetes Secrets**: Container orchestration secrets

## Next Steps

- **[Configuration Reference](/docs/reference/configuration)** - All configuration options
- **[Troubleshooting](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Glossary](/docs/reference/glossary)** - Technical terms and definitions
