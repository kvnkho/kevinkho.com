import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import type {Props} from '@theme/BlogPostItem';
import styles from './styles.module.css';

function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

function BlogPostThumbnail(): ReactNode {
  const {assets, frontMatter, isBlogPostPage, metadata} = useBlogPost();

  // Only show thumbnail on listing page, not on individual post page
  if (isBlogPostPage) {
    return null;
  }

  // Prefer assets.image (bundler-processed) over frontMatter.image
  const image = assets.image ?? frontMatter.image;

  if (!image) {
    return null;
  }

  return (
    <div className={styles.thumbnailContainer}>
      <img
        src={image}
        alt={metadata.title}
        className={styles.thumbnail}
      />
    </div>
  );
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const containerClassName = useContainerClassName();
  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <BlogPostThumbnail />
      <BlogPostItemHeader />
      <BlogPostItemContent>{children}</BlogPostItemContent>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
