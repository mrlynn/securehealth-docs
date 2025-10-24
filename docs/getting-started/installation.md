# Installation Guide

This comprehensive installation guide will help you set up SecureHealth for development, testing, or production environments.

## System Requirements

:::info Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **OS**: Linux, macOS, or Windows with WSL2
:::

:::success Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 20.04+, macOS 12+, Windows 11 with WSL2
:::

## Prerequisites

:::tip Required Software
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: Latest version
- **PHP**: Version 8.1+ (for local development)
- **Composer**: Latest version (for PHP dependencies)
:::

:::warning MongoDB Atlas Account
- MongoDB Atlas cluster with Queryable Encryption enabled
- Encryption key configured
- Database user with appropriate permissions
:::

## Installation Methods

### Method 1: Docker Compose (Recommended)

This is the easiest way to get started with SecureHealth.

#### Step 1: Clone the Repository

```bash title="Clone Repository"
git clone https://github.com/mrlynn/securehealth.git
cd securehealth
```

#### Step 2: Configure Environment

Create a `.env` file:

```env
# Application Configuration
APP_ENV=prod
APP_SECRET=your-super-secret-key-here
APP_DEBUG=false

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securehealth
MONGODB_DATABASE=securehealth

# Encryption Configuration
ENCRYPTION_KEY_ID=your-encryption-key-id
ENCRYPTION_KEY_VAULT_NAMESPACE=encryption.__keyVault

# Security Configuration
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_ALGORITHM=AES-256-GCM

# Logging Configuration
LOG_LEVEL=info
AUDIT_LOG_ENABLED=true
```

#### Step 3: Start Services

```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Method 2: Manual Installation

For development environments or custom configurations.

#### Step 1: Install PHP Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

#### Step 2: Configure Web Server

**Apache Configuration** (`/etc/apache2/sites-available/securehealth.conf`):

```apache
<VirtualHost *:80>
    ServerName securehealth.local
    DocumentRoot /path/to/securehealth/public
    
    <Directory /path/to/securehealth/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/securehealth_error.log
    CustomLog ${APACHE_LOG_DIR}/securehealth_access.log combined
</VirtualHost>
```

**Nginx Configuration** (`/etc/nginx/sites-available/securehealth`):

```nginx
server {
    listen 80;
    server_name securehealth.local;
    root /path/to/securehealth/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

#### Step 3: Database Setup

```bash
# Create database schema
php bin/console doctrine:mongodb:schema:create

# Load initial data
php bin/console doctrine:fixtures:load
```

## MongoDB Atlas Configuration

### Step 1: Create Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (M10 or higher recommended)
3. Enable Queryable Encryption
4. Configure network access and database users

### Step 2: Configure Encryption

1. Navigate to the Encryption section in Atlas
2. Create a new encryption key
3. Note the Key ID and Key Vault namespace
4. Configure field-level encryption rules

### Step 3: Database User Setup

Create a database user with the following permissions:
- `readWrite` on the `securehealth` database
- `readWrite` on the `encryption.__keyVault` collection

## Security Configuration

### Encryption Key Management

```bash
# Generate encryption key (development only)
openssl rand -base64 32

# For production, use a proper key management system
# such as AWS KMS, Azure Key Vault, or HashiCorp Vault
```

### Environment Security

```bash
# Set proper file permissions
chmod 600 .env
chmod -R 755 var/
chmod -R 755 public/

# Create non-root user for application
useradd -r -s /bin/false securehealth
chown -R securehealth:securehealth /path/to/securehealth
```

## Verification

### Step 1: Check Application Status

```bash
# Check if application is running
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T00:00:00Z"}
```

### Step 2: Test Database Connection

```bash
# Test MongoDB connection
php bin/console doctrine:mongodb:schema:validate

# Expected output:
# [OK] Database schema is valid
```

### Step 3: Verify Encryption

```bash
# Check encryption status
php bin/console app:encryption:status

# Expected output:
# [OK] Encryption is properly configured
# [OK] All sensitive fields are encrypted
```

## Initial Setup

### Create Admin User

```bash
# Create initial admin user
php bin/console app:user:create admin@securehealth.dev --role=ROLE_ADMIN --password=admin123
```

### Load Demo Data

```bash
# Load sample patients and medical records
php bin/console app:fixtures:load-demo-data
```

## Production Deployment

### Security Checklist

- [ ] Change all default passwords
- [ ] Configure HTTPS/TLS
- [ ] Set up proper firewall rules
- [ ] Enable audit logging
- [ ] Configure backup procedures
- [ ] Set up monitoring and alerting
- [ ] Review and test disaster recovery procedures

### Performance Optimization

```bash
# Enable OPcache
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000

# Configure MongoDB connection pooling
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=10
```

### Monitoring Setup

```bash
# Install monitoring tools
composer require symfony/monitor-bundle

# Configure logging
LOG_LEVEL=warning
LOG_CHANNELS=["app","security","audit"]
```

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MongoDB URI format
echo $MONGODB_URI

# Test connection
php bin/console doctrine:mongodb:schema:validate
```

**Encryption Key Not Found**
```bash
# Verify key configuration
php bin/console app:encryption:list-keys

# Check key vault permissions
```

**Permission Denied Errors**
```bash
# Fix file permissions
sudo chown -R www-data:www-data var/
sudo chmod -R 755 var/
```

### Getting Help

- Check the [troubleshooting guide](/docs/reference/troubleshooting)
- Review [GitHub issues](https://github.com/mrlynn/securehealth/issues)
- Join [community discussions](https://github.com/mrlynn/securehealth/discussions)

## Next Steps

After successful installation:

1. **[First Steps Guide](/docs/getting-started/first-steps)** - Configure your instance
2. **[Security Concepts](/docs/concepts/queryable-encryption)** - Learn about encryption
3. **[User Guides](/docs/user-guides/admin-guide)** - Role-specific documentation
4. **[Developer Guides](/docs/developer-guides/architecture)** - Technical details
