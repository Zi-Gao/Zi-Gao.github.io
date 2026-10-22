---
title: "AT_abc313_g [ABC313G] Redistribution of Piles 题解"
slug: "5mkc46kb"
description: "题意 你有从 1 到 N 编号的 N 盘石子，第 i 盘石子的个数为 ai，同时你还有一个空背包。 你可以进行以下操作任意次： 1. 从有一个以上石头的盘子里各拿一个石头。取下的石头移动到背包里。 2…"
date: "2024-04-21T03:13:54.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/5mkc46kb"
sourceCategory: "题解"
sourceSha256: "3af54d165d50059e1e05ee2e46b217e351d69d7b9acc85a8662753d54e3907b8"
---
## 题意

你有从 $1$ 到 $N$ 编号的 $N$ 盘石子，第 $i$ 盘石子的个数为 $a_i$，同时你还有一个空背包。

你可以进行以下操作任意次：

1. 从有一个以上石头的盘子里各拿一个石头。取下的石头移动到背包里。
2. 当背包中有大于等于 $N$ 个石子时，从背包中拿出 $N$ 个石子，每盘各放入一个石子。

问最终得到的 $N$ 堆石子个数组成的序列有多少种，答案对 $998244353$ 取模。

- $1\ \leq\ N\ \leq\ 2\ \times\ 10^5$
- $0\ \leq\ a_i\ \leq\ 10^9$

## 题解

首先发现一定是先若干次一操作，然后若干次二操作。不妨先排序原序列，那么不断一操作时，前 $k$ 小的堆会被取完。假设现在前 $i-1$ 堆恰好都被取完后还取了 $j$ 次，现在计算一共取了多少个石子，设为 $S$，并且计 $a_i$ 前缀和为 $sum_i$：

$$
S=sum_{i-1}+\left(n-i+1\right)\left(a_{i-1}+j\right)
$$

所以最多进行 $\lfloor\frac{S}{n}\rfloor$ 次操作二，贡献 $\lfloor\frac{S}{n}\rfloor+1$ 种序列，所以前 $i-1$ 堆取完的总贡献为：

$$
\begin{align}
&\sum_{j=1}^{a_i-a_{i-1}} \left(\left\lfloor \frac{sum_{i-1}+\left(n-i+1\right)\left(a_{i-1}+j\right)}{n}\right\rfloor+1\right)\\
&=\sum_{j=1}^{a_i-a_{i-1}} \left(\left\lfloor \frac{sum_{i-1}+\left(n-i+1\right)a_{i-1}+\left(n-i+1\right)j}{n}\right\rfloor+1\right)\\
&=\left(\sum_{j=1}^{a_i-a_{i-1}} \left\lfloor \frac{sum_{i-1}+\left(n-i+1\right)a_{i-1}+\left(n-i+1\right)j}{n}\right\rfloor\right)+a_i-a_{i-1}
\end{align}
$$

第一部分求和是一个类欧形式，可以在 $\mathcal{O}\left( \log V\right)$ 时间求解。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

const long long mod=998244353;
long long arr[200010],sum[200010];

#define FSUM_TYPE long long
const FSUM_TYPE FSUM_MOD=mod;
FSUM_TYPE fsum(FSUM_TYPE n,FSUM_TYPE a,FSUM_TYPE b,FSUM_TYPE c){
	FSUM_TYPE ac=a/c,bc=b/c,m=(a*n+b)/c;
	if(!a) return (n+1)*bc%FSUM_MOD;
	if(a>=c||b>=c) return (n*(n+1)/2%FSUM_MOD*ac+(n+1)*bc+fsum(n,a%c,b%c,c))%FSUM_MOD;
	return (m*n+FSUM_MOD-fsum(m-1,c,c-b-1,a))%FSUM_MOD;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

	register int i;
	register long long ans;
	int n=read();

	for(i=1;i<=n;++i) arr[i]=read();
	std::sort(arr+1,arr+1+n);

	ans=arr[1]+1,sum[1]=arr[1];
	for(i=2;i<=n;++i)
		ans+=fsum(arr[i]-arr[i-1],n-i+1,(n-i+1)*arr[i-1]+sum[i-1],n)-fsum(0,n-i+1,(n-i+1)*arr[i-1]+sum[i-1],n)+arr[i]-arr[i-1],
		sum[i]=sum[i-1]+arr[i];

	print((ans%mod+mod)%mod);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```