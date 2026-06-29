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
      description="Kevin Kho - Founder of KnitKnot.ai. Building AI Presence Management."
    >
      <main className={styles.container}>
        <Heading as="h1" className={styles.name}>
          {siteConfig.title}
        </Heading>
        <p className={styles.location}>📍 Glendale, CA</p>

        <div className={styles.bio}>
          <p>
            I build things on the platform side of AI and data. Right now
            that's <a href="https://knitknot.ai">KnitKnot</a> — we help
            companies see how AI models talk about them to buyers, and fix
            what's wrong. Before that, co-authored{" "}
            <a href="https://github.com/fugue-project/fugue">Fugue</a> (30M+
            downloads). Worked at{" "}
            <a href="https://drata.com">Drata</a> on AI automation. Open source
            community at{" "}
            <a href="https://github.com/PrefectHQ/prefect">Prefect</a>. I like
            the layer that makes the hard stuff invisible.
          </p>

          <img
            src="/img/what-will-you-become.png"
            alt="But what will you become tomorrow?"
            className={styles.heroImage}
          />

          <aside className={styles.nowSection}>
            <Heading as="h2" className={styles.nowTitle}>
              Currently Working On
            </Heading>
            <ul className={styles.nowList}>
              <li>
                Building <a href="https://knitknot.ai">KnitKnot.ai</a> — AI
                Presence Management
              </li>
              <li>
                Contracting for Finosu — payment infrastructure for my brother's company
              </li>
              <li>
                Learning filmmaking. Shooting a faceless vlog on a Canon PowerShot V1
              </li>
              <li>
                Building a quiet wardrobe. Gramicci, Human Made, Miansai. Trying to dress without trying too hard.
              </li>
              <li>
                Watching Spy x Family, JJK, Solo Leveling
              </li>
              <li>
                Thinking about basketball rosters and what they have to do with engineering team construction
              </li>
            </ul>
            <span className={styles.nowUpdated}>Updated Jun 2026</span>
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
            <li>Basketball, Japanese fashion, K-pop, anime</li>
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
