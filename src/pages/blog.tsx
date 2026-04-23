import type {ReactNode} from 'react';
import {useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './blog.module.css';

type Post = {
  title: string;
  link: string;
  date: string;
  tags: string[];
};

const posts: Post[] = [
  {
    title: 'Open Source Isn\u2019t Dead, but It Sure Is Unrecognizable',
    link: '/articles/open-source-isnt-dead-but-it-sure-is-unrecognizable',
    date: '2026-04-22',
    tags: ['ai', 'open-source', 'engineering'],
  },
];

const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

export default function Blog(): ReactNode {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

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
        </div>

        {allTags.length > 1 && (
          <div className={styles.tags}>
            <button
              className={`${styles.tag} ${!activeTag ? styles.tagActive : ''}`}
              onClick={() => setActiveTag(null)}>
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tag} ${activeTag === tag ? styles.tagActive : ''}`}
                onClick={() => setActiveTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}

        <ul className={styles.postList}>
          {filtered.map((post) => (
            <li key={post.link}>
              <Link to={post.link}>{post.title}</Link>
              <div className={styles.meta}>
                <span className={styles.date}>
                  {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.postTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className={styles.empty}>No posts with this tag yet.</p>
        )}
      </main>
    </Layout>
  );
}
