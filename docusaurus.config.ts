import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Kevin Kho',
  tagline: 'AI/ML Engineer. Most recently at Drata.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://kevinkho.com',
  baseUrl: '/',

  organizationName: 'kvnkho',
  projectName: 'kevinkho.com',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'articles',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-2X9F3PF7NK',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kevin Kho',
      items: [
        {
          type: 'dropdown',
          label: 'Blog',
          position: 'left',
          items: [
            {label: 'AI', to: '/blog/tags/ai'},
            {label: 'Drata', to: '/blog/tags/drata'},
            {label: 'Fugue', to: '/blog/tags/fugue'},
            {label: 'Prefect', to: '/blog/tags/prefect'},
          ],
          // Ordered by most recent post: AI (Jan 2026), Drata (Dec 2025), Fugue (Jan 2023), Prefect (Sept 2021)
        },
        {to: '/intro', label: 'Projects', position: 'left'},
        {to: '/talks/intro', label: 'Talks', position: 'left'},
        {to: '/experience', label: 'Experience', position: 'left'},
        {to: '/blog', label: 'Recent', position: 'left'},
        {
          href: 'https://kevinkho.com/articles/rss.xml',
          label: 'RSS',
          position: 'right',
        },
        {
          href: 'https://github.com/kvnkho',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://linkedin.com/in/kvnkho',
          label: 'LinkedIn',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: 'Made with <a href="https://docusaurus.io/" target="_blank">Docusaurus</a>',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
