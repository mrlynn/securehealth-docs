# SecureHealth CLI (`securehealth`)

The SecureHealth Command-Line Interface provides a unified entry point for setup, user/patient management, encryption utilities, database ops, validation, and system status.

## Quick Start


Preview:

![SecureHealth CLI demo](/img/securehealth-cli.gif)


```bash
# Interactive menu
php bin/console securehealth --interactive

# Run a specific command
php bin/console securehealth -c setup
php bin/console securehealth -c status
```

## Options

- `-c, --command <name>`: Run a specific subcommand
- `-i, --interactive`: Launch interactive menu-driven mode

## Available Commands

```text
setup              Complete system setup and initialization
users              User management (create, list, manage roles)
patients           Patient data management (generate, import, export)
medical-knowledge  Medical knowledge base management
encryption         Encryption utilities and debugging
database           Database operations (reset, backup, restore)
validation         System validation and health checks
status             System status and information
maintenance        Maintenance (clear cache, optional restart)
help               Show detailed help for any command
```

## Usage Examples

```bash
# Full setup (DB schema, users, sample data, validation)
php bin/console securehealth -c setup

# Users
php bin/console securehealth -c users               # menu
php bin/console securehealth -c users --create-admin

# Patients
php bin/console securehealth -c patients            # menu
php bin/console securehealth -c patients --generate 50

# Medical Knowledge
php bin/console securehealth -c medical-knowledge   # menu

# Encryption
php bin/console securehealth -c encryption          # menu
php bin/console securehealth -c encryption --debug

# Database
php bin/console securehealth -c database            # menu

# Validation and Status
php bin/console securehealth -c validation
php bin/console securehealth -c status
```

## Interactive Mode

Launch with `--interactive` to navigate a guided menu. You can perform multiple actions in sequence without re-running the command.

## Subcommand Details

### setup
- Creates MongoDB schema
- Creates default users
- Generates sample patient data
- Seeds medical knowledge base
- Runs validation checks

### users
Actions:
- `create-users`: Create default users
- `list-users`: List all users (ID, email, username, roles)
- `create-admin`: Interactive admin creation (email, username, password)

### patients
Actions:
- `generate`: Generate sample patients (prompts for count)
- `count`: Show patient count and encrypted fields summary
- `export`: Export minimal metadata (json/csv/xml)
- `import`: Placeholder for imports

### medical-knowledge
Actions:
- `seed`: Seed entries (prompts for count)
- `count`: Show knowledge base stats
- `search`: Search by query and display top results

### encryption
Actions:
- `initialize`: Initialize encryption
- `debug`: Show encryption diagnostics
- `test`: Run encrypt/decrypt self-test
- `status`: Display encryption configuration status

### database
Actions:
- `reset`: Drop schema (with confirmation)
- `backup`: Placeholder
- `restore`: Placeholder
- `stats`: Placeholder

### validation
Runs health checks for:
- Database connection
- User auth
- API endpoints
- Encryption service
- Medical knowledge base
- File permissions

### status
Displays version, environment and counts:
- Application, PHP, Symfony versions
- Environment
- Database/encryption status
- User, patient and knowledge base counts

### maintenance
Actions:
- `clear-cache`: Clear Symfony cache (with fallback script)
- `clear-and-restart`: Clear cache then attempt service restart
- `restart`: Attempt service restart (Docker or PHP-FPM reload)

## Notes
- Requires application environment variables to be set (see Reference > Environment Variables).
- Some actions intentionally run interactively and may prompt for input.
- Encryption export of full patient data is restricted; only metadata is exported by default.
