import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  projectsSidebar: [
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
};

export default sidebars;
