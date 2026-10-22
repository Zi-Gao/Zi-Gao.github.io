---
title: "CF1824B1 LuoTianyi and the Floating Islands (Easy Version) 题解"
slug: "fxbbg3ge"
description: "前言 感觉大家分类讨论了好多无用的东西，其实可以更简化。 正文 0x00 分析题目 首先可以发现 kleq3，那么自然想到去看看每一个 k 对应的情况： 1. k=1 自然每次答案为 1，期望为 1。…"
date: "2023-09-01T12:28:17.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/fxbbg3ge"
sourceCategory: "题解"
sourceSha256: "b9cc39b8f1de7b616a86cbd43ce4cec2584a365036b34160c0fbeb30fb8c1f87"
---
## 前言

感觉大家分类讨论了好多无用的东西，其实可以更简化。

## 正文

### 0x00 分析题目

首先可以发现 $k\leq3$，那么自然想到去看看每一个 $k$ 对应的情况：

1. $k=1$ 自然每次答案为 $1$，期望为 $1$。

2. $k=3$ 考虑三个点的交汇处，即任意两点 LCA 中距离每个点距离和最小的那个点，实际上我们还可知道这个点是所有点中距离每个点距离和最小的店。因为此时向任意一个方向走会使得与某两个点的距离增加 $1$，与某一个点的距离减少 $1$。总贡献为 $+1$，显然其他点不优。那么每次答案为 $1$，期望为 $1$。

接下来只需要具体分析 $k=2$ 情况即可。可以发现树上任意选取两个点，这条链上的所有点都会贡献答案，也就是转化为求树上任意两点距离和，而链上点数就是距离加一。

这个问题十分常见，直接考虑每个子树内的点经过子树根到其父亲的那条边的贡献即可，记子树大小为 $s$，根据乘法原理答案贡献为 $s\times\left(n-s\right)$。

最后乘上方案数 $\frac{n\left(n-1\right)}{2}$ 的逆元即可。

### 0x01 代码实现

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

#define INV_DATA_TYPE long long
INV_DATA_TYPE exgcd(INV_DATA_TYPE a,INV_DATA_TYPE b,INV_DATA_TYPE&x,INV_DATA_TYPE&y){if(!b){x=1;y=0;return a;}INV_DATA_TYPE d=exgcd(b,a%b,y,x);y-=a/b*x;return d;}INV_DATA_TYPE inv(INV_DATA_TYPE n,INV_DATA_TYPE p){INV_DATA_TYPE x,y;exgcd(n,p,x,y);x%=p;return x>=0?x:x+p;}

const long long mod=1000000007;
long long ans;
int siz[200010],n;

std::vector<int> e[200010];

void addEdge(int u,int v){
    e[u].push_back(v);
}

void dfs(int u,int p){
    siz[u]=1;
    for(auto v:e[u])
        if(v!=p){
            dfs(v,u);
            siz[u]+=siz[v];
        }
    ans=(ans+1ll*siz[u]*(n-siz[u]))%mod;
    return;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,u,v;
    n=read();
    int k=read();
    if(k&1){
        puts("1");
        return 0;
    }
    for(i=1;i<n;++i){
        u=read();
        v=read();
        addEdge(u,v);
        addEdge(v,u);
    }
    dfs(1,1);

    print((ans*inv(1ll*n*(n-1)>>1,mod)+1)%mod);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```