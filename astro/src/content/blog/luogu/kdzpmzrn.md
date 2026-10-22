---
title: "P4727 [HNOI2009] 图的同构计数 和 P4128 [SHOI2006] 有色图 题解"
slug: "kdzpmzrn"
description: "0x00 Burnside's lemma 这里需要一点群论的知识，设 G 是一个置换群群，将作用在集合 X 上，有以下结论： - 其中 X/G 表示集合 X 在群 G 作用下的本质不同元素集合，那么…"
date: "2024-12-21T10:33:41.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/kdzpmzrn"
sourceCategory: "题解"
sourceSha256: "ab55c939357b167f097f665e1b808582ca0e9678d3781bcb115b6d49a94c5527"
---
## 0x00 Burnside's lemma

这里需要一点群论的知识，设 $G$ 是一个置换群群，将作用在集合 $X$ 上，有以下结论：

$$
\left|X/G\right|=\frac{1}{\left|G\right|}\sum_{g\in G} \left|X^g\right|
$$

- 其中 $X/G$ 表示集合 $X$ 在群 $G$ 作用下的本质不同元素集合，那么 $\left|X/G\right|$ 则表示本质不同元素个数，即轨道数。
- $g$ 表示置换群 $G$ 中的一个置换。
- $X^g$ 表示集合 $X$ 在置换 $g$ 变换下，$X$ 集合中的不动点，$\left|X^g\right|$ 自然表示不动点数。

对于这个题来说 $X$ 就是 $n$ 个点的简单无向图集合，一共 $2^{{n\choose 2}}$ 个。$G$ 就是点标号的置换的集合，即排列的集合，一共 $n!$ 个。$g$ 就是一个排列，$\left|X^g\right|$ 则表示按照 $g$ 对图重标号后，有多少个图和原来一样。

若两个图同构，说明可以通过重标号一个图的方式得到另一个图，所以说 $\left|X/G\right|$ 就等于有多少个不同构的数。这样转化重点就是计算 $\left|X^g\right|$。

## 0x01 计算 $\left|X^g\right|$

假设有一个 $g$，怎么计算 $\left|X^g\right|$，显然只需要关注边的情况，什么情况下一个图在 $g$ 变换后与原图相同呢？假设现在有两个点 $u,v$，则他们重编号映射后就是 $g_{u},g_{v}$，由于要和原图相同，所以 $u,v$ 的连边情况和原图要是相同的。这意味着在 $g$ 的变化下有一些边是等价的，对于某一个等价类，要么全连上要么全不连，假设有 $k$ 个等价类，则有 $2^k$ 个图是不动点，即 $\left|X^g\right|=2^k$。

## 0x02 计算 $k$

寻找等价类的过程就是从某一条边 $u\leftrightarrow v$ 出发，然后寻把 $g_{u}\leftrightarrow g_{v}$ 这条边合并到一个等价类，然后 $g_{g_u}\leftrightarrow g_{g_v}$ 合并，相当于是 $u,v$ 每次分别走到 $g$ 变换的点去，然后重复过程，直到回到最初的点，自然想到把 $g$ 拆成若干个置换环。现在分类讨论 $u,v$ 所在置换环的情况：

1. $u,v$ 在同一个置换环中，设置换环长度为 $b$，显然 $u,v$ 同时走 $b$ 步之后会回到最初的点，并且过程中 $u,v$ 在置换环上的间距保持不变，那么在每一个等价类对应一个间距，故共有 $\left\lfloor\frac{b}{2}\right\rfloor$ 个等价类。
2. $u,v$ 不在同一个置换环中，设置换环长度分别为 $b_1,b_2$ 和刚才一样，每次 $u,v$ 都分别走到 $g$ 变换的点去，要走 $\text{lcm}(b_1,b_2)$ 才能回到最初出发的边，也就是等价类里面一共有 $\text{lcm}(b_1,b_2)$ 条边。而两个置换环之间一共能连出 $b_1b_2$ 条边，所以一共有 $\frac{b_1b_2}{\text{lcm}(b_1,b_2)}=\gcd(b_1,b_2)$ 个等价类。

设当有 $m$ 个置换环，置换环长度分别为 $b_i$，根据上面的推论有：

$$
k=\sum_{i=1}^m\left\lfloor\frac{b_i}{2}\right\rfloor+\sum_{i=1}^m\sum_{j=1}^{i-1}\gcd(b_i,b_j)
$$

## 0x03 统计排列

直接枚举排列显然是不行的，但是发现若排列的置换环长度 $b$ 序列相同，贡献也是相同的，于是直接枚举 $b$，即 $n$ 的一个整数拆分。考虑计算有多少个排列的置换环长度是 $b$，先考虑把 $n$ 个数划分到每一个置换环里面，再考虑置换环内部排列方式。随便放有 $n!$ 个排列，但是每一个置换环内部的排列先不计算，所以要除去 $b_i!$，但是长度相同的置换环交换还是同样的情况，所以也要出去，设长度为 $i$ 的置换环有 $c_i$ 个，就是要除 $c_i!$，所以划分方案一共是：

$$
\frac{n!}{\prod (b_i!)\prod (c_i!)}
$$

现在考虑置换环内部的排列情况，显然就是圆排列，有 $(b_i-1)!$ 个，最终就是：

$$
\frac{n!\prod (b_i-1)!}{\prod (b_i!)\prod (c_i!)}=\frac{n!}{\prod b_i\prod (c_i!)}
$$

把前面提到的式子整理一下：

$$
\begin{aligned}
\left|X/G\right|&=\frac{1}{\left|G\right|}\sum_b \frac{n!2^k}{\prod b_i\prod (c_i!)}\\
&=\frac{1}{n!}\sum_b \frac{n!2^k}{\prod b_i\prod (c_i!)}\\
&=\sum_b \frac{2^k}{\prod b_i\prod (c_i!)}\\

k&=\sum_{i=1}^m\left\lfloor\frac{b_i}{2}\right\rfloor+\sum_{i=1}^m\sum_{j=1}^{i-1}\gcd(b_i,b_j)
\end{aligned}
$$

## 0x04 扩展问题

这道题中每一个图相当于是对边染色了，出现的染白，没出现的染黑，不妨多搞几个颜色。$n$ 个点的无向完全图，有 $m$ 中颜色，可以给边随意染色，问可以染出多少个本质不同的图。要解决这个问题我们回到计算 $\left|X^g\right|$ 一步，最后的统计 $2^k$ 就是再说染黑还是染白，自然有 $m$ 种颜色就是 $m^k$。

$$
\begin{aligned}
\left|X/G\right|&=\sum_b \frac{m^k}{\prod b_i\prod (c_i!)}\\

k&=\sum_{i=1}^m\left\lfloor\frac{b_i}{2}\right\rfloor+\sum_{i=1}^m\sum_{j=1}^{i-1}\gcd(b_i,b_j)
\end{aligned}
$$

于是就得到了 P4128 一题做法。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

#define INV_DATA_TYPE long long
INV_DATA_TYPE exgcd(INV_DATA_TYPE a,INV_DATA_TYPE b,INV_DATA_TYPE &x,INV_DATA_TYPE &y){
    if(!b){
        x=1;
        y=0;
        return a;
    }
    INV_DATA_TYPE d=exgcd(b,a%b,y,x);
    y-=a/b*x;
    return d;
}

INV_DATA_TYPE inv(INV_DATA_TYPE n,INV_DATA_TYPE p){
    INV_DATA_TYPE x,y;
    exgcd(n,p,x,y);
    x%=p;
    return x>=0?x:x+p;
}

long long mod,modp;
int b[70],gcd[70][70],m,p;
long long fact[1000],pwm[100000],res;

void calc(int K){
    register int i,j,k=0,cnt=0;
    register long long v=1;
    b[K]=-1;
    for(i=0;i<K;++i){
        k+=b[i]>>1;
        (v*=b[i])%=mod;

        ++cnt;
        if(b[i]!=b[i+1]){
            (v*=fact[cnt])%=mod;
            cnt=0;
        }

        for(j=0;j<i;++j)
            k+=gcd[b[i]][b[j]];
    }
    (res+=inv(v,mod)*pwm[k])%=mod;
}

void dfs(int st,int rst){
    if(!rst){
        calc(st);
        return;
    }
    for(;b[st]<=rst;++b[st]){
        b[st+1]=b[st];
        dfs(st+1,rst-b[st]);
    }
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j;
    int n=read();
    m=read();
    modp=(mod=read())-1;
    for(i=0;i<=n;++i)
        for(j=0;j<=n;++j)
            if(i==0||j==0)
                gcd[i][j]=i|j;
            else{
                if(i>=j) gcd[i][j]=gcd[i-j][j];
                else gcd[i][j]=gcd[i][j-i];
            }

    for(fact[0]=i=1;i<=n;++i) fact[i]=fact[i-1]*i%mod;
    for(pwm[0]=i=1;i<=n*n;++i) pwm[i]=pwm[i-1]*m%mod;

    b[0]=1;
    dfs(0,n);

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```