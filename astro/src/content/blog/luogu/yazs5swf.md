---
title: "CF1666K Kingdom Partition 题解"
slug: "yazs5swf"
description: "一个极度对称优美的做法。 首先观察 ABC，发现 A 和 B 同构，所以尝试把 C 放在中间去考虑。令 xu 表示 u 的选择，列出对于 u xleftrightarrow{w} v 一条边，所有 x…"
date: "2025-12-23T00:52:54.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/yazs5swf"
sourceCategory: "题解"
sourceSha256: "c148be6f3b5195fbffd354fa452fbda1004b10d6ad209d5aabcd3d1209ed914c"
---
一个极度对称优美的做法。

首先观察 `ABC`，发现 `A` 和 `B` 同构，所以尝试把 `C` 放在中间去考虑。令 $x_u$ 表示 $u$ 的选择，列出对于 $u \xleftrightarrow{w} v$ 一条边，所有 $x_u,x_v$ 的矩阵 $W_{u,v}$：

$$
\begin{array}{c|ccc}
B & 0 & 1 & 2 \\
C & 1 & 0 & 1 \\
A & 2 & 1 & 0 \\
\hline
  & A & C & B
\end{array}
$$

最小割只能解决对于 $x_u\leq a,x_v\geq b$ 的变量增加花费，也就是对于矩阵右下角和左上角加划分，显然无法构造。进一步观察，发现对于把 $C$ 作为坐标轴原点，那么图像就是 $|x_u+x_v|$：

$$
\begin{array}{r|ccc}
B \, (+1) & 0 & 1 & 2 \\
C \, (0) & 1 & 0 & 1 \\
A \, (-1) & 2 & 1 & 0 \\
\hline
|x_u + x_v| & A \, (-1) & C \, (0) & B \, (+1)
\end{array}
$$

不能直接割所以就只能拆点，最小割只能做 $|x-y|$ 情形，变成这种情况也就是 $|x_u-(-x_v)|$，所以会那么这个式子可以是 $x_u-(-x_v),-(x_u)-x_v$，所以考虑对于一个 $x_u$ 用两个点 $A_u,B_u$，分别表示他在作为 $+x_u$ 和 $-x_u$ 出现的贡献点，那么对于 $x_u$ 选择 $-1$ 也就是把两个点反过来。那么我们钦定：

1. $A_u$ 选到 $S$ 集合，$B_u$ 选到 $T$ 集合表示选择了颜色 `A`。
2. $A_u$ 选到 $T$ 集合，$B_u$ 选到 $S$ 集合表示选择了颜色 `B`。
3. $A_u,B_u$ 同时选到一个集合表示选择了颜色 `C`。

所以对于 $u \xleftrightarrow{w} v$ 只需要交叉连双向边 $A_u \xleftrightarrow{w} B_v,B_u \xleftrightarrow{w} A_v$，即可做到当 $u,v$ 同时是 `A` 或者 `B`，则会割掉两条边，否则不会，如果其中一个是 `C`，则只会割掉一条边。

最后考虑如果两个 `C` 有边，但是一个分配到 `S` 一个分配到 `T` 则会把所有边割掉，但是最小割会自动规避掉这种情况，因为显然这样不是最小割。

钦定作为 `A` 或者 `B` 就链接 $\infty$ 边钦定选到 $S$ 集合或者 $T$ 集合即可。