import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../site.config';

export type Post = CollectionEntry<'blog'>;

export async function getPosts() {
  return (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postUrl(post: Post) {
  return `/blog/${post.id.split('/').map(encodeURIComponent).join('/')}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai',
  }).format(date).replaceAll('/', '.');
}

export function readingTime(body = '') {
  const characters = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (body.replace(/[\u3400-\u9fff]/g, ' ').match(/[a-zA-Z0-9]+/g) || []).length;
  return Math.max(1, Math.ceil(characters / 350 + words / 220));
}

export function getTags(posts: Post[]) {
  return [...new Set(posts.flatMap((post) => post.data.tags))];
}

export function getCategoryCounts(posts: Post[]) {
  return Object.fromEntries(['全部', ...site.categories].map((category) => [
    category, category === '全部' ? posts.length : posts.filter((post) => post.data.category === category).length,
  ]));
}
