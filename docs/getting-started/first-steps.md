# First Steps After Installation

Congratulations! You've successfully installed SecureHealth. This guide will help you configure your instance and get familiar with the system.

## Initial Configuration

### Step 1: Access the Application

1. Open your web browser
2. Navigate to `http://localhost:8000` (or your configured domain)
3. You should see the SecureHealth login page

### Step 2: Log In with Demo Accounts

Use one of the pre-configured demo accounts:

**Admin Account**
- Username: `admin@securehealth.dev`
- Password: `admin123`
- Access: Full system administration

**Doctor Account**
- Username: `doctor@securehealth.dev`
- Password: `demo123`
- Access: Full patient data and medical records

**Nurse Account**
- Username: `nurse@securehealth.dev`
- Password: `demo123`
- Access: Medical data and patient care information

**Receptionist Account**
- Username: `receptionist@securehealth.dev`
- Password: `demo123`
- Access: Basic patient information and scheduling

## Exploring the Interface

### Dashboard Overview

After logging in, you'll see the main dashboard with:

- **Patient Search**: Quick search for patient records
- **Recent Activity**: Latest system activities and audit logs
- **Role-Specific Widgets**: Information relevant to your user role
- **Quick Actions**: Common tasks based on your permissions

### Navigation Menu

The main navigation includes:

- **Patients**: Patient management and records
- **Appointments**: Scheduling and calendar management
- **Medical Records**: Clinical data and documentation
- **Reports**: Analytics and compliance reporting
- **Admin**: System administration (admin users only)

## Understanding Role-Based Access

### Doctor Role (Full Access)
- View all patient information
- Access complete medical records
- Perform clinical decision support queries
- Manage drug interaction checking
- Access audit logs and compliance reports

### Nurse Role (Medical Data Access)
- View patient medical information
- Access care coordination tools
- Check medication administration records
- Limited access to sensitive personal data
- View relevant audit logs

### Receptionist Role (Basic Information)
- Access patient contact information
- Manage appointment scheduling
- View basic patient demographics
- Limited access to medical data
- Basic audit log viewing

## Key Features to Explore

### 1. Patient Search and Records

**Try This:**
1. Use the search bar to find a patient
2. Notice how search works on encrypted data
3. View the patient record
4. Observe how data appears differently based on your role

**What to Notice:**
- Search results are returned from encrypted data
- Different roles see different levels of detail
- Audit logs track all access attempts

### 2. Encryption Visualization

**Try This:**
1. Navigate to a patient record
2. Click the "X-Ray View" button
3. Compare encrypted vs. decrypted data views
4. Switch between different user roles

**What to Notice:**
- Raw encrypted data in the database
- How encryption preserves searchability
- Role-based data filtering in action

### 3. Audit Logging

**Try This:**
1. Perform various actions (search, view records, etc.)
2. Navigate to the Audit Logs section
3. Review the detailed access logs
4. Notice the comprehensive tracking

**What to Notice:**
- Every action is logged with timestamps
- User identity and role are tracked
- Data access patterns are recorded
- Compliance reporting capabilities

### 4. Role Switching

**Try This:**
1. Log out and log in with different user accounts
2. Perform the same actions with different roles
3. Notice how the interface and data access changes
4. Compare the audit logs between roles

**What to Notice:**
- Interface adapts to user role
- Data access is properly restricted
- Audit logs reflect role-based access
- Security controls are enforced

## Configuration Tasks

### Step 1: Update Default Passwords

**Important**: Change all default passwords before using in any environment other than development.

```bash
# Change admin password
php bin/console app:user:change-password admin@securehealth.dev

# Change demo user passwords
php bin/console app:user:change-password doctor@securehealth.dev
php bin/console app:user:change-password nurse@securehealth.dev
php bin/console app:user:change-password receptionist@securehealth.dev
```

### Step 2: Configure Encryption Keys

```bash
# Verify encryption configuration
php bin/console app:encryption:status

# List available encryption keys
php bin/console app:encryption:list-keys

# Test encryption functionality
php bin/console app:encryption:test
```

### Step 3: Set Up Monitoring

```bash
# Check system health
php bin/console app:health:check

# View system statistics
php bin/console app:stats:show

# Test audit logging
php bin/console app:audit:test
```

## Common Initial Tasks

### 1. Create Your First Patient

1. Navigate to "Patients" → "Add New Patient"
2. Fill in patient information
3. Notice how sensitive fields are encrypted
4. Save and view the patient record
5. Check the audit logs for the creation event

### 2. Schedule an Appointment

1. Go to "Appointments" → "Schedule Appointment"
2. Select a patient and time slot
3. Add appointment details
4. Save the appointment
5. Review the audit trail

### 3. View Medical Records

1. Search for a patient
2. Click on their medical records
3. Notice the role-based data filtering
4. Try the X-Ray view to see encrypted data
5. Review the access logs

### 4. Generate Reports

1. Navigate to "Reports"
2. Generate a compliance report
3. Review audit log summaries
4. Export data (if your role permits)
5. Check the audit trail for report generation

## Security Best Practices

### 1. User Management

- Create individual user accounts for each team member
- Assign appropriate roles based on job functions
- Regularly review user access and permissions
- Implement strong password policies

### 2. Audit Review

- Regularly review audit logs
- Monitor for unusual access patterns
- Set up alerts for security events
- Maintain audit log retention policies

### 3. Data Protection

- Verify encryption is working properly
- Test role-based access controls
- Validate audit logging functionality
- Ensure compliance with HIPAA requirements

## Troubleshooting Common Issues

### Login Problems

**Issue**: Cannot log in with demo accounts
**Solution**: 
```bash
# Reset demo user passwords
php bin/console app:user:reset-passwords
```

### Search Not Working

**Issue**: Patient search returns no results
**Solution**:
```bash
# Check encryption configuration
php bin/console app:encryption:status

# Verify database connection
php bin/console doctrine:mongodb:schema:validate
```

### Audit Logs Missing

**Issue**: No audit logs appearing
**Solution**:
```bash
# Enable audit logging
php bin/console app:audit:enable

# Check audit configuration
php bin/console app:audit:status
```

## Next Steps

Now that you're familiar with the basics:

1. **[Learn Security Concepts](/docs/concepts/queryable-encryption)** - Understand the underlying technology
2. **[Explore User Guides](/docs/user-guides/doctor-guide)** - Role-specific documentation
3. **[Developer Guides](/docs/developer-guides/architecture)** - Technical implementation details
4. **[Tutorials](/docs/tutorials/encryption-setup)** - Step-by-step implementation guides

## Getting Help

If you need assistance:

- Check the [troubleshooting guide](/docs/reference/troubleshooting)
- Review [GitHub issues](https://github.com/mrlynn/securehealth/issues)
- Join [community discussions](https://github.com/mrlynn/securehealth/discussions)
- Contact support through the application

---

**Congratulations!** You're now ready to explore SecureHealth's advanced features and learn how to implement similar HIPAA-compliant systems using MongoDB Queryable Encryption.
