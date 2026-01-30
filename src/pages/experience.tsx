import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './experience.module.css';

interface Role {
  title: string;
  company: string;
  companyUrl?: string;
  date: string;
  description?: string;
  bullets?: string[];
}

const experience: Role[] = [
  {
    title: 'Senior AI Engineer 2',
    company: 'Drata',
    companyUrl: 'https://drata.com',
    date: 'March 2024 - February 2026',
    description: 'Joined through Harmonize acquisition. Responsible for all AI functionality inside Drata.',
    bullets: [
      'Built **AI agents** that generate and maintain **1,000+ compliance tests** at scale',
      'Indexed all data into **Weaviate vector database** using Flink',
      'Deployed AI pipelines built on **Bedrock** and **Anthropic**',
      'Wrote API endpoints with **TypeScript**',
    ],
  },
  {
    title: 'Data and ML Engineering Consultant',
    company: 'Konvex.io',
    date: 'August 2022 - March 2024',
    description: 'Consultant across data science, data engineering, and machine learning functions.',
    bullets: [
      '**Harmonize** (Founding Engineer, Head of Data): Built first version of **RAG-powered** question-answering app for security questionnaires using Docker, FastAPI, Anthropic, LangChain, SQLAlchemy, and Pinecone',
      '**Nixtla** (Staff ML Engineer): Scaled **statsforecast** library to distributed computing on **Spark, Dask, and Ray**',
      '**Citi** (VP Risk Analytics): Accelerated large scale economic forecasts with **Dask and Ray**. Built internal tooling for data scientists',
    ],
  },
  {
    title: 'Senior Open Source Community Engineer',
    company: 'Prefect',
    companyUrl: 'https://github.com/PrefectHQ/prefect',
    date: 'March 2021 - July 2022',
    bullets: [
      'Helped developers build reliable data pipelines with **Prefect**',
      'Created tutorials, documentation, and community resources',
      'Spoke at **PyCon** and **SciPy** about workflow orchestration',
    ],
  },
  {
    title: 'Data Scientist',
    company: 'Paylocity',
    date: 'October 2019 - March 2021',
  },
  {
    title: 'Associate Data Scientist',
    company: 'Itron',
    date: 'January 2017 - October 2019',
  },
  {
    title: 'Hydrology Researcher',
    company: 'US Geological Survey',
    date: 'March 2016 - June 2017',
  },
];

const openSource: Role[] = [
  {
    title: 'Co-author',
    company: 'Fugue',
    companyUrl: 'https://github.com/fugue-project/fugue',
    date: 'October 2020 - Present',
    description: 'A unified interface for distributed computing that allows users to write code in native Python or Pandas and port it to Spark, Dask, or Ray.',
    bullets: [
      '**2,100+ GitHub stars** · **16M+ downloads** · **420 Slack members**',
    ],
  },
];

const education = [
  {
    degree: 'B.S./M.S. in Civil Engineering',
    school: 'University of Illinois at Urbana-Champaign',
    date: '2010 - 2016',
  },
];

const volunteer = [
  {
    role: 'Co-organizer',
    org: 'PyData Seattle 2023',
    date: 'April 2023',
  },
  {
    role: 'Co-chair, Data Life Cycle Track',
    org: 'SciPy 2022',
    date: 'July 2022',
  },
  {
    role: 'Volunteer Project Manager/Data Scientist',
    org: 'DataKind',
    date: 'November 2017 - November 2021',
    description: 'Worked on a project with Embrace Families aimed at reducing social worker burnout.',
  },
];

function formatBullet(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function Experience(): ReactNode {
  return (
    <Layout
      title="Experience"
      description="Kevin Kho - AI/ML Engineer Experience">
      <main className={styles.container}>
        <header className={styles.header}>
          <Heading as="h1" className={styles.title}>Experience</Heading>
          <p className={styles.subtitle}>10 years in data, ML, and AI</p>
        </header>

        <section className={styles.section}>
          {experience.map((role, i) => (
            <div key={i} className={styles.role}>
              <div className={styles.roleDate}>{role.date}</div>
              <div className={styles.roleTitleLine}>
                <span className={styles.roleTitle}>{role.title}</span>
                <span className={styles.roleAt}>@</span>
                <span className={styles.roleCompany}>
                  {role.companyUrl ? (
                    <a href={role.companyUrl}>{role.company}</a>
                  ) : (
                    role.company
                  )}
                </span>
              </div>
              {role.description && (
                <p className={styles.roleDescription}>{role.description}</p>
              )}
              {role.bullets && (
                <ul className={styles.roleBullets}>
                  {role.bullets.map((bullet, j) => (
                    <li key={j} dangerouslySetInnerHTML={{__html: formatBullet(bullet)}} />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <Heading as="h2" className={styles.sectionTitle}>Open Source</Heading>
          {openSource.map((project, i) => (
            <div key={i} className={styles.role}>
              <div className={styles.roleDate}>{project.date}</div>
              <div className={styles.roleTitleLine}>
                <span className={styles.roleTitle}>{project.title}</span>
                <span className={styles.roleAt}>@</span>
                <span className={styles.roleCompany}>
                  {project.companyUrl ? (
                    <a href={project.companyUrl}>{project.company}</a>
                  ) : (
                    project.company
                  )}
                </span>
              </div>
              {project.description && (
                <p className={styles.roleDescription}>{project.description}</p>
              )}
              {project.bullets && (
                <div className={styles.projectStats} dangerouslySetInnerHTML={{__html: formatBullet(project.bullets[0])}} />
              )}
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <Heading as="h2" className={styles.sectionTitle}>Education</Heading>
          {education.map((edu, i) => (
            <div key={i} className={styles.education}>
              <div className={styles.eduHeader}>
                <div>
                  <span className={styles.eduTitle}>{edu.degree}</span>
                  <div className={styles.eduSchool}>{edu.school}</div>
                </div>
                <span className={styles.eduDate}>{edu.date}</span>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <Heading as="h2" className={styles.sectionTitle}>Volunteer & Community</Heading>
          {volunteer.map((vol, i) => (
            <div key={i} className={styles.volunteer}>
              <div className={styles.volHeader}>
                <div>
                  <span className={styles.volTitle}>{vol.role}</span>
                  <div className={styles.volOrg}>{vol.org}</div>
                </div>
                <span className={styles.volDate}>{vol.date}</span>
              </div>
              {vol.description && (
                <p className={styles.volDescription}>{vol.description}</p>
              )}
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}
