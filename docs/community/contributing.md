# Contributing to SecureHealth

Guidelines for contributing to the SecureHealth project, including code standards, pull request process, and community guidelines.

## Getting Started

### Prerequisites

- PHP 8.1 or higher
- Composer
- MongoDB Atlas account
- Git
- Node.js (for frontend development)

### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/securehealth.git
   cd securehealth
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create MongoDB Atlas cluster
   # Configure encryption keys
   # Run database migrations
   ```

## Code Standards

### PHP Coding Standards

We follow PSR-12 coding standards:

```php
<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Patient;
use App\Repository\PatientRepository;

class PatientService
{
    public function __construct(
        private PatientRepository $patientRepository,
        private EncryptionService $encryptionService
    ) {
    }

    public function createPatient(array $data): Patient
    {
        $patient = new Patient();
        $patient->setFirstName($data['firstName']);
        $patient->setLastName($data['lastName']);
        
        return $this->patientRepository->save($patient);
    }
}
```

### JavaScript/TypeScript Standards

We use ESLint and Prettier for code formatting:

```javascript
// Use const/let instead of var
const patientData = await fetchPatient(id);
let processedData = processPatientData(patientData);

// Use arrow functions for callbacks
const patients = data.map(patient => ({
  id: patient.id,
  name: `${patient.firstName} ${patient.lastName}`
}));

// Use async/await instead of promises
async function fetchPatient(id) {
  try {
    const response = await fetch(`/api/patients/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
}
```

### Security Standards

1. **Input Validation**
   ```php
   // Always validate input
   $validator = $this->validator->validate($data, [
       'firstName' => [new NotBlank(), new Length(['min' => 2, 'max' => 50])],
       'email' => [new NotBlank(), new Email()],
   ]);
   ```

2. **SQL Injection Prevention**
   ```php
   // Use parameterized queries
   $patients = $this->patientRepository->findBy([
       'firstName' => $firstName,
       'lastName' => $lastName
   ]);
   ```

3. **XSS Prevention**
   ```php
   // Escape output
   echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
   ```

## Pull Request Process

### Before Submitting

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write Tests**
   ```php
   // tests/Service/PatientServiceTest.php
   public function testCreatePatient(): void
   {
       $data = [
           'firstName' => 'John',
           'lastName' => 'Doe',
           'email' => 'john@example.com'
       ];
       
       $patient = $this->patientService->createPatient($data);
       
       $this->assertInstanceOf(Patient::class, $patient);
       $this->assertEquals('John', $patient->getFirstName());
   }
   ```

3. **Run Tests**
   ```bash
   phpunit
   npm test
   ```

4. **Check Code Quality**
   ```bash
   composer cs-check
   composer cs-fix
   ```

### Pull Request Guidelines

1. **Title Format**
   ```
   feat: add patient search functionality
   fix: resolve encryption key validation issue
   docs: update API documentation
   test: add unit tests for PatientService
   ```

2. **Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows project standards
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

3. **Review Process**
   - All PRs require at least one review
   - Address feedback promptly
   - Keep PRs focused and small
   - Update documentation as needed

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- PHP Version: [e.g., 8.1.0]
- MongoDB Version: [e.g., 6.0]
- Application Version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context about the feature request
```

## Development Workflow

### Git Workflow

1. **Main Branch**
   - `main`: Production-ready code
   - `develop`: Integration branch for features

2. **Feature Branches**
   - `feature/feature-name`: New features
   - `bugfix/bug-description`: Bug fixes
   - `hotfix/critical-fix`: Critical fixes

3. **Commit Messages**
   ```
   feat: add patient search functionality
   fix: resolve encryption key validation issue
   docs: update API documentation
   test: add unit tests for PatientService
   refactor: improve code organization
   ```

### Testing Strategy

1. **Unit Tests**
   ```php
   // Test individual methods
   public function testEncryptPatientData(): void
   {
       $data = ['firstName' => 'John', 'lastName' => 'Doe'];
       $encrypted = $this->encryptionService->encrypt($data);
       $this->assertNotEquals($data, $encrypted);
   }
   ```

2. **Integration Tests**
   ```php
   // Test component interactions
   public function testPatientCreationFlow(): void
   {
       $patientData = $this->createValidPatientData();
       $patient = $this->patientService->createPatient($patientData);
       $this->assertInstanceOf(Patient::class, $patient);
   }
   ```

3. **End-to-End Tests**
   ```javascript
   // Test complete user workflows
   test('Patient can view their medical records', async () => {
     await page.goto('/patient-portal');
     await page.click('[data-testid="view-records"]');
     await expect(page.locator('[data-testid="medical-history"]')).toBeVisible();
   });
   ```

## Code Review Guidelines

### For Reviewers

1. **Check Code Quality**
   - Follows coding standards
   - Proper error handling
   - Security considerations
   - Performance implications

2. **Verify Tests**
   - Adequate test coverage
   - Tests are meaningful
   - Edge cases covered

3. **Documentation**
   - Code is well-documented
   - API documentation updated
   - README updated if needed

### For Authors

1. **Prepare for Review**
   - Self-review your code
   - Run all tests
   - Check code quality tools
   - Update documentation

2. **Respond to Feedback**
   - Address all comments
   - Ask questions if unclear
   - Be open to suggestions
   - Keep discussions constructive

## Community Guidelines

### Code of Conduct

1. **Be Respectful**
   - Use welcoming and inclusive language
   - Respect different viewpoints
   - Accept constructive criticism

2. **Be Collaborative**
   - Help others learn and grow
   - Share knowledge and experience
   - Work together towards common goals

3. **Be Professional**
   - Focus on the code, not the person
   - Provide constructive feedback
   - Maintain a positive attitude

### Communication

1. **GitHub Issues**
   - Use for bug reports and feature requests
   - Provide clear descriptions
   - Use appropriate labels

2. **Discussions**
   - Use for general questions
   - Share ideas and proposals
   - Get help and support

3. **Pull Requests**
   - Use for code contributions
   - Follow the PR process
   - Respond to feedback promptly

## Getting Help

### Resources

1. **Documentation**
   - API Reference
   - Configuration Guide
   - Troubleshooting Guide

2. **Community**
   - GitHub Discussions
   - Stack Overflow
   - Discord Server

3. **Support**
   - GitHub Issues
   - Email: support@securehealth.dev

### Mentorship

We welcome contributors of all skill levels:

1. **New Contributors**
   - Start with documentation issues
   - Look for "good first issue" labels
   - Ask questions in discussions

2. **Experienced Contributors**
   - Help mentor new contributors
   - Review pull requests
   - Share knowledge and experience

## Recognition

### Contributors

We recognize contributors in several ways:

1. **GitHub Contributors**
   - Listed in repository contributors
   - Mentioned in release notes

2. **Hall of Fame**
   - Featured on project website
   - Special recognition for significant contributions

3. **Community Awards**
   - Monthly contributor spotlight
   - Annual community awards

## Next Steps

- **[GitHub Integration](/docs/community/github-integration)** - GitHub workflow and automation
- **[Support](/docs/community/support)** - Getting help and support
- **[Roadmap](/docs/community/roadmap)** - Project roadmap and future plans
