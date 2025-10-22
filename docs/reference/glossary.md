# Glossary

Technical terms and definitions used throughout the SecureHealth documentation.

## A

**Access Control List (ACL)**
A list of permissions associated with a system resource, defining which users or system processes can access specific resources.

**Administrative Safeguards**
HIPAA requirements for administrative actions, policies, and procedures to manage the selection, development, implementation, and maintenance of security measures.

**API (Application Programming Interface)**
A set of protocols and tools for building software applications, allowing different software components to communicate with each other.

**Audit Log**
A chronological record of activities that have affected a specific operation, procedure, or event, used for compliance and security monitoring.

**Authentication**
The process of verifying the identity of a user, process, or device before allowing access to resources.

**Authorization**
The process of granting or denying access to specific resources based on the authenticated user's permissions.

## B

**Business Associate Agreement (BAA)**
A contract between a covered entity and a business associate that ensures the business associate will safeguard PHI in accordance with HIPAA requirements.

## C

**Ciphertext**
Encrypted data that is unreadable without the proper decryption key.

**Client-Side Field Level Encryption (CSFLE)**
MongoDB's encryption feature that allows applications to encrypt sensitive data before it's sent to the database, providing end-to-end encryption.

**Covered Entity**
Under HIPAA, a health plan, healthcare clearinghouse, or healthcare provider that transmits health information electronically.

**CORS (Cross-Origin Resource Sharing)**
A security feature that allows web pages to make requests to a different domain than the one serving the web page.

## D

**Deterministic Encryption**
A type of encryption where the same plaintext always produces the same ciphertext, allowing for equality queries on encrypted data.

**Digital Signature**
A mathematical scheme for verifying the authenticity of digital messages or documents.

## E

**Encryption**
The process of converting plaintext into ciphertext to protect data confidentiality.

**Encryption Key**
A piece of information used to control the encryption and decryption of data.

**Entity**
In the context of SecureHealth, a data model representing a business object such as Patient, User, or Appointment.

## F

**Field-Level Encryption**
Encryption applied to specific fields within a database record, rather than encrypting entire records or databases.

## H

**HIPAA (Health Insurance Portability and Accountability Act)**
A US federal law that establishes national standards for protecting sensitive patient health information.

**HMAC (Hash-based Message Authentication Code)**
A mechanism for message authentication using cryptographic hash functions.

## I

**Index**
A database structure that improves the speed of data retrieval operations on a database table.

**Integrity**
The assurance that data has not been modified in an unauthorized manner.

## J

**JWT (JSON Web Token)**
A compact, URL-safe means of representing claims to be transferred between two parties, commonly used for authentication.

## K

**Key Management**
The process of generating, storing, distributing, and revoking encryption keys.

**Key Vault**
A secure storage location for encryption keys, typically managed by a key management system.

## L

**Logging**
The process of recording events, activities, and transactions for audit, debugging, and monitoring purposes.

## M

**MongoDB Atlas**
MongoDB's cloud database service that provides managed MongoDB instances.

**MongoDB Queryable Encryption**
MongoDB's feature that allows applications to perform queries on encrypted data without decrypting it first.

## P

**PHI (Protected Health Information)**
Individually identifiable health information that is created, received, maintained, or transmitted by a covered entity.

**Plaintext**
Unencrypted, readable data.

**Policy**
A set of rules or guidelines that define how an organization manages and protects its data and resources.

## Q

**Queryable Encryption**
A type of encryption that allows for certain operations (like equality or range queries) to be performed on encrypted data without decrypting it.

## R

**Range Encryption**
A type of encryption that allows for range queries (greater than, less than) on encrypted data.

**RBAC (Role-Based Access Control)**
A security model that restricts system access based on user roles and permissions.

**Repository Pattern**
A design pattern that abstracts data access logic, providing a more object-oriented view of the persistence layer.

## S

**Schema**
The structure of a database, including tables, fields, relationships, and constraints.

**Security by Design**
An approach to software development that considers security requirements throughout the entire development lifecycle.

**Standard Encryption**
A type of encryption that provides the highest level of security but doesn't allow for queries on encrypted data.

**Symfony**
A PHP web application framework used for building web applications and APIs.

## T

**Token**
A piece of data that represents a user's authentication or authorization status.

**Transaction**
A sequence of database operations that are treated as a single unit of work.

## U

**User Entity**
In SecureHealth, a data model representing a system user with specific roles and permissions.

## V

**Validation**
The process of checking data to ensure it meets specific criteria or constraints.

**Vulnerability**
A weakness in a system that could be exploited to compromise security.

## W

**Webhook**
A method of augmenting or altering the behavior of a web page or web application with custom callbacks.

## X

**XSS (Cross-Site Scripting)**
A security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.

## Y

**YAML (YAML Ain't Markup Language)**
A human-readable data serialization standard commonly used for configuration files.

## Z

**Zero Trust**
A security model that assumes no implicit trust and verifies every request as though it originates from an open network.

## Next Steps

- **[API Endpoints Reference](/docs/reference/api-endpoints)** - Complete API documentation
- **[Configuration Reference](/docs/reference/configuration)** - All configuration options
- **[Environment Variables](/docs/reference/environment-variables)** - Environment setup
- **[Troubleshooting](/docs/reference/troubleshooting)** - Common issues and solutions
