// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// Change here to customise config

// Name of the Github Repo, it's also teh baseUrl
const workshopName = 'securehealth-docs';
// Change this if hosting outside mongodb-developer
const organizationName = "mrlynn";

// Main page config
const title = "SecureHealth Documentation";
const tagLine = "Secure, HIPAA-compliant healthcare information management with MongoDB Queryable Encryption";
const startButtonTitle = "Start Demo";
const favicon = "img/favicon.svg"

// Main Page Features
const featureList = [
  {
    title: 'Security by Design',
    illustration: 'img/coding.png',
    description: `
        Built with HIPAA compliance and MongoDB Queryable Encryption from the ground up.
    `,
  },
  {
    title: 'Interactive Demo',
    illustration: 'img/highfive.png',
    description: `
        Experience encrypted medical records management with our live demo.
    `,
  },
  {
    title: 'Role-Based Access',
    illustration: 'img/writing.png',
    description: `
        Granular permissions for doctors, nurses, and receptionists.
    `,
  },
  {
    title: 'Patient Portal',
    illustration: 'img/rocket.png',
    description: `
        Secure patient access to medical records and communication tools.
    `,
  },
];

// UTM stuff
const utmAdvocateName = `mrlynn`;
const utmWorkshopName = 'securehealth_docs'

const utmParams = `utm_campaign=devrel&utm_source=workshop&utm_medium=cta&utm_content=${utmWorkshopName}&utm_term=${utmAdvocateName}`;

// Footer links (probably no need to change them)

const footerLinks = [
  {
    label: "Documentation",
    href: "https://docs.securehealth.dev/",
  },
  {
    label: "Features",
    href: "https://docs.securehealth.dev/docs/concepts/hipaa-compliance",
  },
  {
    label: "Security",
    href: "https://docs.securehealth.dev/docs/concepts/security-architecture",
  },
  {
    label: "Encryption Demo",
    href: "https://securehealth.dev",
  },
  {
    href: `https://github.com/${organizationName}/securehealth`,
    label: "GitHub Repository",
  },
];

///////////////////////////////////////////////////////////////////////////////
// DON'T CHANGE ANYTHING BELOW UNLESS YOU KNOW WHAT YOU'RE DOING             //
///////////////////////////////////////////////////////////////////////////////

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: `${title}`,
  tagline: `${tagLine}`,
  url: 'https://docs.securehealth.dev',
  baseUrl: '/',
  projectName: `${organizationName}.github.io`,
  organizationName: `${organizationName}`,
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: `${favicon}`,
  deploymentBranch: "gh-pages",
  staticDirectories: ["static"],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  customFields: {
    startButtonTitle: `${startButtonTitle}`,
    featureList: featureList,
    utmParams,
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // editUrl: `https://github.com/${organizationName}/${workshopName}/blob/main`,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-ZJ28V71VTQ",
          anonymizeIP: true,
        },
      }),
    ],
  ],
  plugins: [
    [
      require.resolve("docusaurus-lunr-search"),
      {
        languages: ["es", "en"], // language codes
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      announcementBar: {
        id: "live_demo",
        content:
          '🚀 <strong>Live Demo Available!</strong> Experience SecureHealth in action at <a target="_blank" rel="noopener noreferrer" href="https://securehealth.dev">securehealth.dev</a>',
        backgroundColor: "#2ecc71",
        textColor: "#ffffff",
        isCloseable: true,
      },
      navbar: {
        title: `${title}`,
        logo: {
          alt: "SecureHealth Logo",
          src: "img/logo.png",
          srcDark: "img/logo.png",
          className: "navbar-logo",
          width: "100px",
          height: "100%",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://securehealth.dev",
            label: "Live Demo",
            position: "right",
          },
          {
            href: `https://github.com/${organizationName}/securehealth`,
            label: "GitHub",
            position: "right",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: footerLinks,
        copyright: `© ${new Date().getFullYear()} SecureHealth. Built with Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["powershell", "swift", "kotlin"],
      },
      mermaid: {
        theme: { light: "neutral", dark: "forest" },
      },
    }),
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: true,
    },
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      ssgWorkerThreads: true,
      mdxCrossCompilerCache: true,
    },
    experimental_storage: {
      type: "localStorage",
      namespace: true,
    },
    // this should be commented out as we're generating a static site and serving it through GitHub Pages
    // See: https://docusaurus.io/blog/releases/3.4#hash-router---experimental
    // > This mode is not recommended for sites deployed through a web server.
    // experimental_router: "hash",
  },
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};

module.exports = config;
