import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Kevin Kho - Founder of KnitKnot.ai. Building AI-native revenue enablement."
    >
      <main className={styles.container}>
        <Heading as="h1" className={styles.name}>
          {siteConfig.title}
        </Heading>
        <p className={styles.location}>📍 Glendale, CA</p>

        <div className={styles.bio}>
          <p>
            Founder of <a href="https://knitknot.ai">KnitKnot.ai</a>, an
            AI-native revenue enablement platform that auto-generates branded
            buyer rooms with AI chat, content guardrails, and buyer session
            tracking. I've worked across data, ML, and AI for the past 10 years,
            usually on the platform side.
          </p>

          <aside className={styles.nowSection}>
            <Heading as="h2" className={styles.nowTitle}>
              Currently Working On
            </Heading>
            <ul className={styles.nowList}>
              <li>
                Building <a href="https://knitknot.ai">KnitKnot.ai</a> —
                AI-native revenue enablement with auto-generated buyer rooms
              </li>
            </ul>
            <span className={styles.nowUpdated}>Updated Mar 2026</span>
          </aside>

          <Heading as="h2" className={styles.sectionTitle}>
            Previously
          </Heading>
          <p>
            <strong>
              AI Engineer at <a href="https://drata.com">Drata</a>
            </strong>{" "}
            — AI automation for compliance use cases: question answering,
            summarization, RAG, and platform work.
          </p>
          <p>
            Open Source Community Engineer at{" "}
            <a href="https://github.com/PrefectHQ/prefect">Prefect</a>, helping
            developers build reliable data pipelines.
          </p>
          <p>
            Co-author of{" "}
            <a href="https://github.com/fugue-project/fugue/">Fugue</a>, a
            unified interface for distributed computing across Spark, Dask, and
            Ray.
          </p>

          <Heading as="h2" className={styles.sectionTitle}>
            Interests
          </Heading>
          <ul className={styles.interestsList}>
            <li>Distributed computing with Spark, Dask, and Ray</li>
            <li>Production AI/ML infrastructure</li>
            <li>Workflow orchestration</li>
            <li>Developer experience</li>
          </ul>

          <Heading as="h2" className={styles.sectionTitle}>
            Speaking & Teaching
          </Heading>
          <p>
            I speak at conferences including PyCon and SciPy, and create courses
            on distributed computing for platforms like O'Reilly. See my{" "}
            <Link to="/talks/intro">talks</Link>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
