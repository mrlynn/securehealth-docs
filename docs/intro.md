# Welcome to SecureHealth Documentation

SecureHealth is a production-ready, HIPAA-compliant medical records management system that demonstrates advanced data protection using **MongoDB 8.2 Queryable Encryption** with PHP/Symfony. This project serves as both a functional healthcare application and a comprehensive educational resource for developers learning secure data handling practices in healthcare environments.

## What is SecureHealth?

SecureHealth is a comprehensive medical records management system built with **MongoDB 8.2 Queryable Encryption** and **Symfony Security Voters** for HIPAA-compliant healthcare data protection. The system demonstrates real-world implementation of field-level encryption, role-based access control, and comprehensive audit logging required for healthcare compliance.

**Open Source Project:** View the complete source code, documentation, and contribute at [github.com/mrlynn/securehealth](https://github.com/mrlynn/securehealth)

## Key Features

### 🔒 MongoDB 8.2 Queryable Encryption
- **Field-Level Encryption**: All PHI encrypted at the field level
- **Deterministic Encryption**: Searchable fields (name, email, phone)
- **Range Encryption**: Date and numeric range queries on encrypted data
- **Standard Encryption**: Maximum security for highly sensitive data (SSN, diagnosis)
- **Client-Side Encryption**: Data encrypted before reaching the database

### 🛡️ HIPAA-Compliant Security & RBAC
- **Symfony Security Voters**: Fine-grained permission system
- **Role-Based Access Control**: Doctor, Nurse, Receptionist, Admin roles
- **Comprehensive Audit Logging**: Complete access trail for compliance
- **Data Integrity Protection**: Ensures data hasn't been tampered with
- **Transmission Security**: HTTPS and secure API endpoints

### 🤖 AI Documentation Assistant
- **SOAP Note Generation**: AI-powered clinical documentation
- **OpenAI Integration**: GPT-4 powered medical note generation
- **Confidence Scoring**: AI confidence levels for generated content
- **HIPAA-Compliant**: Secure handling of patient data in AI prompts

### 🛠️ Command-Line Management Tool
- **Patient Management**: Create, update, and manage patient records
- **Encryption Operations**: Manage encryption keys and operations
- **Audit Logging**: View and manage audit logs
- **System Administration**: Complete system management capabilities

### 📊 Interactive Demo
Experience the power of encrypted medical records management:
- **Live Demo**: Try the system at [securehealth.dev](https://securehealth.dev)
- **X-Ray View**: Examine raw encrypted data in MongoDB
- **Audit Trails**: Complete access logging and monitoring
- **Role-Based Access**: Experience different user perspectives

## Target Audience

This documentation serves multiple audiences:

- **Healthcare IT Professionals**: System administrators, security officers, compliance managers
- **Developers**: Backend developers, full-stack developers, DevOps engineers
- **Healthcare Providers**: Doctors, nurses, receptionists who will use the system
- **Students & Educators**: Computer science students, healthcare informatics programs
- **Compliance Officers**: HIPAA compliance specialists, auditors

## Getting Started

Ready to explore SecureHealth? Here are your next steps:

1. **[Try the Interactive Demo](/docs/getting-started/introduction)** - Experience the system firsthand
2. **[Quick Start Guide](/docs/getting-started/quick-start)** - Get up and running in 5 minutes
3. **[Security Concepts](/docs/concepts/queryable-encryption)** - Learn about MongoDB Queryable Encryption
4. **[User Guides](/docs/user-guides/doctor-guide)** - Role-specific documentation

## Documentation Goals

Our documentation aims to:

1. **Educational**: Teach MongoDB Queryable Encryption concepts through hands-on examples
2. **Interactive**: Provide interactive demos and live examples
3. **Compliance**: Demonstrate HIPAA compliance patterns with "Security by Design"
4. **Technical**: Offer detailed technical documentation with working code examples
5. **User-Friendly**: Make complex encryption concepts accessible to healthcare professionals
6. **Demonstration**: Showcase the power of encrypted medical records management

## Technology Stack

- **Backend Framework**: Symfony 7.0
- **Language**: PHP 8.2+
- **Database**: MongoDB 8.2 Enterprise (with Queryable Encryption)
- **ODM**: Doctrine MongoDB ODM Bundle 5.0+
- **Authentication**: JWT with Symfony Security
- **Encryption**: MongoDB Client-Side Field Level Encryption
- **Development**: Docker + Docker Compose
- **Testing**: PHPUnit + MongoDB Test Framework
- **Security**: Symfony Security Voters + RBAC
- **Audit**: Comprehensive HIPAA-compliant logging
- **AI Integration**: OpenAI GPT-4 API

## Support and Community

- **Live Demo**: [securehealth.dev](https://securehealth.dev)
- **GitHub Repository**: [mrlynn/securehealth-docs](https://github.com/mrlynn/securehealth-docs)
- **Documentation Issues**: Report issues via GitHub
- **Community Discussions**: Join the conversation

---

**Ready to get started?** Check out our [Getting Started Guide](/docs/getting-started/introduction) or [try the live demo](https://securehealth.dev) to experience SecureHealth in action.
