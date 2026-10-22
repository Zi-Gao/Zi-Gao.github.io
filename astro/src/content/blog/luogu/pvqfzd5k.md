---
title: "斜率优化总结附1：题目浅析"
slug: "pvqfzd5k"
description: "P3195 [HNOI2008]玩具装箱 模板题。 斜率递增，X递增，min/维护上凸壳，单调队列即可。 P5017 [NOIP2018 普及组] 摆渡车 推式子有一定难度。 上凸壳，单调队列即可。 …"
date: "2023-03-19T09:05:38.000Z"
category: "笔记"
tags: ["note"]
cover: "/images/type-rhythm.svg"
coverAlt: "笔记文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/pvqfzd5k"
sourceCategory: "个人记录"
sourceSha256: "8790a12673bf10ac194909dc4023240f1810446c975c7a5aedbe8bcf28c0ea57"
---
## P3195 [HNOI2008]玩具装箱

模板题。

斜率递增，X递增，min/维护上凸壳，单调队列即可。

## P5017 [NOIP2018 普及组] 摆渡车

推式子有一定难度。

上凸壳，单调队列即可。

## P2365 任务安排

推式子有一定技巧性。

仍然是上凸壳，单调队列即可。

## P2365 特别行动队

打好基础，同上。

## P2120 [ZJOI2007] 仓库建设

打好基础，同上。

## P5785 [SDOI2012]任务安排

上凸壳，二分单调队列即可。

## P4072 [SDOI2016]征途

二维斜率优化入门。

上凸壳，二分单调队列即可。~~当然也可以WQS二分~~

## P4360 [CEOI2004] 锯木厂选址

比较有意思的二维斜率优化。

上凸壳，二分单调队列即可。注意这种二维不是WQS二分。

## P2305 [NOI2014] 购票

DFS搜索遍历树，维护栈中的节点的链，即当前节点到根节点这条链，这个链上跑二分。由于需要回退，需要记录单调队列修改的元素。并且需要拆分链，可用树状数组。

上凸壳，树状数组套二分单调队列+回退。

推荐[小粉兔的题解](https://www.luogu.com.cn/blog/PinkRabbit/solution-p2305)

## P5308 [COCI2018-2019#4] Akvizna

反向推式子比较有技巧性。

接着，WQS二分套上斜率优化的模板题。

推荐[ADay's题解](https://aday526.blog.luogu.org/solution-p5308)