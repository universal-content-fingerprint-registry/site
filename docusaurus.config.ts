import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Universal Content Fingerprinting Registry",
  tagline:
    "A comprehensive, privacy‑first way for creators to establish verifiable authorship with cryptographic fingerprints and an on‑chain registry, while transparently declaring AI involvement.",
  favicon: "img/UCFR_dark_bg_logo_only.png",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://ucfr.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "universal-content-fingerprint-registry", // Usually your GitHub org/user name.
  projectName: "site", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/UCFR_light_bg_stack.png",
    navbar: {
      title: "",
      logo: {
        alt: "UCFR Logo",
        src: "img/UCFR_light_bg_inline.png",
        srcDark: "img/UCFR_dark_bg_inline.png",
      },
      items: [
        {
          to: "/docs/intro",
          label: "Documentation",
          position: "left",
        },
        {
          to: "/docs/interactive-demo",
          label: "Interactive Demo",
          position: "left",
        },
        {
          href: "https://github.com/universal-content-fingerprint-registry/core",
          label: "Smart Contract",
          position: "left",
        },
        {
          href: "https://github.com/universal-content-fingerprint-registry/",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
            {
              label: "Interactive Demo",
              to: "/docs/interactive-demo",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Smart Contract",
              href: "https://github.com/universal-content-fingerprint-registry/core",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/universal-content-fingerprint-registry/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Universal Content Fingerprinting Registry. Built by <a href="https://stabilityprotocol.com" target="_blank" rel="noopener noreferrer">Stability</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
