# Quick Start Guide

Get up and running with SecureHealth in just 5 minutes! This guide will help you set up a local instance of SecureHealth for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Git**: For cloning the repository
- **Node.js**: Version 18 or later (for documentation)

## Option 1: Try the Live Demo (Recommended)

The fastest way to experience SecureHealth is through our live demo:

1. Visit [securehealth.dev](https://securehealth.dev)
2. Click "Start Demo" to begin
3. Explore different user roles and features
4. No installation required!

## Option 2: Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/mrlynn/securehealth.git
cd securehealth
```

### Step 2: Environment Configuration

Create a `.env` file in the project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/securehealth
MONGODB_DATABASE=securehealth

# Encryption Configuration
ENCRYPTION_KEY_ID=your-key-id
ENCRYPTION_KEY_VAULT_NAMESPACE=encryption.__keyVault

# Application Configuration
APP_ENV=dev
APP_SECRET=your-secret-key
```

### Step 3: Start with Docker

```bash
# Start MongoDB with Queryable Encryption
docker-compose up -d mongodb

# Install dependencies
composer install

# Run database migrations
php bin/console doctrine:mongodb:schema:create

# Start the application
docker-compose up -d
```

### Step 4: Access the Application

- **Application**: http://localhost:8000
- **Documentation**: http://localhost:3000 (if running locally)

## Demo User Accounts

The system comes with pre-configured demo accounts:

### Doctor Account
- **Username**: `doctor@securehealth.dev`
- **Password**: `demo123`
- **Access**: Full patient data, medical records, all features

### Nurse Account
- **Username**: `nurse@securehealth.dev`
- **Password**: `demo123`
- **Access**: Medical data, patient care information

### Receptionist Account
- **Username**: `receptionist@securehealth.dev`
- **Password**: `demo123`
- **Access**: Basic patient information, scheduling

## First Steps After Installation

### 1. Explore the Interface
- Log in with different user accounts
- Notice how the interface changes based on your role
- Try searching for patients and viewing records

### 2. Examine Encrypted Data
- Use the "X-Ray View" feature to see raw encrypted data
- Compare how data appears to different user roles
- Review the audit logs to see access tracking

### 3. Test Search Functionality
- Search for patients by name (deterministic encryption)
- Filter by date ranges (range encryption)
- Notice how searches work on encrypted data

### 4. Review Audit Logs
- Check the audit trail for your actions
- See how access is logged and tracked
- Understand compliance reporting features

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Restart MongoDB if needed
docker-compose restart mongodb
```

**Encryption Key Issues**
- Ensure your encryption key is properly configured
- Check the key vault namespace configuration
- Verify key permissions in MongoDB Atlas

**Permission Errors**
- Check file permissions in the project directory
- Ensure Docker has proper access to the project folder

### Getting Help

If you encounter issues:

1. Check the [troubleshooting guide](/docs/reference/troubleshooting)
2. Review the [GitHub issues](https://github.com/mrlynn/securehealth/issues)
3. Join our [community discussions](https://github.com/mrlynn/securehealth/discussions)

## Next Steps

Now that you have SecureHealth running:

1. **[Learn about Security Concepts](/docs/concepts/queryable-encryption)** - Understand the underlying technology
2. **[Explore User Guides](/docs/user-guides/doctor-guide)** - Role-specific documentation
3. **[Developer Guides](/docs/developer-guides/architecture)** - Technical implementation details
4. **[Tutorials](/docs/tutorials/encryption-setup)** - Step-by-step implementation guides

## Production Considerations

⚠️ **Important**: This quick start guide is for development and demonstration purposes only. For production deployment, see our [deployment guide](/docs/developer-guides/deployment) which covers:

- Production security configurations
- Key management best practices
- Performance optimization
- Monitoring and alerting
- Backup and recovery procedures
