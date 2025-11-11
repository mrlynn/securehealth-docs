# Queryable Encryption Tutorials

This section contains comprehensive tutorials for implementing MongoDB Queryable Encryption across multiple programming languages and platforms.

## Overview

Queryable Encryption enables you to encrypt sensitive data in your MongoDB collections while maintaining the ability to query that data. These tutorials demonstrate how to implement Queryable Encryption using various programming languages and KMS providers.

## Available Tutorials

### Language-Specific Implementations

- **[C# / .NET Tutorial](./csharp/README.md)** - Complete C# implementation using the MongoDB .NET driver
- **[Go Tutorial](./go/README.md)** - Go implementation using the MongoDB Go driver  
- **[Java Tutorial](./java/README.md)** - Java implementation using the MongoDB Java driver
- **[Node.js Tutorial](./node/README.md)** - JavaScript/Node.js implementation using the MongoDB Node.js driver
- **[PHP Tutorial](./php/README.md)** - PHP implementation using the MongoDB PHP library
- **[Python Tutorial](./python/README.md)** - Python implementation using PyMongo
- **[Rust Tutorial](./rust/README.md)** - Rust implementation using the MongoDB Rust driver

### Shell and Command Line

- **[MongoDB Shell (mongosh) Tutorial](./mongosh/README.md)** - Implementation using the MongoDB shell

## Common Features

All tutorials demonstrate:

- Setting up KMS providers (AWS, Azure, GCP, KMIP, or Local)
- Creating encrypted collections with queryable fields
- Inserting and querying encrypted documents
- Range queries for encrypted numeric fields
- Best practices for key management

## Prerequisites

Before starting any tutorial, ensure you have:

- MongoDB Server version 7.0 or later
- Automatic Encryption Shared Library version 7.0 or later
- Appropriate language-specific driver or library
- Access to a KMS provider (or use local key for testing)

For detailed installation requirements, see the [Queryable Encryption Installation Requirements](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/).

## Quick Start

1. Choose your preferred programming language from the tutorials above
2. Follow the language-specific README for setup instructions
3. Configure your environment variables using the provided templates
4. Run the tutorial examples to see Queryable Encryption in action

## Sample Data Structure

All tutorials use a medical records example with the following structure:

```json
{
  "patientName": "Jon Doe",
  "patientId": 12345678,
  "patientRecord": {
    "ssn": "987-65-4320",
    "billing": {
      "type": "Visa", 
      "number": "4111111111111111"
    },
    "billAmount": 1500
  }
}
```

The tutorials demonstrate encrypting the SSN field for equality queries and the billing information as an encrypted object, while keeping other fields unencrypted for standard queries.

## Security Considerations

- Always use a production-grade KMS provider for production environments
- Never commit encryption keys or credentials to version control
- Regularly rotate your encryption keys according to your security policy
- Monitor access to encrypted collections and key vault operations

## Getting Help

If you encounter issues with any tutorial:

1. Check the language-specific README for troubleshooting tips
2. Verify your MongoDB and driver versions meet the requirements
3. Ensure your KMS provider credentials are correctly configured
4. Review the [MongoDB Queryable Encryption documentation](https://www.mongodb.com/docs/manual/core/queryable-encryption/)
