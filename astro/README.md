# 留白 · Zi_Gao's Blog

**Comprehension is compression.**

白色简约 Astro 7 博客。静态输出，发布到 Cloudflare Pages，正式域名为 https://www.zigao.ac 。

## 运行

使用 Node.js 24 LTS（或 22.23.4+）。项目提供 `.nvmrc` 和 `.node-version`：

```bash
cd astro
nvm use         # 尚未安装时先运行 nvm install
npm install
npm run dev
```

```bash
npm run check    # Astro / TypeScript 检查
npm run build    # 生成 dist/ 静态站点
npm run preview  # 预览构建结果
```

## 同步洛谷归档

```bash
npm run sync:luogu
```

默认从 `../luogu-archive/` 读取，支持用参数指定其他备份目录：

```bash
npm run sync:luogu -- /absolute/path/to/luogu-archive
```

96 篇文章：78 篇 `solution`（题解）、10 篇 `note`（笔记）、8 篇 `journal`（游记）。优先采用归档 README 的整理结果，缺失时根据元数据归类。保留原有列表状态的全部文章均按此次全量迁移要求发布。

- 导入位置：`src/content/blog/luogu/<洛谷ID>.md`。
- 文章地址：`/blog/<洛谷ID>/`，不随标题调整而改变。
- 保留原始 Markdown 正文字节、精确发布时间、来源链接、原分类与 SHA-256。
- 写入前校验所有原文件，重复执行只更新发生变化的文件。
- 原始归档与元数据不会被修改；旧的主题示例保存在 `examples/posts/`，不参与发布。
- 原文的外部链接及配图引用保持原样。归档中未包含的图片文件需要另行恢复到 `public/` 下对应路径。

## 写新文章

在 `src/content/blog/` 新建 Markdown 文件：

```yaml
---
title: '我的新文章'
description: '文章摘要'
date: 2026-10-22
category: 笔记
tags: [note]
cover: /images/type-rhythm.svg
featured: false
draft: false
---
```

`category` 可选「题解」「笔记」「游记」。`cover` 可选，图片放在 `public/images/`。最新的 `featured: true` 文章显示在首页精选。`draft: true` 的文章不会进入页面、搜索、RSS、站点地图或归档。

正文支持 GFM、代码高亮、行内及块级数学公式（本地 KaTeX 字体）、自动目录、阅读进度、阅读时长及代码复制。

## 自定义

- 名称、作者、标语与分类：`src/site.config.ts`。
- 主题颜色与排版：`src/styles/global.css` 的 `:root` 变量。
- 首页与作者介绍：`src/pages/index.astro`、`src/pages/about.astro`。
- 社交分享图片：`public/images/og.svg` 与导出的 `og.png`。
- 正式域名：`astro.config.mjs`，也可通过 `SITE_URL` 环境变量覆盖。

## Cloudflare Pages 发布

项目名：`zigao-blog`，生产分支：`main`，静态目录：`dist/`。配置保存在 `wrangler.toml`。

```bash
npx wrangler login  # 已登录时跳过
npm run check
npm run deploy
```

`npm run deploy` 会先构建，然后使用项目内固定版本的 Wrangler 部署。自定义域名需要在 Cloudflare Pages 的 Custom domains 中绑定 `www.zigao.ac`。

RSS：`/rss.xml`；站点地图：`/sitemap-index.xml`。`public/_headers` 配置了静态资源缓存与基本响应头。
