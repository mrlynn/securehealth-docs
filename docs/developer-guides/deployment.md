# Production Deployment

This guide covers the complete process of deploying SecureHealth to production, including infrastructure setup, security configuration, monitoring, and maintenance procedures.

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        A[Load Balancer] --> B[Web Servers]
        B --> C[Application Servers]
        C --> D[Database Cluster]
        D --> E[Backup Storage]
    end
    
    subgraph "Security Layer"
        F[WAF] --> G[SSL/TLS]
        G --> H[Firewall]
        H --> I[Network Segmentation]
    end
    
    subgraph "Monitoring"
        J[Application Monitoring] --> K[Security Monitoring]
        K --> L[Compliance Monitoring]
        L --> M[Alerting]
    end
```

## Infrastructure Requirements

### Minimum Production Requirements

**Server Specifications**
- **CPU**: 4+ cores per server
- **RAM**: 8GB+ per server
- **Storage**: 100GB+ SSD per server
- **Network**: 1Gbps+ bandwidth
- **OS**: Ubuntu 20.04 LTS or CentOS 8+

**Database Requirements**
- **MongoDB Atlas**: M10 cluster or higher
- **Storage**: 100GB+ with auto-scaling
- **Backup**: Point-in-time recovery enabled
- **Monitoring**: MongoDB Atlas monitoring

### Recommended Production Setup

**High Availability Configuration**
- **Load Balancer**: AWS Application Load Balancer or similar
- **Web Servers**: 2+ Nginx instances
- **Application Servers**: 3+ Symfony instances
- **Database**: MongoDB Atlas cluster with replica sets
- **Cache**: Redis cluster for session storage
- **CDN**: CloudFront or similar for static assets

## Environment Configuration

### Production Environment Variables

**Application Configuration**
```bash
# Application
APP_ENV=prod
APP_SECRET=your-super-secret-key-here
APP_DEBUG=false

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securehealth
MONGODB_DATABASE=securehealth

# Encryption Configuration
ENCRYPTION_KEY_ID=your-encryption-key-id
ENCRYPTION_KEY_VAULT_NAMESPACE=encryption.__keyVault
ENCRYPTION_MASTER_KEY=your-master-key-base64-encoded

# Security Configuration
JWT_SECRET=your-jwt-secret-key
JWT_LIFETIME=3600
ENCRYPTION_ALGORITHM=AES-256-GCM

# Logging Configuration
LOG_LEVEL=warning
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION=7_years

# Performance Configuration
OPCACHE_ENABLE=1
OPCACHE_MEMORY_CONSUMPTION=256
OPCACHE_MAX_ACCELERATED_FILES=20000
```

**Database Configuration**
```bash
# MongoDB Connection
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=10
MONGODB_MAX_IDLE_TIME=30000
MONGODB_SERVER_SELECTION_TIMEOUT=5000

# Encryption Settings
ENCRYPTION_SCHEMA_PATH=/app/config/encryption-schema.json
KEY_VAULT_COLLECTION=encryption.__keyVault
```

### Security Configuration

**SSL/TLS Configuration**
```nginx
# Nginx SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options DENY always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

**Firewall Configuration**
```bash
# UFW Firewall Rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Additional security rules
ufw deny 22/tcp from any to any port 22
ufw allow 22/tcp from 192.168.1.0/24
```

## Deployment Process

### 1. Infrastructure Setup

**Server Provisioning**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx php8.1-fpm php8.1-mongodb php8.1-curl php8.1-mbstring php8.1-xml php8.1-zip

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Nginx Configuration**
```nginx
# /etc/nginx/sites-available/securehealth
server {
    listen 80;
    server_name securehealth.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name securehealth.dev;
    
    root /var/www/securehealth/public;
    index index.php;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/securehealth.crt;
    ssl_certificate_key /etc/ssl/private/securehealth.key;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
```

### 2. Application Deployment

**Deployment Script**
```bash
#!/bin/bash
# deploy.sh

set -e

# Configuration
APP_DIR="/var/www/securehealth"
BACKUP_DIR="/var/backups/securehealth"
REPO_URL="https://github.com/mrlynn/securehealth.git"
BRANCH="main"

echo "Starting deployment..."

# Create backup
if [ -d "$APP_DIR" ]; then
    echo "Creating backup..."
    sudo cp -r "$APP_DIR" "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
fi

# Clone or update repository
if [ -d "$APP_DIR" ]; then
    echo "Updating repository..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
else
    echo "Cloning repository..."
    sudo git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# Install dependencies
echo "Installing dependencies..."
sudo composer install --no-dev --optimize-autoloader
sudo npm install --production

# Build assets
echo "Building assets..."
sudo npm run build

# Set permissions
echo "Setting permissions..."
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"
sudo chmod -R 777 "$APP_DIR/var"

# Clear cache
echo "Clearing cache..."
sudo -u www-data php bin/console cache:clear --env=prod

# Run database migrations
echo "Running database migrations..."
sudo -u www-data php bin/console doctrine:mongodb:schema:update --env=prod

# Restart services
echo "Restarting services..."
sudo systemctl reload nginx
sudo systemctl reload php8.1-fpm

echo "Deployment completed successfully!"
```

### 3. Database Setup

**MongoDB Atlas Configuration**
```javascript
// MongoDB Atlas cluster configuration
{
  "clusterName": "securehealth-prod",
  "provider": "AWS",
  "region": "us-east-1",
  "tier": "M10",
  "backupEnabled": true,
  "encryptionAtRest": true,
  "encryptionInTransit": true,
  "queryableEncryption": true
}
```

**Encryption Key Setup**
```bash
# Generate encryption key
openssl rand -base64 32

# Store key in secure location
echo "ENCRYPTION_MASTER_KEY=$(openssl rand -base64 32)" >> /etc/environment
```

**Database Initialization**
```bash
# Create database schema
php bin/console doctrine:mongodb:schema:create --env=prod

# Create indexes
php bin/console doctrine:mongodb:schema:update --env=prod

# Load initial data
php bin/console app:fixtures:load-demo-data --env=prod
```

## Security Configuration

### 1. Encryption Setup

**MongoDB Queryable Encryption Configuration**
```javascript
// encryption-schema.json
{
  "securehealth.patients": {
    "bsonType": "object",
    "encryptMetadata": {
      "keyId": "/keyId",
      "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    },
    "properties": {
      "patientId": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "firstName": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "lastName": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      },
      "dateOfBirth": {
        "encrypt": {
          "bsonType": "date",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "ssn": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "medicalHistory": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
}
```

### 2. Access Control

**User Management**
```bash
# Create admin user
php bin/console app:user:create admin@securehealth.dev --role=ROLE_ADMIN --password=securepassword123

# Create demo users
php bin/console app:user:create doctor@securehealth.dev --role=ROLE_DOCTOR --password=demo123
php bin/console app:user:create nurse@securehealth.dev --role=ROLE_NURSE --password=demo123
php bin/console app:user:create receptionist@securehealth.dev --role=ROLE_RECEPTIONIST --password=demo123
```

**Permission Configuration**
```php
<?php
// config/packages/security.php
return [
    'security' => [
        'password_hashers' => [
            App\Entity\User::class => [
                'algorithm' => 'auto',
                'cost' => 12,
            ],
        ],
        'providers' => [
            'app_user_provider' => [
                'entity' => [
                    'class' => App\Entity\User::class,
                    'property' => 'email',
                ],
            ],
        ],
        'firewalls' => [
            'api' => [
                'pattern' => '^/api',
                'stateless' => true,
                'jwt' => [
                    'secret_key' => '%env(JWT_SECRET)%',
                    'public_key' => '%env(JWT_PUBLIC_KEY)%',
                    'algorithm' => 'HS256',
                ],
            ],
        ],
        'access_control' => [
            ['path' => '^/api/patients', 'roles' => 'ROLE_USER'],
            ['path' => '^/api/patients/.*/medical', 'roles' => 'ROLE_DOCTOR'],
            ['path' => '^/api/users', 'roles' => 'ROLE_ADMIN'],
            ['path' => '^/api/audit-logs', 'roles' => 'ROLE_ADMIN'],
        ],
    ],
];
```

## Monitoring and Alerting

### 1. Application Monitoring

**Prometheus Configuration**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'securehealth'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: /metrics
    scrape_interval: 5s
```

**Grafana Dashboard**
```json
{
  "dashboard": {
    "title": "SecureHealth Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}
```

### 2. Security Monitoring

**Security Alerts Configuration**
```yaml
# security-alerts.yml
groups:
  - name: security
    rules:
      - alert: HighFailedLoginRate
        expr: rate(authentication_failures_total[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High failed login rate detected"
          description: "Failed login rate is {{ $value }} per second"

      - alert: PrivilegeEscalation
        expr: increase(privilege_escalation_total[1h]) > 0
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "Privilege escalation detected"
          description: "{{ $value }} privilege escalation attempts in the last hour"

      - alert: ExcessiveDataAccess
        expr: rate(data_access_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Excessive data access detected"
          description: "Data access rate is {{ $value }} per second"
```

### 3. Compliance Monitoring

**HIPAA Compliance Checks**
```bash
#!/bin/bash
# compliance-check.sh

echo "Running HIPAA compliance checks..."

# Check encryption status
echo "Checking encryption status..."
php bin/console app:encryption:status --env=prod

# Check audit logging
echo "Checking audit logging..."
php bin/console app:audit:status --env=prod

# Check access controls
echo "Checking access controls..."
php bin/console app:security:check --env=prod

# Generate compliance report
echo "Generating compliance report..."
php bin/console app:compliance:report --env=prod

echo "Compliance checks completed."
```

## Backup and Recovery

### 1. Database Backup

**Automated Backup Script**
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/securehealth"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/securehealth_$DATE.tar.gz"

echo "Starting backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup application files
tar -czf "$BACKUP_FILE" /var/www/securehealth

# Backup database (MongoDB Atlas handles this automatically)
# Additional local backup if needed
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/mongodb_$DATE"

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -name "securehealth_*.tar.gz" -mtime +30 -delete
find "$BACKUP_DIR" -name "mongodb_*" -mtime +30 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_FILE"
```

**Cron Job Configuration**
```bash
# Add to crontab
0 2 * * * /var/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### 2. Disaster Recovery

**Recovery Procedures**
```bash
#!/bin/bash
# recovery.sh

BACKUP_FILE="$1"
RECOVERY_DIR="/var/www/securehealth"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "Starting recovery from $BACKUP_FILE..."

# Stop services
sudo systemctl stop nginx
sudo systemctl stop php8.1-fpm

# Restore application files
tar -xzf "$BACKUP_FILE" -C /

# Restore database
mongorestore --uri="$MONGODB_URI" "$BACKUP_DIR/mongodb_$(basename $BACKUP_FILE .tar.gz | cut -d_ -f2-)"

# Set permissions
sudo chown -R www-data:www-data "$RECOVERY_DIR"
sudo chmod -R 755 "$RECOVERY_DIR"
sudo chmod -R 777 "$RECOVERY_DIR/var"

# Clear cache
sudo -u www-data php bin/console cache:clear --env=prod

# Start services
sudo systemctl start php8.1-fpm
sudo systemctl start nginx

echo "Recovery completed successfully!"
```

## Performance Optimization

### 1. Application Optimization

**PHP Configuration**
```ini
; /etc/php/8.1/fpm/php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.enable_file_override=1

memory_limit=512M
max_execution_time=30
max_input_time=30
post_max_size=32M
upload_max_filesize=32M
```

**Nginx Configuration**
```nginx
# Performance optimizations
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

location /api {
    limit_req zone=api burst=20 nodelay;
    try_files $uri $uri/ /index.php?$query_string;
}

location /auth/login {
    limit_req zone=login burst=5 nodelay;
    try_files $uri $uri/ /index.php?$query_string;
}
```

### 2. Database Optimization

**MongoDB Indexes**
```javascript
// Create performance indexes
db.patients.createIndex({ "patientId": 1 }, { unique: true })
db.patients.createIndex({ "firstName": 1, "lastName": 1 })
db.patients.createIndex({ "dateOfBirth": 1 })
db.patients.createIndex({ "appointments.date": 1 })
db.patients.createIndex({ "labResults.testDate": 1 })

// Text search index
db.patients.createIndex({ "firstName": "text", "lastName": "text", "patientId": "text" })
```

**Connection Pooling**
```php
<?php
// config/packages/doctrine_mongodb.php
return [
    'doctrine_mongodb' => [
        'connections' => [
            'default' => [
                'server' => '%env(MONGODB_URI)%',
                'options' => [
                    'maxPoolSize' => 100,
                    'minPoolSize' => 10,
                    'maxIdleTimeMS' => 30000,
                    'serverSelectionTimeoutMS' => 5000,
                ],
            ],
        ],
    ],
];
```

## Maintenance Procedures

### 1. Regular Maintenance

**Daily Maintenance**
```bash
#!/bin/bash
# daily-maintenance.sh

echo "Running daily maintenance..."

# Check system health
php bin/console app:health:check --env=prod

# Check disk space
df -h

# Check log files
tail -n 100 /var/log/nginx/error.log
tail -n 100 /var/log/php8.1-fpm.log

# Check security alerts
php bin/console app:security:alerts --env=prod

echo "Daily maintenance completed."
```

**Weekly Maintenance**
```bash
#!/bin/bash
# weekly-maintenance.sh

echo "Running weekly maintenance..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean up old logs
sudo find /var/log -name "*.log" -mtime +7 -delete

# Optimize database
php bin/console doctrine:mongodb:schema:update --env=prod

# Generate compliance report
php bin/console app:compliance:report --env=prod

echo "Weekly maintenance completed."
```

### 2. Security Updates

**Security Update Procedure**
```bash
#!/bin/bash
# security-update.sh

echo "Applying security updates..."

# Update packages
sudo apt update && sudo apt upgrade -y

# Update Composer dependencies
composer update --no-dev --optimize-autoloader

# Update npm dependencies
npm update --production

# Clear cache
php bin/console cache:clear --env=prod

# Restart services
sudo systemctl reload nginx
sudo systemctl reload php8.1-fpm

echo "Security updates applied successfully."
```

## Troubleshooting

### Common Issues

**Performance Issues**
```bash
# Check system resources
htop
df -h
free -h

# Check application logs
tail -f /var/log/nginx/error.log
tail -f /var/log/php8.1-fpm.log

# Check database performance
php bin/console app:database:status --env=prod
```

**Security Issues**
```bash
# Check security status
php bin/console app:security:status --env=prod

# Check audit logs
php bin/console app:audit:logs --env=prod

# Check encryption status
php bin/console app:encryption:status --env=prod
```

**Database Issues**
```bash
# Check database connection
php bin/console doctrine:mongodb:schema:validate --env=prod

# Check database performance
php bin/console app:database:performance --env=prod

# Check backup status
php bin/console app:backup:status --env=prod
```

## Next Steps

- **[Tutorials](/docs/tutorials/encryption-setup)** - Step-by-step implementation guides
- **[Reference](/docs/reference/troubleshooting)** - Common issues and solutions
- **[Community](/docs/community/support)** - Getting help and support
- **[Roadmap](/docs/community/roadmap)** - Future plans and features
