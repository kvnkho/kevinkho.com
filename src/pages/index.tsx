import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Kevin Kho - AI/ML Engineer. Building data infrastructure and AI systems.">
      <main className={styles.container}>
        <Heading as="h1" className={styles.name}>{siteConfig.title}</Heading>

        <div className={styles.bio}>
          <p>
            I build data infrastructure and AI systems. Based in Los Angeles.
          </p>

          <Heading as="h2" className={styles.sectionTitle}>Currently</Heading>
          <p>
            <strong>Senior AI Engineer at Drata</strong> (via the Harmonize acquisition), building AI-powered compliance automation. Recent work includes developing AI agents that generate and maintain compliance tests at scale.
          </p>

          <Heading as="h2" className={styles.sectionTitle}>Previously</Heading>
          <p>
            Open Source Community Engineer at <a href="https://github.com/PrefectHQ/prefect">Prefect</a>, helping developers build reliable data pipelines.
          </p>
          <p>
            Co-author of <a href="https://github.com/fugue-project/fugue/">Fugue</a>, a unified interface for distributed computing across Spark, Dask, and Ray.
          </p>

          <Heading as="h2" className={styles.sectionTitle}>Interests</Heading>
          <ul className={styles.interestsList}>
            <li>Distributed computing with Spark, Dask, and Ray</li>
            <li>Production AI/ML infrastructure</li>
            <li>Workflow orchestration</li>
            <li>Developer experience</li>
          </ul>

          <Heading as="h2" className={styles.sectionTitle}>Speaking & Teaching</Heading>
          <p>
            I speak at conferences including PyCon and SciPy, and create courses on distributed computing for platforms like O'Reilly. See my <Link to="/talks">talks</Link>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
