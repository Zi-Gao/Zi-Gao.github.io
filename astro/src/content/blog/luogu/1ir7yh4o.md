---
title: "P7156 [USACO20DEC] Cowmistry P 题解"
slug: "1ir7yh4o"
description: "给一个代码好写的做法。 首先假设建了完整的 Trie 树，那么三个不同的点 u,v,w 在 Trie 树上的虚树一定是 5 个点（包含叶子节点和 LCA）。我们钦定 v,w 的 LCA 是 x，x 和…"
date: "2025-12-13T03:38:22.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/1ir7yh4o"
sourceCategory: "题解"
sourceSha256: "31a493322c3fd8cc5d7a49ceaa6c53deeaf1e8e2ebd363f5a5f5f76236eae53c"
---
给一个代码好写的做法。

首先假设建了完整的 Trie 树，那么三个不同的点 $u,v,w$ 在 Trie 树上的虚树一定是 5 个点（包含叶子节点和 LCA）。我们钦定 $v,w$ 的 LCA 是 $x$，$x$ 和 $u$ 的 LCA 是 $y$，并且 $x$ 深度大于 $y$。

那么容易发现最大异或值一定出现在 $u\oplus v$ 或 $u\oplus w$ 中，钦定是 $u\oplus w$。考虑在 Trie 上 dfs 遍历 $S$ 节点，类似于数位 dp，某些位置 $K$ 为 $1$ 我们就可以选 $0$ 从而解除限制。让 $u\in S$，同时找到同深度的 $T$ 的节点，使得存在 $w\in T$ 满足前缀条件，这样就可以找到 $w,v$ 在哪里解除限制，从而计算 $u,v,w$ 的合法对数。

先找 $w$ 解除限制的方案，设 $\text{solve}(S,T)$ 返回 $\sum_{u\in S,w\in T}[u\oplus w\leq K]$，记为 $r$。设 $K$ 这一位为 $k$，记节点 $X$ 的两个儿子是 $X_0, X_1$。

如果当前位走 $o$，为了满足 $u\oplus w \le K$ 的限制，递归计算 $b=\text{solve}(S_o, T_{o\oplus k})$。分类讨论 $k$：

1. $k=0$：此时 $u, w$ 必须选相同的方向才能满足 $\le K$（紧贴限制），无法通过选不同方向来解除限制，所以 $r \leftarrow b$。
2. $k=1$：
   1. $S$ 和 $T$ 这一位选不一样（即 $u \to o, w \to o \oplus 1$）：此时异或值为 1，等于 $K$ 的当前位，限制仍然没有解除（紧贴限制），$r \leftarrow b$。
   2. $S$ 和 $T$ 这一位选一样（即 $u \to o, w \to o$）：此时异或值为 0，小于 $K$ 的当前位 1，$w$ 在这一位解除了限制，后续可以随便选，所以 $r \leftarrow r + \text{siz}_{S_o} \times \text{siz}_{T_{o}}$。

接下来计算答案。
第一种是 $w$ 到当前位还没有解除限制的情况，并且钦定 $v$ 在当前位解除限制，也就是 $x$ 分叉在 $T$ 的当前层。考虑对答案的贡献只能在 $y$ 分叉之后，所以 $S \neq T$ 时才能贡献。这里分类讨论 $k$：

1. $k=0$：由于必须满足 $u \oplus w$ 这一位异或为 0，无法在 $T$ 的位置让 $v$ 分叉，所以不贡献答案，直接递归下去算。
2. $k=1$ 有两种情况：
   1. $T$ 出分叉出 $x$，也就是 $v$ 在这一位解除限制。此时 $v \in T_o, w \in T_{o\oplus 1}$。只需要满足 $u\oplus w\leq K$ 即可（即 $b$ 部分），$v$ 可以在 $T_o$ 中任选，所以贡献 $b \times \text{siz}_{T_o}$。
   2. $v, w$ 都在这一位相对于 $u$ 解除了限制（即 $u \to o$，而 $v, w$ 都去往 $T_o$）。此时 $u,v,w$ 满足 $u \oplus v < K$ 且 $u \oplus w < K$。$v, w$ 在 $T_o$ 子树中任意分叉均可，所以贡献 $\binom{\text{siz}_{T_o}}{2} \times \text{siz}_{S_o}$。

最后算一下 $w$ 早就解除了限制，即在之前层级已经满足 $u \oplus w < K$ 的情况。此时若 $u,v,w$ 的 LCA $y$ 在当前 $S$ 节点处分叉（即 $u$ 在 $S_o$，而 $v,w$ 在 $S_{o\oplus 1}$），则贡献为 $\sum_o \binom{\text{siz}_{S_{o\oplus 1}}}{2} \times \text{siz}_{S_o}$。

但是节点数量太多了，考虑把满二叉树都压缩一下，然后记忆化 $\text{solve}$ 函数即可。由于 $S,T$ 一一对应，$S$ 为空不会遍历，而 $S,T$ 都进入满二叉树就会被记忆化，所以复杂度 $\mathcal{O}(n\log V)$。

```cpp
#include<bits/stdc++.h>
using u32=unsigned int;
using u64=unsigned long long;
const u32 mod=1000'000'007;
const u32 iv2=(mod+1)/2;
u32 K;
const int W=29;
const int V=1<<(W+1);
const int N=100000010;
int trie[N][2],cntnod=0,rt;
u32 siz[N];
std::map<u64,std::array<u32,2>> mp;
std::array<u32,2> solve(int S,int T,char flg,int dep){
    if(dep==-1) return {!!T,0};
    u32 k=(K>>dep)&1,o;
    u32 r=0,a=0,ss;
    u64 hash=(u64(S+1)<<40)|(u64(T+1)<<8)|(dep<<1)|flg;
    auto it=mp.find(hash);
    if(it!=mp.end()) return it->second;
    auto sz=[&](int p){
        if(~p) return siz[p];
        return 1u<<dep;
    };
    auto ch=[&](int p,int o){
        if(~p) return trie[p][o];
        return -1;
    };
    if(k==0){
        for(o=0;o<2;++o) if(ch(S,o)){
            auto [b,y]=solve(ch(S,o),ch(T,o),flg,dep-1);
            (r+=b)%=mod;
            (a+=y)%=mod;
        }
    }else{
        for(o=0;o<2;++o)if(ch(S,o)){
            auto [b,y]=solve(ch(S,o),ch(T,o^1),1,dep-1);
            r=(r+b+(u64)sz(ch(S,o))*sz(ch(T,o)))%mod;
            (a+=y)%=mod;
            if(flg){
                ss=sz(ch(T,o));
                a=(a+(u64)b*ss+(u64)ss*(ss-1)%mod*iv2%mod*sz(ch(S,o)))%mod;
            }
        }
    }
    if(flg) for(o=0;o<2;++o){
        ss=sz(ch(S,o^1));
        a=(a+(u64)ss*(ss-1)%mod*iv2%mod*sz(ch(S,o)))%mod;
    }
    return mp[hash]={r,a};
}
void ins(int &p,int l,int r,int s,int t){
    if(s<=l&&r<=t){
        p=-1;
        return;
    }
    if(!p) p=++cntnod;
    int mid=(l+r)/2;
    siz[p]+=std::min(r,t)-std::max(l,s);
    if(s<mid) ins(trie[p][0],l,mid,s,t);
    if(mid<t) ins(trie[p][1],mid,r,s,t);
}
int main(){
    int i,l,r,o,n;
    scanf("%d%d",&n,&K);
    while(n--){
        scanf("%d%d",&l,&r);
        ins(rt,0,V,l,r+1);
    }
    auto [_,res]=solve(1,1,0,W);
    printf("%d",res);
    return 0;
}
```