import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './blog.module.css';

const blogsByCategory = {
  Career: [
    {title: 'Job Advice in Data and AI', link: '/articles/job-advice-data-ai', date: 'Jan 2026'},
  ],
  AI: [
    {title: 'Migrating to an AI-Friendly Blog Stack', link: '/articles/new-blog-stack', date: 'Jan 2026'},
  ],
  Drata: [
    {title: 'Using AI to Generate 1,000 Compliance Tests', link: '/articles/using-ai-to-generate-1000-compliance-tests', date: 'Dec 2025'},
  ],
  Fugue: [
    {title: 'Large Scale Image Processing with Spark', link: '/articles/large-scale-image-processing-spark-fugue', date: 'Jan 2023'},
    {title: 'Data Quality with whylogs and Fugue', link: '/articles/data-profiling-whylogs-fugue', date: 'Oct 2022'},
    {title: 'Why SQL-Like Interfaces are Sub-optimal for Distributed Computing', link: '/articles/sql-interfaces-suboptimal-distributed-computing', date: 'Aug 2022'},
    {title: 'Why Pandas-like Interfaces are Sub-optimal for Distributed Computing', link: '/articles/pandas-interfaces-suboptimal-distributed-computing', date: 'Jun 2022'},
    {title: 'Introducing Fugue', link: '/articles/introducing-fugue-reducing-pyspark-friction', date: 'Feb 2022'},
    {title: 'Scaling PyCaret with Spark (or Dask)', link: '/articles/scaling-pycaret-spark-dask-fugue', date: 'Jan 2022'},
    {title: 'Delivering Spark Projects Faster and Cheaper', link: '/articles/spark-projects-faster-cheaper-fugue', date: 'Nov 2021'},
    {title: 'Using FugueSQL on Spark DataFrames', link: '/articles/fuguesql-spark-databricks', date: 'Nov 2021'},
    {title: 'Porting Pandas Code to Spark', link: '/articles/porting-python-pandas-to-spark', date: 'Aug 2021'},
    {title: 'Data Validation with Pandera and Fugue', link: '/articles/pandera-spark-data-validation-fugue', date: 'May 2021'},
  ],
  Prefect: [
    {title: 'Docker Without the Hassle', link: '/articles/productionizing-data-workflows-docker', date: 'Sep 2021'},
    {title: 'Interoperable Python and SQL', link: '/articles/interoperable-python-sql-jupyter', date: 'Apr 2021'},
  ],
};

export default function Blog(): ReactNode {
  return (
    <Layout
      title="Blog"
      description="Articles about AI, distributed computing, and data engineering">
      <main className={styles.container}>
        <div className={styles.header}>
          <div>
            <Heading as="h1" className={styles.title}>Writing</Heading>
            <p className={styles.subtitle}>
              Articles about AI, distributed computing, and data engineering.
            </p>
          </div>
          <Link to="/articles" className={styles.viewByDate}>
            View by date &rarr;
          </Link>
        </div>

        <div className={styles.categories}>
          {Object.entries(blogsByCategory).map(([category, posts]) => (
            <section key={category} className={styles.category}>
              <Heading as="h2" className={styles.categoryTitle}>{category}</Heading>
              <ul className={styles.postList}>
                {posts.map((post) => (
                  <li key={post.link}>
                    <Link to={post.link}>{post.title}</Link>
                    <span className={styles.date}>{post.date}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
