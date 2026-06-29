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
          <div className={styles.introRow}>
            <p>
              Ten years across data science, data engineering, and ML
              engineering, now in AI. Usually end up on the platform side:
              reliability, traces, and evaluations. I focus on productionizing
              models. You may have come across me in prior open source work. I
              co-authored{" "}
              <a href="https://github.com/fugue-project/fugue">Fugue</a> and did
              dev rel work at{" "}
              <a href="https://github.com/PrefectHQ/prefect">Prefect</a>. Now I'm
              building <a href="https://knitknot.ai">KnitKnot</a>.
            </p>
            <img
              src="/img/nanami.png"
              alt="Nanami Kento"
              className={`${styles.introIcon} ${styles.sticker}`}
            />
          </div>

          <aside className={styles.nowSection}>
            <Heading as="h2" className={styles.nowTitle}>
              Current Work
            </Heading>
            <ul className={styles.nowList}>
              <li>
                <a href="https://knitknot.ai">KnitKnot</a> — AI Presence
                Management. Companies are starting to win or lose deals on how
                ChatGPT and the others describe them. We measure that and help
                fix it.
              </li>
              <li>
<a href="https://www.finosu.com">Finosu</a> — contracting on their
                AI-powered loan servicing platform: borrower engagement and
                payments in one system.
              </li>
            </ul>
            <span className={styles.nowUpdated}>Updated Jun 2026</span>
          </aside>

          <Heading as="h2" className={styles.sectionTitle}>
            Current Vibe
          </Heading>
          <img
            src="/img/what-will-you-become.png"
            alt="But what will you become tomorrow?"
            className={styles.heroImage}
          />

          <Heading as="h2" className={styles.sectionTitle}>
            Recent Work
          </Heading>
          <ul className={styles.interestsList}>
            <li>
              <strong>
                First AI Engineer at <a href="https://drata.com">Drata</a>
              </strong>{" "}
              — joined through the Harmonize acquisition. Automation for
              compliance: Q&amp;A, summarization, RAG, platform work.
            </li>
            <li>
              Open-source community at{" "}
              <a href="https://github.com/PrefectHQ/prefect">Prefect</a>, helping
              people build reliable data pipelines.
            </li>
            <li>
              Co-author of{" "}
              <a href="https://github.com/fugue-project/fugue/">Fugue</a>, a
              unified interface for distributed computing across Spark, Dask, and
              Ray.
            </li>
          </ul>

          <Heading as="h2" className={styles.sectionTitle}>
            Speaking &amp; Teaching
          </Heading>
          <p>
            I've spoken at PyCon, PyData, and SciPy and built
            distributed-computing courses for O'Reilly.{" "}
            <Link to="/talks/intro">Talks →</Link>
          </p>

          <Heading as="h2" className={styles.sectionTitle}>
            Things Outside Work
          </Heading>
          <p>Anime, K-pop, basketball, keyboards.</p>

          <div className={styles.friendSection}>
            <img
              src="/img/quagsire.png"
              alt="Quagsire saying hi"
              className={`${styles.friendIcon} ${styles.sticker}`}
            />
            <div className={styles.friendText}>
              <Heading as="h2" className={styles.sectionTitle}>
                New friend?
              </Heading>
              <p className={styles.contactRow}>
                <a
                  href="mailto:kdykho@gmail.com"
                  className={styles.contactIcon}
                  aria-label="Email"
                  title="Email"
                >
                  <span className={`${styles.iconMask} ${styles.iconEmail}`} />
                </a>
                <a
                  href="https://github.com/kvnkho"
                  className={styles.contactIcon}
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <span className={`${styles.iconMask} ${styles.iconGithub}`} />
                </a>
                <a
                  href="https://linkedin.com/in/kvnkho"
                  className={styles.contactIcon}
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <span className={`${styles.iconMask} ${styles.iconLinkedin}`} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
