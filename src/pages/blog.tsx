import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './blog.module.css';

const blogsByCategory = {
  'AI & Engineering': [
    {title: 'Open Source Is Dying, and AI Is Holding the Knife', link: '/articles/open-source-is-dying', date: 'Apr 2026'},
  ],
};

export default function Blog(): ReactNode {
  return (
    <Layout
      title="Blog"
      description="Articles about AI, engineering, and building products">
      <main className={styles.container}>
        <div className={styles.header}>
          <div>
            <Heading as="h1" className={styles.title}>Writing</Heading>
            <p className={styles.subtitle}>
              Thoughts on AI, engineering, and building things.
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
