---
title: "P8499 [NOI2022] 挑战 NPC Ⅱ 题解"
slug: "y77a1wgq"
description: "我们令 f(u,v) 表示，G 的 u 子树是否能和 H 的 v 子树匹配上。求解 f(u,v) 相当于一个二分图匹配的过程，对于 xin sonu,yin sonv，如果 f(x,y)=1，则有一条…"
date: "2025-06-26T09:39:51.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/y77a1wgq"
sourceCategory: "题解"
sourceSha256: "9eeee693e105ec8b5dfb9504d36f31b4caad6afdcb76b85874153ffc7fd56846"
---
我们令 $f(u,v)$ 表示，$G$ 的 $u$ 子树是否能和 $H$ 的 $v$ 子树匹配上。求解 $f(u,v)$ 相当于一个二分图匹配的过程，对于 $x\in son_u,y\in son_v$，如果 $f(x,y)=1$，则有一条左部 $x$ 到右部 $y$ 的连边，那么 $f(u,v)=1$ 当且仅当匹配数量为 $|son_v|$，这样就可以直接[混到 64 分](https://www.luogu.com.cn/record/221468728)。

考虑减枝，对于 $x\in son_u,y\in son_v$，如果 $x$ 和 $y$ 子树完全相同，则可以直接匹配上，然后就能直接[混到 100 分](https://www.luogu.com.cn/record/221468273)。

![](https://cdn.luogu.com.cn/upload/image_hosting/tkcfcwoh.png)

复杂度为什么是对的吗？答案是复杂度是错的。题解区可能很多人复杂度都是错的，但是写了很多减枝，所以还不如简洁一点。

```cpp
#include<bits/stdc++.h>

// #define NOBUG
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

#define getu(x) typename std::make_unsigned<x>::type
template<typename T=int>il T read(){getu(T)x=0;char c=getchar(),f=0;while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=x*10+(c&15),c=getchar();return f?-x:x;}char ous[50];template<typename T>il void print(const T&x){if(x==0)return putchar('0'),void();getu(T)y=x;if(x<0)y=-y,putchar('-');char*p=ous;while(y){*(p++)=y%10;y/=10;}while(p>ous)putchar(*(--p)|'0');}

u64 hash[1000010],mask;

u64 xorshift(u64 x){
    x^=x<<5;
	x^=x>>11;
	x^=x<<54;
    return x^mask;
}

struct GRAPH{
    int n,root;
    std::vector<int> e[100010];
    u64 hash[100010];
    void dfs(int u){
        for(auto v:e[u]) dfs(v),hash[u]+=hash[v];
        hash[u]=xorshift(hash[u]);
    }
    void init(){
        int i,x;
        n=read();
        for(i=1;i<=n;++i) e[i].clear(),hash[i]=0;
        for(i=1;i<=n;++i) if(~(x=read())) e[x].push_back(i); else root=i;
        dfs(root);
    }
}t[2];

int vis[100010],mch[100010];
std::vector<int> e[100010];

bool dfs(int u,int tag){
    if(vis[u]==tag) return false;
    vis[u]=tag;
    for(auto v:e[u]) if(mch[v]==-1||dfs(mch[v],tag)) return mch[v]=u,true;
    return false;
}

bool dfs(std::array<int,2> u){
    int i,j,o;
    std::vector<int> cur[2];
    for(o=0;o<2;++o){
        for(auto v:t[o].e[u[o]]) cur[o].push_back(v);
    }

    if(cur[0].size()<cur[1].size()) return false;
    if(cur[1].empty()) return true;

    std::vector<std::array<int,2>> es;
    for(i=0;i<cur[0].size();++i) for(j=0;j<cur[1].size();++j) if(dfs({cur[0][i],cur[1][j]})) es.push_back({i,j});

    int now=0;
    for(i=0;i<cur[0].size();++i) e[i].clear();
    for(auto [u,v]:es) e[u].push_back(v);
    memset(vis,-1,sizeof(int)*cur[0].size());
    memset(mch,-1,sizeof(int)*cur[1].size());
    for(i=0;i<cur[0].size();++i) now+=dfs(i,i);
    return now==cur[1].size();
}

void solve(){
    t[0].init(),t[1].init();
    puts(dfs({t[0].root,t[1].root})?"Yes":"No");
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif


    mask=std::mt19937_64(std::chrono::steady_clock::now().time_since_epoch().count())();

    int C=read();
    int T=read();
    int k=read();

    while(T--) solve();

    return 0;
}
``
```