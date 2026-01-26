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
          routeBasePath: 'projects',
        },
        blog: {
          showReadingTime: true,
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
        {to: '/about', label: 'About', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'projectsSidebar',
          position: 'left',
          label: 'Projects',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/talks', label: 'Talks', position: 'left'},
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
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {label: 'About', to: '/about'},
            {label: 'Projects', to: '/projects/intro'},
            {label: 'Blog', to: '/blog'},
            {label: 'Talks', to: '/talks'},
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/kvnkho',
            },
            {
              label: 'LinkedIn',
              href: 'https://linkedin.com/in/kvnkho',
            },
            {
              label: 'Email',
              href: 'mailto:kdykho@gmail.com',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Kevin Kho. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
