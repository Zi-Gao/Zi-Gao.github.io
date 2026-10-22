---
title: "AT_abc318_e [ABC318E] Sandwiches 提供一种神经病做法 - 竞赛图三元环技术"
slug: "21irevdb"
description: "前言 我去，以为多难呢，搞了个三元环出来，结果根本不用。但是这样优势就是代码好写。 正文 0x00 分析题目 看到三元组的条件，首先想到可以建图跑一个三元环计数。那么考虑怎么建立图论模型。 由于 Ai…"
date: "2023-09-04T04:20:22.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/21irevdb"
sourceCategory: "题解"
sourceSha256: "5716bec6512476b5fa3aa11c9d23c8f1e9dd4fbd17b0122e4adb5fc641527544"
---
## 前言

我去，以为多难呢，搞了个三元环出来，结果根本不用。但是这样优势就是代码好写。

## 正文

### 0x00 分析题目

看到三元组的条件，首先想到可以建图跑一个三元环计数。那么考虑怎么建立图论模型。

由于 $A_i=A_k,A_i\not=A_j,i\lt j\lt k$ 那么则有 $A_j\not=A_k$。这样考虑当 $A_i\not=A_j,i\lt j$ 时建立 $i\rightarrow j$ 的有向边；当 $A_i=A_j,i\lt j$ 时建立 $i\leftarrow j$ 的有向边。这样建立出一个竞赛图即可计数三元环。设点 $u$ 的入度为 $out_u$ 有结论三元环个数为 $\left(\begin{matrix}n\\3\end{matrix}\right)-\sum_{i=1}^{n}\left(\begin{matrix}out_i\\2\end{matrix}\right)$。实际上就是容斥一下，用最多的个数减去不合法的个数。

### 0x01 代码实现

正反扫两次数组，开个桶记录一下数字出现个数，计算好入度即可。

AC CODE

```cpp
#include<bits/stdc++.h>
#define int long long
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

long long out[300010];

int a[300010],buc[300010];

signed main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i;
    register long long res=0;
    int n=read();
    for(i=1;i<=n;++i) a[i]=read();

    for(i=1;i<=n;++i)
        out[i]+=(buc[a[i]]++);

    for(i=1;i<=n;++i) buc[i]=0;

    for(i=n;i;--i)
        out[i]+=(n-i-(buc[a[i]]++));

    res=n*(n-1)*(n-2)/6;

    for(i=1;i<=n;++i) res-=out[i]*(out[i]-1)/2;

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

这样的题需要我们善于观察，训练转换问题的能力。