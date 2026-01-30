import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Projects',
      collapsed: false,
      items: [
        'intro',
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
      items: [
        'talks/intro',
        'talks/podcasts',
        'talks/conferences',
        'talks/tutorials',
      ],
    },
    'experience',
  ],
};

export default sidebars;
