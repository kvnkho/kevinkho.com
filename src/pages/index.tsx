import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const projects = [
  {
    title: 'Fugue',
    description: 'Unified interface for distributed computing on Spark, Dask, and Ray.',
    link: '/projects/fugue',
    image: '/img/projects/fugue.png',
  },
  {
    title: 'Prefect',
    description: 'Workflow orchestration for data pipelines and ML workflows.',
    link: '/projects/prefect',
    image: '/img/projects/prefect.png',
  },
  {
    title: 'Drata',
    description: 'AI-powered compliance automation at scale.',
    link: '/projects/drata',
    image: '/img/projects/datatalks_club.png',
  },
];

const recentPosts = [
  {
    title: 'Migrating to an AI-Friendly Blog Stack',
    date: 'January 2026',
    link: '/blog/new-blog-stack',
  },
  {
    title: 'Using AI to Generate 1,000 Compliance Tests',
    date: 'December 2025',
    link: '/blog/using-ai-to-generate-1000-compliance-tests',
  },
  {
    title: 'Large Scale Image Processing with Spark',
    date: 'January 2023',
    link: '/blog/large-scale-image-processing-spark-fugue',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroDescription}>
          Building data infrastructure and AI systems. Co-author of{' '}
          <a href="https://github.com/fugue-project/fugue/">Fugue</a>, former{' '}
          <a href="https://github.com/PrefectHQ/prefect">Prefect</a> OSS Community
          Engineer. Based in Los Angeles.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/about">
            About Me
          </Link>
          <Link className="button button--secondary button--lg" to="/projects/intro">
            View Projects
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProjectCard({title, description, link, image}: {
  title: string;
  description: string;
  link: string;
  image: string;
}) {
  return (
    <div className={styles.projectCard}>
      <img src={image} alt={title} className={styles.projectImage} />
      <div className={styles.projectContent}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link to={link}>Learn more &rarr;</Link>
      </div>
    </div>
  );
}

function BlogPostCard({title, date, link}: {
  title: string;
  date: string;
  link: string;
}) {
  return (
    <div className={styles.blogCard}>
      <span className={styles.blogDate}>{date}</span>
      <Heading as="h3">
        <Link to={link}>{title}</Link>
      </Heading>
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Kevin Kho - AI/ML Engineer. Building data infrastructure and AI systems.">
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2">Recent Writing</Heading>
            <div className={styles.blogGrid}>
              {recentPosts.map((post) => (
                <BlogPostCard key={post.title} {...post} />
              ))}
            </div>
            <div className={styles.seeMore}>
              <Link to="/blog">Read all posts &rarr;</Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <Heading as="h2">Featured Projects</Heading>
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
            <div className={styles.seeMore}>
              <Link to="/projects/intro">See all projects &rarr;</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
