---
title: "CF1852C Ina of the Mountain 题解"
slug: "hbjdglsr"
description: "前言 一个有意思的贪心，但是很少有题解证明了正确性，至少我看着有点迷迷糊糊的，总结一下。 正文 0x00 题目分析 转化一下题目就是给定一个序列 a，可以进行若干次操作每次操作选择一个区间使得这个区间…"
date: "2023-09-21T13:59:41.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/hbjdglsr"
sourceCategory: "题解"
sourceSha256: "262924192085f5e3517c5a8d09df707d3455bfe9d76c4425bec6e74d09706bc8"
---
## 前言

一个有意思的贪心，但是很少有题解证明了正确性，至少我看着有点迷迷糊糊的，总结一下。

## 正文

### 0x00 题目分析

转化一下题目就是给定一个序列 $a$，可以进行若干次操作每次操作选择一个区间使得这个区间元素值减一，求在 $\bmod\, k$ 意义下使得数列变成全 $0$ 数列所需的最小操作次数。

发现这个题的难点在于：$\bmod\, k$ 意义下十分难受。那么自然考虑去掉 $\bmod\, k$ 的条件，求答案。十分经典，对于 $a$ 序列的差分序列 $b$，有答案为：

$$\sum_i b_i\left[b_i\gt0\right]$$

具体证明可以理解为，每当有一个元素上升，那么上升的这一格就不能用之前的区间覆盖掉了，答案贡献 $1$。但是在这个题中需要 $\bmod\, k$ 而主要的问题就是当这个数到 $-1$ 后会重新变成 $k-1$，这里需要读者思考一下。

### 0x01 找到联系

我们不妨想成是把这个值加上了 $k$，然后不 $\bmod$ 计算答案，不难发现这和直接在 $\bmod\, k$ 下计算答案是等价的。那么现在可能对答案的贡献有两个东西了：

1. 差分序列的贡献。

2. 区间加 $k$ 的贡献。

考虑区间加 $k$ 这个东西有什么用？发现有这样一种情况就是当差分数组 $b_i$ 特别大时，我们对 $i$ 加上 $k$ 即可抹去 $b_i$ 让 $b_i\leq 0$，因为 $\bmod\, k$ 了，元素大小不会超过 $k$。这两种选择像是一种决策性质的东西，对于每一个点看是直接计算 $b_i$ 更优；还是选择一个以 $i$ 为开右边界的区间加上 $k$ 更好。要衡量哪个方案更好考虑量化这两个决策：

1. 对于 $b_i\le0$ 时，选择这个决策的答案贡献为 $b_i$；否则答案贡献为 $0$，且容易证明 $b_i\leq 0$ 时无脑选择这个决策答案不会更劣。

2. 选择一个左端点 $j$，对于 $\left[j,i\right)$ 区间元素加上 $k$，由于加上了 $k$ 在区间内部的元素大小相对作差关系不会变化，则无答案贡献；而区间两个端点的贡献只有左端点，应为右端点直接变成下降，计算左端点答案贡献为 $b_j+k-\min(b_j,0)$ 应为这个地方差分会变大，新的贡献是 $b_j+k$，而原来的贡献是 $\min(b_j,0)$，并且 $b_j+k\geq0$。

可以从这个地方开始 DP 了，但是实际上不需要。


### 0x02 继续观察性质：

1. 一个点不可能作为左端点两次，这样答案只会更劣。意味着我们可以把某个点拿来决策了就扔。

2. 选择一段区间加 $k$，对其他地方完全不影响可以正常执行。

3. 在某一个点选择了一段区间加 $k$，在后续中不会出现这里不执行这个操作让答案更劣的情况，这样操作后后续不管想选哪个点作为左端点都不于这个操作冲突，因为这个操作只会影响两个端点，其他点的差分值不变，而左端点和又端点对答案的贡献又是最优的。

那么考虑贪心，用小根堆维护 $b_i+k$ 的值，每次找最小的点出来，看看哪个决策更优。

### 0x03 代码实现

分类讨论执行：

1. $b_i\le0$ 时直接忽略，把 $b_i+k$ 入堆。

2. $b_i\ge0$ 时可以考虑一种更精巧的实现，考虑进行区间加 $k$ 还是朴素贡献

	- 当 $b_i$ 大于堆顶时，选择堆顶的答案贡献，弹出堆顶并且把 $b_i-k+k$ 放入堆。
    
   - 否则选择 $b_i$。
   
这种时候直接一开始就放入 $b_i$ 然后选择堆顶答案并且弹出，即可自动维护好答案。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

void solve(){
    std::priority_queue<int,std::vector<int>,std::greater<int>> Q;
    register int i,lat=0,a,diff;
    register long long ans=0;
    int n=read();
    int k=read();
    for(i=0;i<n;++i){
        diff=(a=read()%k)-lat,lat=a;
        if(diff<=0) Q.push(diff+k);
        else Q.push(diff),ans+=Q.top(),Q.pop();
    }
    print(ans);putchar('\n');
    return;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    int T=read();
    while(T--) solve();

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

这个题考察两个能力，转化困难问题的能力和观察性质的能力。