// FAQ Data Structure for the Interactive FAQ Component
// This data is extracted from the original FAQ markdown

export const faqData = [
  {
    role: "Developers",
    title: "For Developers",
    categories: [
      {
        title: "Technical Implementation",
        questions: [
          {
            question: "What version of MongoDB do I need for Queryable Encryption?",
            answer: "SecureHealth requires MongoDB 8.2 Enterprise Edition with Queryable Encryption support. This includes the latest performance improvements and enhanced key management capabilities."
          },
          {
            question: "Can I use MongoDB Community Edition?",
            answer: "No, Queryable Encryption is only available in MongoDB Enterprise Edition. However, you can use MongoDB Atlas (which includes Enterprise features) for development and production."
          },
          {
            question: "What PHP version is required?",
            answer: "SecureHealth requires PHP 8.2 or higher. We recommend PHP 8.3 for the best performance and latest features."
          },
          {
            question: "Is Symfony 7.0 required, or can I use an older version?",
            answer: "While we recommend Symfony 7.0 for the latest features and security updates, the core functionality should work with Symfony 6.4+. However, some advanced features may require Symfony 7.0."
          },
          {
            question: "How do I set up encryption keys for development?",
            answer: "Use the command-line tool: <code>php bin/console app:generate-encryption-key</code>. For production, ensure keys are stored securely and rotated regularly."
          },
          {
            question: "Can I integrate SecureHealth with existing healthcare systems?",
            answer: "Yes! SecureHealth provides comprehensive APIs and can integrate with HL7 FHIR, EHR systems, and other healthcare applications. See our <a href='/docs/tutorials/integration-examples'>Integration Examples</a> for details."
          }
        ]
      },
      {
        title: "Security & Compliance",
        questions: [
          {
            question: "How does the audit logging work?",
            answer: "Every action is logged with user ID, timestamp, IP address, and data accessed. Logs are encrypted and stored separately from patient data for compliance."
          },
          {
            question: "What encryption algorithms are used?",
            answer: "We use AES-256 encryption with three types:<br/>• <strong>Deterministic:</strong> For searchable fields (names, emails)<br/>• <strong>Range:</strong> For date/numeric queries<br/>• <strong>Standard:</strong> For highly sensitive data (SSN, diagnoses)"
          },
          {
            question: "How do I ensure HIPAA compliance in my implementation?",
            answer: "Follow our <a href='/docs/concepts/hipaa-compliance'>HIPAA Compliance Guide</a> and implement all required safeguards. The system includes built-in compliance features, but proper configuration is essential."
          },
          {
            question: "Can I customize the role-based access control?",
            answer: "Yes! The system uses Symfony Security Voters, making it easy to add custom roles and permissions. See our <a href='/docs/concepts/role-based-access'>RBAC Guide</a> for implementation details."
          }
        ]
      },
      {
        title: "Development & Testing",
        questions: [
          {
            question: "How do I run the test suite?",
            answer: "Use <code>docker-compose exec php bin/phpunit</code> to run all tests, including HIPAA compliance tests and MongoDB Queryable Encryption tests."
          },
          {
            question: "Can I develop without Docker?",
            answer: "While Docker is recommended for consistency, you can develop locally. Ensure you have MongoDB 8.2 Enterprise and all required PHP extensions installed."
          },
          {
            question: "How do I debug encryption issues?",
            answer: "Use the CLI tool: <code>php bin/console app:test-encryption</code> and check the application logs. The system provides detailed error messages for common encryption problems."
          },
          {
            question: "What's the performance impact of Queryable Encryption?",
            answer: "There's a 10-15% performance overhead for encrypted queries, but this is offset by the security benefits. We provide optimization tips in our <a href='/docs/developer-guides/deployment'>Performance Guide</a>."
          }
        ]
      }
    ]
  },
  {
    role: "Healthcare Providers",
    title: "For Healthcare Providers",
    categories: [
      {
        title: "System Usage",
        questions: [
          {
            question: "How do I log into the system?",
            answer: "Use your assigned email and password. The system supports role-based access, so you'll only see features appropriate to your role (Doctor, Nurse, Receptionist)."
          },
          {
            question: "Can I access patient data from my mobile device?",
            answer: "Yes! The system is mobile-responsive and works on tablets and smartphones. All data remains encrypted and secure on mobile devices."
          },
          {
            question: "How do I generate SOAP notes?",
            answer: "Use the AI Documentation Assistant feature. Enter patient information, chief complaint, and vital signs, and the system will generate a structured SOAP note using AI."
          },
          {
            question: "Can I customize the AI-generated notes?",
            answer: "Yes! AI-generated notes are editable. You can modify any section and the system will track changes for audit purposes."
          },
          {
            question: "How do I search for patients?",
            answer: "You can search by name, patient ID, or email. The system performs encrypted searches, so you can find patients even though their data is encrypted in the database."
          }
        ]
      },
      {
        title: "Data Security",
        questions: [
          {
            question: "What patient information can I see?",
            answer: "Your access depends on your role:<br/>• <strong>Doctors:</strong> Full access to all patient data including medical history, diagnoses, and SSN<br/>• <strong>Nurses:</strong> Medical data access but no SSN or insurance details<br/>• <strong>Receptionists:</strong> Basic information and insurance details but no medical data"
          },
          {
            question: "How do I know if data is secure?",
            answer: "All patient data is encrypted at the field level using MongoDB Queryable Encryption. You can verify this by checking the \"X-Ray View\" in the demo to see encrypted data."
          },
          {
            question: "What happens if I accidentally access the wrong patient?",
            answer: "The system logs all access attempts. If you access incorrect data, it will be recorded in the audit log. Contact your system administrator immediately."
          },
          {
            question: "Can I export patient data?",
            answer: "Yes, but exports are logged and may require additional permissions depending on your role and the data being exported."
          }
        ]
      },
      {
        title: "Workflow Integration",
        questions: [
          {
            question: "How does this integrate with our existing EHR?",
            answer: "SecureHealth can integrate with most EHR systems through APIs. Contact your IT administrator for specific integration details."
          },
          {
            question: "Can I schedule appointments through this system?",
            answer: "Yes! The system includes comprehensive appointment scheduling with role-based access controls."
          },
          {
            question: "How do I handle prescription management?",
            answer: "The system tracks prescriptions and medications. Doctors can create prescriptions, nurses can view them, and the system maintains an audit trail."
          },
          {
            question: "What about lab results?",
            answer: "Lab results are encrypted and stored securely. You can view, add, and track lab results with appropriate permissions."
          }
        ]
      }
    ]
  },
  {
    role: "IT Administrators",
    title: "For IT Administrators",
    categories: [
      {
        title: "System Administration",
        questions: [
          {
            question: "How do I install and configure SecureHealth?",
            answer: "Follow our <a href='/docs/getting-started/installation'>Installation Guide</a>. The system includes Docker setup for easy deployment and configuration."
          },
          {
            question: "What are the system requirements?",
            answer: "Minimum requirements:<br/>• PHP 8.2+<br/>• MongoDB 8.2 Enterprise<br/>• 4GB RAM<br/>• 20GB storage<br/>• HTTPS certificate for production"
          },
          {
            question: "How do I manage users and roles?",
            answer: "Use the command-line tool: <code>php bin/console app:create-user</code> and <code>php bin/console app:update-user</code>. You can also manage users through the web interface if you have admin access."
          },
          {
            question: "How do I backup the system?",
            answer: "Use <code>php bin/console app:backup-database</code> to create encrypted backups. Store backups securely and test restoration procedures regularly."
          },
          {
            question: "How do I monitor system performance?",
            answer: "Use <code>php bin/console app:monitor-performance</code> and check the application logs. The system provides comprehensive monitoring capabilities."
          }
        ]
      },
      {
        title: "Security Management",
        questions: [
          {
            question: "How do I rotate encryption keys?",
            answer: "Use <code>php bin/console app:rotate-encryption-keys</code>. This process re-encrypts all data with new keys while maintaining system availability."
          },
          {
            question: "How do I view audit logs?",
            answer: "Use <code>php bin/console app:view-audit-logs</code> or access the web interface. Logs can be exported for compliance reporting."
          },
          {
            question: "What security measures should I implement?",
            answer: "Ensure HTTPS, regular security updates, proper firewall configuration, and regular security audits. See our <a href='/docs/developer-guides/security-implementation'>Security Implementation Guide</a>."
          },
          {
            question: "How do I handle security incidents?",
            answer: "The system provides comprehensive audit trails. Follow your organization's incident response procedures and use the audit logs to investigate."
          }
        ]
      },
      {
        title: "Compliance & Auditing",
        questions: [
          {
            question: "How do I ensure HIPAA compliance?",
            answer: "Implement all technical, administrative, and physical safeguards. The system provides built-in compliance features, but proper configuration and policies are essential."
          },
          {
            question: "How long should I retain audit logs?",
            answer: "HIPAA requires 6 years of audit log retention. The system can be configured to automatically archive old logs."
          },
          {
            question: "How do I prepare for compliance audits?",
            answer: "Use the audit log export features and ensure all required documentation is available. The system provides comprehensive reporting capabilities."
          },
          {
            question: "What about data breach notification?",
            answer: "The system logs all access attempts and can help identify potential breaches. Follow your organization's breach notification procedures."
          }
        ]
      }
    ]
  },
  {
    role: "Decision Makers",
    title: "For Decision Makers",
    categories: [
      {
        title: "Business Value",
        questions: [
          {
            question: "What are the business benefits of SecureHealth?",
            answer: "Key benefits include:<br/>• HIPAA compliance out of the box<br/>• Reduced risk of data breaches<br/>• Improved patient trust<br/>• Streamlined workflows<br/>• AI-powered documentation<br/>• Comprehensive audit trails"
          },
          {
            question: "How does this compare to other healthcare systems?",
            answer: "SecureHealth is unique in its use of MongoDB Queryable Encryption, providing field-level encryption while maintaining search capabilities. Most systems either encrypt everything (making searches difficult) or leave data unencrypted."
          },
          {
            question: "What's the ROI of implementing SecureHealth?",
            answer: "ROI comes from reduced compliance costs, improved efficiency through AI documentation, and reduced risk of costly data breaches. Most organizations see ROI within 12-18 months."
          },
          {
            question: "Can this replace our existing EHR?",
            answer: "SecureHealth can complement or replace existing systems depending on your needs. It's designed to integrate with existing healthcare infrastructure."
          }
        ]
      },
      {
        title: "Implementation & Costs",
        questions: [
          {
            question: "How long does implementation take?",
            answer: "Typical implementation takes 3-6 months depending on:<br/>• System complexity<br/>• Integration requirements<br/>• Staff training needs<br/>• Compliance requirements"
          },
          {
            question: "What are the ongoing costs?",
            answer: "Costs include:<br/>• MongoDB Atlas (if using cloud)<br/>• Server infrastructure<br/>• Maintenance and updates<br/>• Staff training<br/>• Compliance monitoring"
          },
          {
            question: "Do we need specialized staff?",
            answer: "Basic PHP/Symfony knowledge is helpful but not required. The system includes comprehensive documentation and support."
          },
          {
            question: "What about vendor lock-in?",
            answer: "SecureHealth is open source, so you're not locked into a proprietary system. You can modify, extend, or migrate as needed."
          }
        ]
      },
      {
        title: "Risk Management",
        questions: [
          {
            question: "What are the security risks?",
            answer: "Risks are significantly reduced compared to traditional systems:<br/>• Data is encrypted at rest and in transit<br/>• Comprehensive audit logging<br/>• Role-based access controls<br/>• Regular security updates"
          },
          {
            question: "How do we handle data migration?",
            answer: "The system includes migration tools and can work with existing healthcare data formats. We provide migration support and documentation."
          },
          {
            question: "What about disaster recovery?",
            answer: "The system includes automated backup capabilities and can be deployed across multiple data centers for high availability."
          },
          {
            question: "How do we ensure staff adoption?",
            answer: "The system is designed for ease of use with role-based interfaces. We provide comprehensive training materials and support."
          }
        ]
      }
    ]
  },
  {
    role: "General",
    title: "General Questions",
    categories: [
      {
        title: "Getting Started",
        questions: [
          {
            question: "How do I get started with SecureHealth?",
            answer: "Start with our <a href='/docs/getting-started/quick-start'>Quick Start Guide</a> or try the <a href='https://securehealth.dev' target='_blank' rel='noopener noreferrer'>live demo</a> to see the system in action."
          },
          {
            question: "Is there a free trial?",
            answer: "Yes! You can try the live demo or deploy your own instance using our open source code."
          },
          {
            question: "Do you provide training?",
            answer: "We provide comprehensive documentation, video tutorials, and can arrange custom training sessions for organizations."
          },
          {
            question: "What support is available?",
            answer: "Support includes:<br/>• Comprehensive documentation<br/>• GitHub issues and discussions<br/>• Community forums<br/>• Professional support options"
          }
        ]
      },
      {
        title: "Technical Support",
        questions: [
          {
            question: "How do I report bugs or issues?",
            answer: "Report issues through GitHub Issues or contact support@securehealth.dev for urgent matters."
          },
          {
            question: "How often is the system updated?",
            answer: "We release regular updates with new features, security patches, and improvements. Major updates are released quarterly."
          },
          {
            question: "Can I contribute to the project?",
            answer: "Yes! SecureHealth is open source. See our <a href='/docs/community/contributing'>Contributing Guide</a> for details on how to contribute."
          },
          {
            question: "Is the system actively maintained?",
            answer: "Yes, SecureHealth is actively developed and maintained with regular updates and security patches."
          }
        ]
      }
    ]
  }
];
