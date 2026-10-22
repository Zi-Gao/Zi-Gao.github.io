---
title: "P14310 【MX-S8-T3】图排列 题解"
slug: "irifngw1"
description: "出题人题解，欢迎观看视频题解，打不开的把链接 提示1：W{i,3}=3,W{i,4}=4,W{i,5}=5 怎么做？也就是相当于排列长度为 2。 发现可以生成的集合要么是 {[1,2]} 要么是 {[…"
date: "2025-10-26T23:30:09.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/irifngw1"
sourceCategory: "题解"
sourceSha256: "33247d1b20d5170d2a0bf32e5f4ef97c8a83fc751c8165ebf0f03647dfed8443"
---
出题人题解，[欢迎观看视频题解](https://www.bilibili.com/video/BV1hhsfzYEdc/)，打不开的把链接`https://www.bilibili.com/video/BV1hhsfzYEdc/`复制下来打开。

**提示1**：$W_{i,3}=3,W_{i,4}=4,W_{i,5}=5$ 怎么做？也就是相当于排列长度为 $2$。

发现可以生成的集合要么是 $\{[1,2]\}$ 要么是 $\{[1,2],[2,1]\}$。如果路径上只有 $[1,2]$ 这个排列就是 $\{[1,2]\}$，只要出现了 $[2,1]$ 就是 $\{[1,2],[2,1]\}$。保留每种边判断连通性即可。


**提示2**：$W_{i,4}=4,W_{i,5}=5$ 怎么做？也就是相当于排列长度为 $3$，可以生成的集合有多少个呢？

最坏的估计就是，一共 $6$ 个排列，每种都会出现或者不出现，那么就是 $2^6$ 个。

但是列举一下，发现生成的集合只能是：

  1. $\{[1,2,3]\}$ 只有 $[1,2,3]$。
  2. $\{[1,2,3],[1,3,2]\}$ 交换 $2,3$。
  3. $\{[1,2,3],[2,1,3]\}$ 交换 $1,2$。
  4. $\{[1,2,3],[3,2,1]\}$ 交换 $1,3$。
  5. $\{[1,2,3],[2,3,1],[3,1,2]\}$ 循环位移。
  6. $\{[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]\}$ 全集。

可以发现远没有 $2^6$ 个，同理可以枚举每个集合判断连通性。

这种尝试继续搜一下长度为 $4$ 的排列可以生成的集合有多少个？发现只有 $30$ 个。

大胆猜想长度为 $5$ 的排列可以生成的集合也很少。

**提示3**：暴力搜索一下发现可能生成的本质不同集合只有 $156$ 个。

暴力枚举一下每个可能生成的集合，把其中的边找出来，使用并查集求出连通性，然后查询每个询问是否连通即可，对于每个询问找出取最小可以连通的集合就行。

时间复杂度 $\mathcal{O}(nK+S)$ 其中 $K$ 是可以生成的子群数量，$S$ 是搜索复杂度，当然也可以打表。当然也可以使用并查集完成，比 dfs 可能还跑得快一些。

```cpp
#include<bits/stdc++.h>

#define NOBUG
// #define ONLINE_JUDGE
#define il inline __attribute((always_inline)) 

#ifdef NOBUG
#define dbg(...) fprintf (stderr, __VA_ARGS__)
#else
#define dbg(...) void()
#endif

using u32=unsigned int;
using i64=long long;
using u64=unsigned long long;
using i128=__int128_t;

const int W=5;
using P=std::array<int,W>;

std::map<P,int> p2val;
std::map<int,P> val2p;

int comp[200][200],cntp;

P operator + (P a,const P &b){
    int i;
    for(i=0;i<W;++i) a[i]=b[a[i]];
    return a;
}

std::map<i128,int> vis;

i128 ins(i128 x,int u){
    int i;
    std::queue<int> Q;
    Q.push(u);
    while(!Q.empty()){
        u=Q.front(),Q.pop();
        for(i=0;i<cntp;++i) if(((x>>i)&1)&&(!(x>>comp[u][i]&1))) Q.push(comp[i][u]),x|=i128(1)<<comp[u][i];
    }
    return x;
}

std::vector<std::array<int,2>> e[200];
std::array<int,3> qrys[300010];

int par[300010],siz[300010];
int find(int x){return (x==par[x])?x:(par[x]=find(par[x]));}
void merge(int u,int v){
    u=find(u),v=find(v);
    if(u==v) return;
    if(siz[u]>siz[v]) std::swap(u,v);
    siz[v]+=siz[u],par[u]=v;
    return;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    int i,j,u,v,w;

    P p;
    for(i=0;i<W;++i) p[i]=i;
    i=0;
    do{
        p2val[p]=cntp;
        val2p[cntp]=p;
        ++cntp;
    }while(std::next_permutation(&p[0],&p[0]+W));

    for(i=0;i<cntp;++i) for(j=0;j<cntp;++j) comp[i][j]=p2val[val2p[i]+val2p[j]];

    std::queue<i128> Q;
    Q.push(1);
    while(!Q.empty()){
        i128 u=Q.front(),v;
        Q.pop();
        for(i=0;i<cntp;++i) if(!vis[v=ins(u,i)]) vis[v]=1,Q.push(v);
    }

    int n,m,q;
    scanf("%d%d%d",&n,&m,&q);

    while(m--){
        scanf("%d%d",&u,&v);
        for(j=0;j<W;++j) scanf("%d",&p[j]),p[j]-=1;
        w=p2val[p];
        e[w].push_back({u,v});
    }

    for(i=0;i<q;++i){
        scanf("%d%d",&qrys[i][0],&qrys[i][1]);
        qrys[i][2]=cntp+1;
    }

    for(auto [v,_]:vis){
        int s=0;
        for(i=1;i<=n;++i) par[i]=i,siz[i]=1;
        for(i=0;i<cntp;++i) if((v>>i)&1){
            ++s;
            for(auto [u,v]:e[i])
            merge(u,v);
        }
        for(i=0;i<q;++i) if(find(qrys[i][0])==find(qrys[i][1]))
            qrys[i][2]=std::min(qrys[i][2],s);
    }

    for(i=0;i<q;++i) if(qrys[i][2]==cntp+1) printf("No\n");else printf("%d\n",qrys[i][2]);

    return 0;
}
```