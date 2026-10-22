---
title: "AT_abc390_f [ABC390F] Double Sum 3 点边容斥做法 题解"
slug: "h85speav"
description: "首先我们了解一下点边容斥，目标是数一个树上的联通块个数，我们知道一棵树有 n 个点，那么就有 n-1 条边，所以只需要数所有的点个数减去所有的边个数就行。 那么这道题实际上是一条链数联通块，那么同样这…"
date: "2025-01-26T07:45:50.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/h85speav"
sourceCategory: "题解"
sourceSha256: "a5991f58caba8828b8d8d4505216a163c986ae1025ebfa3582b37a75346031a4"
---
首先我们了解一下点边容斥，目标是数一个树上的联通块个数，我们知道一棵树有 $n$ 个点，那么就有 $n-1$ 条边，所以只需要数所有的点个数减去所有的边个数就行。

那么这道题实际上是一条链数联通块，那么同样这样数就行，从左到右扫描线，记录每个点 $a_i$ 上一次出现的位置 $p_{a_i}$，那么固定 $R$ 到 $i$，对于所有的 $L$，会贡献 $i-p_{a_i}$ 个点。

现在来看边，会影响的只有两条边，到 $a_i-1$ 和 $a_i+1$，分析一下到 $a_i-1$，那么需要算出 $L\in(p_{a_i},i]$ 贡献多少条边，那么就是 $\max(p_{a_{i}-1}-p_{a_i},0)$，到 $a_i+1$ 同理。

代码很简洁，轻松最优解：

```cpp
#include<bits/stdc++.h>

int pre[300010];

int main(){
    int i,j,a,n;
    long long res=0,cnt=0;
	scanf("%d",&n);
    for(i=1;i<=n;++i) scanf("%d",&a),res+=(cnt+=i-pre[a]-std::max(pre[a-1]-pre[a],0)-std::max(pre[a+1]-pre[a],0)),pre[a]=i;

    printf("%lld",res);

    return 0;
}
```