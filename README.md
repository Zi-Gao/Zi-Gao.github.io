# Zi_Gao's Blog

**Comprehension is compression.**

- `astro/`：白色简约 Astro 博客，发布到 https://www.zigao.ac 。
- `luogu-archive/`：96 篇洛谷文章的原始 Markdown、元数据与校验值。

## 开发与同步

使用 Node.js 24 LTS：

```bash
cd astro
npm install
npm run sync:luogu
npm run dev
```

同步脚本校验原文 SHA-256，保留正文原始字节与精确发布时间，并按归档索引归类为 `solution`、`note`、`journal`。重复执行不会重复创建文章。原始归档不会被修改。

更多配置和发布说明见 [astro/README.md](astro/README.md)。
