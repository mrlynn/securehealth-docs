# Troubleshooting Guide

Common issues and solutions for SecureHealth, including error messages, debugging tips, and performance optimization.

## Common Issues

### Database Connection Issues

#### Problem: MongoDB Connection Failed

**Error Message:**
```
MongoDB connection failed: Authentication failed
```

**Solutions:**
1. Check MongoDB connection string format
2. Verify username and password
3. Ensure IP whitelist includes your server
4. Check network connectivity

**Debug Steps:**
```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/securehealth"

# Check network connectivity
ping cluster.mongodb.net

# Verify IP whitelist
# Check MongoDB Atlas Network Access settings
```

#### Problem: Encryption Key Issues

**Error Message:**
```
Encryption key not found or invalid
```

**Solutions:**
1. Verify encryption key ID exists
2. Check master key format
3. Ensure key vault is accessible
4. Verify key permissions

**Debug Steps:**
```bash
# Check encryption key
node -e "
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.DATABASE_URL);
client.connect().then(() => {
  const keyVault = client.db('encryption').collection('__keyVault');
  return keyVault.findOne({_id: process.env.MONGODB_ENCRYPTION_KEY_ID});
}).then(key => {
  console.log('Key found:', !!key);
  client.close();
});
"
```

### Authentication Issues

#### Problem: JWT Token Invalid

**Error Message:**
```
JWT token is invalid or expired
```

**Solutions:**
1. Check JWT secret configuration
2. Verify token expiration time
3. Ensure token format is correct
4. Check clock synchronization

**Debug Steps:**
```bash
# Decode JWT token
echo "your-jwt-token" | base64 -d

# Check token expiration
node -e "
const jwt = require('jsonwebtoken');
const token = 'your-jwt-token';
try {
  const decoded = jwt.decode(token);
  console.log('Token expires:', new Date(decoded.exp * 1000));
} catch (e) {
  console.log('Invalid token:', e.message);
}
"
```

#### Problem: Role-Based Access Denied

**Error Message:**
```
Access denied: Insufficient permissions
```

**Solutions:**
1. Verify user roles
2. Check role assignments
3. Ensure proper role hierarchy
4. Verify resource permissions

**Debug Steps:**
```php
// Check user roles
$user = $this->getUser();
$roles = $user->getRoles();
$permissions = $this->getUserPermissions($user);

// Log role information
$this->logger->info('User roles', ['roles' => $roles, 'permissions' => $permissions]);
```

### Encryption Issues

#### Problem: Encryption/Decryption Failed

**Error Message:**
```
Failed to encrypt/decrypt data
```

**Solutions:**
1. Check encryption configuration
2. Verify key vault access
3. Ensure proper schema mapping
4. Check data format compatibility

**Debug Steps:**
```php
// Test encryption
$encrypted = $this->encryptionService->encrypt('test data');
$decrypted = $this->encryptionService->decrypt($encrypted);

if ($decrypted !== 'test data') {
    throw new \Exception('Encryption test failed');
}
```

#### Problem: Query Performance Issues

**Error Message:**
```
Query execution timeout
```

**Solutions:**
1. Add database indexes
2. Optimize query patterns
3. Use proper encryption types
4. Monitor query performance

**Debug Steps:**
```bash
# Check query performance
mongosh --eval "
db.patients.explain('executionStats').find({firstName: 'John'})
"

# Check indexes
mongosh --eval "
db.patients.getIndexes()
"
```

### API Issues

#### Problem: CORS Errors

**Error Message:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solutions:**
1. Check CORS configuration
2. Verify allowed origins
3. Ensure proper headers
4. Check preflight requests

**Debug Steps:**
```bash
# Test CORS
curl -H "Origin: https://securehealth.dev" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.securehealth.dev/api/patients
```

#### Problem: Rate Limiting

**Error Message:**
```
Rate limit exceeded
```

**Solutions:**
1. Check rate limit configuration
2. Implement proper caching
3. Use request queuing
4. Monitor API usage

**Debug Steps:**
```bash
# Check rate limit headers
curl -I https://api.securehealth.dev/api/patients

# Response headers:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 95
# X-RateLimit-Reset: 1642248000
```

## Performance Issues

### Slow Database Queries

**Symptoms:**
- High response times
- Database connection timeouts
- Memory usage spikes

**Solutions:**
1. **Add Indexes**
```javascript
// Create indexes for encrypted fields
db.patients.createIndex({ "firstName": 1 })
db.patients.createIndex({ "lastName": 1 })
db.patients.createIndex({ "dateOfBirth": 1 })
```

2. **Optimize Queries**
```php
// Use projection to limit returned fields
$patients = $this->patientRepository->findBy(
    ['firstName' => 'John'],
    ['firstName' => 'ASC'],
    10,
    0,
    ['firstName', 'lastName', 'dateOfBirth']
);
```

3. **Use Connection Pooling**
```yaml
# config/packages/doctrine_mongodb.yaml
doctrine_mongodb:
    connections:
        default:
            options:
                maxPoolSize: 10
                minPoolSize: 1
                maxIdleTimeMS: 30000
```

### Memory Issues

**Symptoms:**
- High memory usage
- Out of memory errors
- Slow garbage collection

**Solutions:**
1. **Optimize Data Loading**
```php
// Use pagination
$patients = $this->patientRepository->findBy(
    [],
    [],
    $limit,
    $offset
);

// Use lazy loading
$patient = $this->patientRepository->find($id);
$labResults = $patient->getLabResults(); // Lazy loaded
```

2. **Implement Caching**
```php
// Use Redis cache
$cacheKey = "patient_{$id}";
$patient = $this->cache->get($cacheKey, function() use ($id) {
    return $this->patientRepository->find($id);
});
```

## Debugging Tips

### Enable Debug Mode

```bash
# Set debug environment
APP_ENV=dev
APP_DEBUG=true
LOG_LEVEL=debug
```

### Log Analysis

```bash
# Monitor logs in real-time
tail -f /var/log/securehealth/app.log

# Search for specific errors
grep "ERROR" /var/log/securehealth/app.log

# Analyze performance
grep "slow query" /var/log/securehealth/app.log
```

### Database Monitoring

```bash
# Check database status
mongosh --eval "db.runCommand({serverStatus: 1})"

# Monitor connections
mongosh --eval "db.runCommand({currentOp: 1})"

# Check index usage
mongosh --eval "db.patients.aggregate([{$indexStats: {}}])"
```

### API Testing

```bash
# Test API endpoints
curl -X GET https://api.securehealth.dev/api/patients \
     -H "Authorization: Bearer your-jwt-token"

# Test with verbose output
curl -v -X POST https://api.securehealth.dev/api/patients \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-jwt-token" \
     -d '{"firstName": "John", "lastName": "Doe"}'
```

## Error Codes Reference

### HTTP Status Codes

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service temporarily unavailable

### Application Error Codes

- **ENCRYPTION_ERROR**: Encryption/decryption failed
- **DATABASE_ERROR**: Database operation failed
- **VALIDATION_ERROR**: Input validation failed
- **AUTHENTICATION_ERROR**: Authentication failed
- **AUTHORIZATION_ERROR**: Authorization failed
- **RATE_LIMIT_ERROR**: Rate limit exceeded
- **AUDIT_ERROR**: Audit logging failed

## Getting Help

### Support Channels

1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check this guide and API reference
3. **Community Forum**: Ask questions and share solutions
4. **Email Support**: Contact support@securehealth.dev

### Reporting Issues

When reporting issues, include:

1. **Environment Details**
   - Operating system
   - PHP version
   - MongoDB version
   - Application version

2. **Error Information**
   - Error message
   - Stack trace
   - Log files
   - Steps to reproduce

3. **Configuration**
   - Environment variables (sanitized)
   - Configuration files
   - Database schema

## Next Steps

- **[API Endpoints Reference](/docs/reference/api-endpoints)** - Complete API documentation
- **[Configuration Reference](/docs/reference/configuration)** - All configuration options
- **[Environment Variables](/docs/reference/environment-variables)** - Environment setup
- **[Glossary](/docs/reference/glossary)** - Technical terms and definitions
