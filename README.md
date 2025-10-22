# SecureHealth Documentation

This repository contains the documentation for SecureHealth, a HIPAA-compliant medical records management system built with MongoDB Queryable Encryption.

## 🚀 Live Site

The documentation is deployed at: **https://docs.securehealth.dev**

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrlynn/securehealth-docs.git
   cd securehealth-docs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `build/` directory.

## 📚 Documentation Structure

- **Getting Started**: Introduction, installation, and first steps
- **Concepts**: HIPAA compliance, encryption, security architecture
- **User Guides**: Role-based guides for different user types
- **Developer Guides**: API reference, architecture, deployment
- **Tutorials**: Step-by-step implementation guides
- **Reference**: Configuration, troubleshooting, glossary
- **Community**: Contributing, support, roadmap

## 🎨 Design System

The documentation follows the SecureHealth design system:

- **Primary Color**: `#2ecc71` (vibrant green)
- **Background**: `#e8f8f5` (light mint green)
- **Header/Footer**: `#34495e` (dark slate gray/blue)
- **Typography**: Inter font family
- **Cards**: Rounded corners with subtle shadows

## 🚀 Deployment

### GitHub Pages

The site is automatically deployed to GitHub Pages using GitHub Actions:

1. **Push to main branch** triggers automatic deployment
2. **Custom domain**: `docs.securehealth.dev`
3. **Deployment branch**: `gh-pages` (managed by GitHub Actions)

### Manual Deployment

If you need to deploy manually:

```bash
npm run build
# Upload the build/ directory to your web server
```

## 🔧 Configuration

### Environment Variables

No environment variables are required for the documentation site.

### Custom Domain

The site is configured to use `docs.securehealth.dev` as the custom domain. The CNAME file is located at `static/CNAME`.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

### Documentation Guidelines

- Use clear, concise language
- Include code examples where appropriate
- Follow the existing structure and formatting
- Test all links and examples
- Update the table of contents if adding new sections

## 🐛 Issues

Report issues and bugs at: https://github.com/mrlynn/securehealth-docs/issues

## 📄 License

This documentation is part of the SecureHealth project. See the main repository for license information.

## 🔗 Links

- **Live Demo**: https://securehealth.dev
- **Main Repository**: https://github.com/mrlynn/securehealth
- **Documentation**: https://docs.securehealth.dev