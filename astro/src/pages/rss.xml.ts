import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../lib/posts';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const posts = await getPosts({ pinnedFirst: false });
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: postUrl(post), categories: post.data.tags })),
    customData: '<language>zh-cn</language>',
  });
}
