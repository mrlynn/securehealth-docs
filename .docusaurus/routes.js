import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/securehealth-docs/__docusaurus/debug',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug', '9d2'),
    exact: true
  },
  {
    path: '/securehealth-docs/__docusaurus/debug/config',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug/config', '9bd'),
    exact: true
  },
  {
    path: '/securehealth-docs/__docusaurus/debug/content',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug/content', 'ea7'),
    exact: true
  },
  {
    path: '/securehealth-docs/__docusaurus/debug/globalData',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug/globalData', '2fb'),
    exact: true
  },
  {
    path: '/securehealth-docs/__docusaurus/debug/metadata',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug/metadata', 'd5e'),
    exact: true
  },
  {
    path: '/securehealth-docs/__docusaurus/debug/registry',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug/registry', '102'),
    exact: true
  },
  {
    path: '/securehealth-docs/__docusaurus/debug/routes',
    component: ComponentCreator('/securehealth-docs/__docusaurus/debug/routes', 'e59'),
    exact: true
  },
  {
    path: '/securehealth-docs/helloWorld',
    component: ComponentCreator('/securehealth-docs/helloWorld', '75e'),
    exact: true
  },
  {
    path: '/securehealth-docs/docs',
    component: ComponentCreator('/securehealth-docs/docs', '50d'),
    routes: [
      {
        path: '/securehealth-docs/docs',
        component: ComponentCreator('/securehealth-docs/docs', '35e'),
        routes: [
          {
            path: '/securehealth-docs/docs',
            component: ComponentCreator('/securehealth-docs/docs', '327'),
            routes: [
              {
                path: '/securehealth-docs/docs/community/contributing',
                component: ComponentCreator('/securehealth-docs/docs/community/contributing', '7a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/community/github-integration',
                component: ComponentCreator('/securehealth-docs/docs/community/github-integration', 'f24'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/community/roadmap',
                component: ComponentCreator('/securehealth-docs/docs/community/roadmap', '81d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/community/support',
                component: ComponentCreator('/securehealth-docs/docs/community/support', 'b52'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/concepts/audit-logging',
                component: ComponentCreator('/securehealth-docs/docs/concepts/audit-logging', 'b22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/concepts/hipaa-compliance',
                component: ComponentCreator('/securehealth-docs/docs/concepts/hipaa-compliance', '243'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/concepts/queryable-encryption',
                component: ComponentCreator('/securehealth-docs/docs/concepts/queryable-encryption', '5ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/concepts/role-based-access',
                component: ComponentCreator('/securehealth-docs/docs/concepts/role-based-access', '1a8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/concepts/security-architecture',
                component: ComponentCreator('/securehealth-docs/docs/concepts/security-architecture', 'dce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/developer-guides/api-reference',
                component: ComponentCreator('/securehealth-docs/docs/developer-guides/api-reference', '772'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/developer-guides/architecture',
                component: ComponentCreator('/securehealth-docs/docs/developer-guides/architecture', 'a94'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/developer-guides/database-schema',
                component: ComponentCreator('/securehealth-docs/docs/developer-guides/database-schema', '203'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/developer-guides/deployment',
                component: ComponentCreator('/securehealth-docs/docs/developer-guides/deployment', '4dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/developer-guides/security-implementation',
                component: ComponentCreator('/securehealth-docs/docs/developer-guides/security-implementation', '601'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/developer-guides/testing',
                component: ComponentCreator('/securehealth-docs/docs/developer-guides/testing', 'fdd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/getting-started/first-steps',
                component: ComponentCreator('/securehealth-docs/docs/getting-started/first-steps', '864'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/getting-started/installation',
                component: ComponentCreator('/securehealth-docs/docs/getting-started/installation', '1b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/getting-started/introduction',
                component: ComponentCreator('/securehealth-docs/docs/getting-started/introduction', '613'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/getting-started/quick-start',
                component: ComponentCreator('/securehealth-docs/docs/getting-started/quick-start', '781'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/intro',
                component: ComponentCreator('/securehealth-docs/docs/intro', '556'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/reference/api-endpoints',
                component: ComponentCreator('/securehealth-docs/docs/reference/api-endpoints', '95b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/reference/configuration',
                component: ComponentCreator('/securehealth-docs/docs/reference/configuration', '033'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/reference/environment-variables',
                component: ComponentCreator('/securehealth-docs/docs/reference/environment-variables', 'c98'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/reference/glossary',
                component: ComponentCreator('/securehealth-docs/docs/reference/glossary', '357'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/reference/troubleshooting',
                component: ComponentCreator('/securehealth-docs/docs/reference/troubleshooting', '339'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/tutorials/adding-roles',
                component: ComponentCreator('/securehealth-docs/docs/tutorials/adding-roles', 'f09'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/tutorials/audit-customization',
                component: ComponentCreator('/securehealth-docs/docs/tutorials/audit-customization', '640'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/tutorials/custom-fields',
                component: ComponentCreator('/securehealth-docs/docs/tutorials/custom-fields', '115'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/tutorials/encryption-setup',
                component: ComponentCreator('/securehealth-docs/docs/tutorials/encryption-setup', 'b70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/tutorials/integration-examples',
                component: ComponentCreator('/securehealth-docs/docs/tutorials/integration-examples', '71f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/user-guides/admin-guide',
                component: ComponentCreator('/securehealth-docs/docs/user-guides/admin-guide', '9aa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/user-guides/doctor-guide',
                component: ComponentCreator('/securehealth-docs/docs/user-guides/doctor-guide', 'f2f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/user-guides/nurse-guide',
                component: ComponentCreator('/securehealth-docs/docs/user-guides/nurse-guide', 'd56'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/user-guides/patient-portal',
                component: ComponentCreator('/securehealth-docs/docs/user-guides/patient-portal', '420'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/securehealth-docs/docs/user-guides/receptionist-guide',
                component: ComponentCreator('/securehealth-docs/docs/user-guides/receptionist-guide', '709'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/securehealth-docs/',
    component: ComponentCreator('/securehealth-docs/', 'b79'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
