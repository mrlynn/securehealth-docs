/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    'faq',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/first-steps',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/hipaa-compliance',
        'concepts/queryable-encryption',
        'concepts/role-based-access',
        'concepts/audit-logging',
        'concepts/security-architecture',
        'concepts/ai-documentation-assistant',
        'concepts/command-line-tool',
      ],
    },
    {
      type: 'category',
      label: 'User Guides',
      items: [
        'user-guides/admin-guide',
        'user-guides/doctor-guide',
        'user-guides/nurse-guide',
        'user-guides/receptionist-guide',
        'user-guides/patient-portal',
      ],
    },
    {
      type: 'category',
      label: 'Developer Guides',
      items: [
        'developer-guides/architecture',
        'developer-guides/api-reference',
        'developer-guides/database-schema',
        'developer-guides/security-implementation',
        'developer-guides/testing',
        'developer-guides/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/encryption-setup',
        'tutorials/adding-roles',
        'tutorials/custom-fields',
        'tutorials/audit-customization',
        'tutorials/integration-examples',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/api-endpoints',
        'reference/configuration',
        'reference/environment-variables',
        'reference/troubleshooting',
        'reference/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      items: [
        'community/contributing',
        'community/github-integration',
        'community/support',
        'community/roadmap',
      ],
    },
  ],
};

module.exports = sidebars;
