import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/helloWorld',
    component: ComponentCreator('/helloWorld', '3a9'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '999'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'd00'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '913'),
            routes: [
              {
                path: '/docs/community/contributing',
                component: ComponentCreator('/docs/community/contributing', '5c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/community/github-integration',
                component: ComponentCreator('/docs/community/github-integration', 'bda'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/community/roadmap',
                component: ComponentCreator('/docs/community/roadmap', 'f1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/community/support',
                component: ComponentCreator('/docs/community/support', 'a0e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/audit-logging',
                component: ComponentCreator('/docs/concepts/audit-logging', 'd74'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/hipaa-compliance',
                component: ComponentCreator('/docs/concepts/hipaa-compliance', '6c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/queryable-encryption',
                component: ComponentCreator('/docs/concepts/queryable-encryption', 'b37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/role-based-access',
                component: ComponentCreator('/docs/concepts/role-based-access', '4ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/concepts/security-architecture',
                component: ComponentCreator('/docs/concepts/security-architecture', 'c87'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer-guides/api-reference',
                component: ComponentCreator('/docs/developer-guides/api-reference', '13e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer-guides/architecture',
                component: ComponentCreator('/docs/developer-guides/architecture', 'e4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer-guides/database-schema',
                component: ComponentCreator('/docs/developer-guides/database-schema', '6dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer-guides/deployment',
                component: ComponentCreator('/docs/developer-guides/deployment', 'ca2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer-guides/security-implementation',
                component: ComponentCreator('/docs/developer-guides/security-implementation', '4fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/developer-guides/testing',
                component: ComponentCreator('/docs/developer-guides/testing', 'cb2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/first-steps',
                component: ComponentCreator('/docs/getting-started/first-steps', '730'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', '267'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/introduction',
                component: ComponentCreator('/docs/getting-started/introduction', '314'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '09c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/reference/api-endpoints',
                component: ComponentCreator('/docs/reference/api-endpoints', '915'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/reference/configuration',
                component: ComponentCreator('/docs/reference/configuration', 'bea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/reference/environment-variables',
                component: ComponentCreator('/docs/reference/environment-variables', '57e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/reference/glossary',
                component: ComponentCreator('/docs/reference/glossary', '65f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/reference/troubleshooting',
                component: ComponentCreator('/docs/reference/troubleshooting', '729'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/adding-roles',
                component: ComponentCreator('/docs/tutorials/adding-roles', 'ee8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/audit-customization',
                component: ComponentCreator('/docs/tutorials/audit-customization', '94c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/custom-fields',
                component: ComponentCreator('/docs/tutorials/custom-fields', '1fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/encryption-setup',
                component: ComponentCreator('/docs/tutorials/encryption-setup', 'f5d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/integration-examples',
                component: ComponentCreator('/docs/tutorials/integration-examples', 'a7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/user-guides/admin-guide',
                component: ComponentCreator('/docs/user-guides/admin-guide', '316'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/user-guides/doctor-guide',
                component: ComponentCreator('/docs/user-guides/doctor-guide', 'd31'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/user-guides/nurse-guide',
                component: ComponentCreator('/docs/user-guides/nurse-guide', 'ce9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/user-guides/patient-portal',
                component: ComponentCreator('/docs/user-guides/patient-portal', 'afc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/user-guides/receptionist-guide',
                component: ComponentCreator('/docs/user-guides/receptionist-guide', '58a'),
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
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
