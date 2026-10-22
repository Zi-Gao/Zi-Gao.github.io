import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const archive = path.resolve(root, process.argv[2] || '../luogu-archive');
const destination = path.join(root, 'src/content/blog/luogu');
const entries = JSON.parse(await readFile(path.join(archive, 'metadata.json'), 'utf8'));
const index = await readFile(path.join(archive, 'README.md'), 'utf8');
const indexedTags = new Map([...index.matchAll(/\| `(solution|note|journal)` \|[^\n]*?\[洛谷\]\(https:\/\/www\.luogu\.com\.cn\/article\/([a-z0-9]+)\)/g)].map((match) => [match[2], match[1]]));
const categories = { solution: '题解', note: '笔记', journal: '游记' };
const covers = {
  solution: ['/images/digital-home.svg', '/images/small-tools.svg'],
  note: ['/images/type-rhythm.svg', '/images/less-design.svg'],
  journal: ['/images/slow-weekend.svg', '/images/writing.svg'],
};

function inferTag(entry) {
  const tags = entry.tags || [];
  if (tags.includes('journal') || /游记|日记|回忆|退役前要做/.test(entry.title)) return 'journal';
  if (tags.some((tag) => ['solution', 'solutions', 'sulutions', '题解'].includes(tag)) || entry.category === '题解' || /题解|解法合集/.test(entry.title)) return 'solution';
  return 'note';
}

function excerpt(body, fallback) {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/^\s*\[[^\]]+\]:.*$/gm, '')
    .replace(/!\[[^\]]*\](?:\([^)]*\)|\[[^\]]*\])/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\$([^$\n]+)\$/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#*>`~|_\\]/g, '')
    .replace(/\s+/g, ' ').trim();
  if (plain.length < 15) return `${fallback}。来自洛谷专栏的原始文章记录。`;
  return Array.from(plain).slice(0, 100).join('') + (Array.from(plain).length > 100 ? '…' : '');
}

const ids = new Set();
const prepared = [];
for (const entry of entries) {
  if (!/^[a-z0-9]+$/.test(entry.id) || ids.has(entry.id)) throw new Error(`Invalid or duplicate article ID: ${entry.id}`);
  ids.add(entry.id);
  const source = path.resolve(archive, entry.file);
  if (!source.startsWith(`${archive}${path.sep}`)) throw new Error(`Source outside archive: ${entry.file}`);
  const body = await readFile(source);
  const checksum = createHash('sha256').update(body).digest('hex');
  if (checksum !== entry.sha256) throw new Error(`Source checksum mismatch: ${entry.id}`);
  const date = entry.published_at_iso || new Date(`${entry.published_at_exact.replace(' ', 'T')}+08:00`).toISOString();
  if (!Number.isFinite(Date.parse(date))) throw new Error(`Invalid publication date: ${entry.id}`);
  const tag = indexedTags.get(entry.id) || inferTag(entry);
  const fields = {
    title: entry.title,
    slug: entry.id,
    description: excerpt(body.toString('utf8'), entry.title),
    date,
    category: categories[tag],
    tags: [tag],
    cover: covers[tag][entry.sequence % covers[tag].length],
    coverAlt: `${categories[tag]}文章的简约插画封面`,
    featured: entry.sequence === 1,
    draft: false,
    sourceUrl: entry.url,
    sourceCategory: entry.category,
    sourceSha256: checksum,
  };
  const header = `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n`;
  prepared.push({ id: entry.id, tag, checksum, body, contents: Buffer.concat([Buffer.from(header), body]) });
}

await mkdir(destination, { recursive: true });
let changed = 0;
for (const article of prepared) {
  const target = path.join(destination, `${article.id}.md`);
  const current = await readFile(target).catch((error) => {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  });
  if (!current?.equals(article.contents)) {
    await writeFile(target, article.contents);
    changed++;
  }
}
for (const file of await readdir(destination)) {
  if (/^[a-z0-9]+\.md$/.test(file) && !ids.has(file.slice(0, -3))) await unlink(path.join(destination, file));
}

const counts = Object.fromEntries(Object.keys(categories).map((tag) => [tag, prepared.filter((article) => article.tag === tag).length]));
console.log(`Synced ${prepared.length} Luogu articles (${changed} changed). ${JSON.stringify(counts)}`);
console.log('All original Markdown bodies and publication timestamps preserved; all SHA-256 checks passed.');
