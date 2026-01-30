import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Projects',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'intro',
      },
      items: [
        {
          type: 'category',
          label: 'Open Source',
          items: ['fugue', 'prefect'],
        },
        {
          type: 'category',
          label: 'Professional',
          items: ['drata'],
        },
        {
          type: 'category',
          label: 'Education',
          items: ['courses'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Talks',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'talks/intro',
      },
      items: [
        'talks/podcasts',
        'talks/conferences',
        'talks/tutorials',
      ],
    },
    'experience',
  ],
};

export default sidebars;
