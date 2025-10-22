import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/es/helloWorld',
    component: ComponentCreator('/es/helloWorld', 'b11'),
    exact: true
  },
  {
    path: '/es/docs',
    component: ComponentCreator('/es/docs', 'e90'),
    routes: [
      {
        path: '/es/docs',
        component: ComponentCreator('/es/docs', '202'),
        routes: [
          {
            path: '/es/docs',
            component: ComponentCreator('/es/docs', '7fc'),
            routes: [
              {
                path: '/es/docs/community/contributing',
                component: ComponentCreator('/es/docs/community/contributing', 'cb5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/community/github-integration',
                component: ComponentCreator('/es/docs/community/github-integration', '646'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/community/roadmap',
                component: ComponentCreator('/es/docs/community/roadmap', 'ac0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/community/support',
                component: ComponentCreator('/es/docs/community/support', '773'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/concepts/audit-logging',
                component: ComponentCreator('/es/docs/concepts/audit-logging', '6b0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/concepts/hipaa-compliance',
                component: ComponentCreator('/es/docs/concepts/hipaa-compliance', '67c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/concepts/queryable-encryption',
                component: ComponentCreator('/es/docs/concepts/queryable-encryption', '1cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/concepts/role-based-access',
                component: ComponentCreator('/es/docs/concepts/role-based-access', '05a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/concepts/security-architecture',
                component: ComponentCreator('/es/docs/concepts/security-architecture', 'c15'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/developer-guides/api-reference',
                component: ComponentCreator('/es/docs/developer-guides/api-reference', '2c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/developer-guides/architecture',
                component: ComponentCreator('/es/docs/developer-guides/architecture', 'ec0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/developer-guides/database-schema',
                component: ComponentCreator('/es/docs/developer-guides/database-schema', '935'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/developer-guides/deployment',
                component: ComponentCreator('/es/docs/developer-guides/deployment', '00e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/developer-guides/security-implementation',
                component: ComponentCreator('/es/docs/developer-guides/security-implementation', '6bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/developer-guides/testing',
                component: ComponentCreator('/es/docs/developer-guides/testing', 'b3b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/getting-started/first-steps',
                component: ComponentCreator('/es/docs/getting-started/first-steps', 'f3d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/getting-started/installation',
                component: ComponentCreator('/es/docs/getting-started/installation', '316'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/getting-started/introduction',
                component: ComponentCreator('/es/docs/getting-started/introduction', '024'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/getting-started/quick-start',
                component: ComponentCreator('/es/docs/getting-started/quick-start', 'a6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/intro',
                component: ComponentCreator('/es/docs/intro', '55c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/reference/api-endpoints',
                component: ComponentCreator('/es/docs/reference/api-endpoints', '836'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/reference/configuration',
                component: ComponentCreator('/es/docs/reference/configuration', '065'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/reference/environment-variables',
                component: ComponentCreator('/es/docs/reference/environment-variables', '4c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/reference/glossary',
                component: ComponentCreator('/es/docs/reference/glossary', 'ee7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/reference/troubleshooting',
                component: ComponentCreator('/es/docs/reference/troubleshooting', 'a7c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/tutorials/adding-roles',
                component: ComponentCreator('/es/docs/tutorials/adding-roles', '801'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/tutorials/audit-customization',
                component: ComponentCreator('/es/docs/tutorials/audit-customization', 'd2d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/tutorials/custom-fields',
                component: ComponentCreator('/es/docs/tutorials/custom-fields', 'b68'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/tutorials/encryption-setup',
                component: ComponentCreator('/es/docs/tutorials/encryption-setup', '8f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/tutorials/integration-examples',
                component: ComponentCreator('/es/docs/tutorials/integration-examples', 'ba7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/user-guides/admin-guide',
                component: ComponentCreator('/es/docs/user-guides/admin-guide', '2a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/user-guides/doctor-guide',
                component: ComponentCreator('/es/docs/user-guides/doctor-guide', '3f7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/user-guides/nurse-guide',
                component: ComponentCreator('/es/docs/user-guides/nurse-guide', '3e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/user-guides/patient-portal',
                component: ComponentCreator('/es/docs/user-guides/patient-portal', '040'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/es/docs/user-guides/receptionist-guide',
                component: ComponentCreator('/es/docs/user-guides/receptionist-guide', '093'),
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
    path: '/es/',
    component: ComponentCreator('/es/', '124'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
