import type { APIRoute } from 'astro';
import { getPosts, postUrl } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  return new Response(JSON.stringify(posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    url: postUrl(post),
    text: (post.body || '').replace(/```[\s\S]*?```/g, ' ').replace(/[#*`>\[\]]/g, ' '),
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
