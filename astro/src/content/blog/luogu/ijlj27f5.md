---
title: "P9978 [USACO23DEC] Cycle Correspondence S 题解"
slug: "ijlj27f5"
description: "题意： 给定一个有且仅有一个 k 元环 n 个点的无向图，然后给这个图每个点标了两次号，分别是 ai,bi 保证 ai,bi 各自形成一个排列。然后依次按照某个顺序（顺时针或者逆时针）给出了这个环上没…"
date: "2023-12-25T02:07:56.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/ijlj27f5"
sourceCategory: "题解"
sourceSha256: "3c522dca3a1b7969e3cd69ec812bae96c542b3f1b9b0fd0f57001aca420eb8c1"
---
> 题意：
>
> 给定一个有且仅有一个 $k$ 元环 $n$ 个点的无向图，然后给这个图每个点标了两次号，分别是 $a_i,b_i$ 保证 $a_i,b_i$ 各自形成一个排列。然后依次按照某个顺序（顺时针或者逆时针）给出了这个环上没个点的两个编号，两次给出的标号顺序起点终点方向都可能不同，但是相邻两个给出点的一定在图上也相邻，问最多有多少个两次编号是同一个。
>
> $n,k\leq 2\cdot 10^5$

从暴力出发，考虑固定第一个编号，然后枚举第二个编号的起点和方向，可以得到一个 $\mathcal{O}\left(n^2\right)$ 的做法。然后就可以考虑先固定第二个编号的方向，只考虑起点，会发现对于每个 $b_i$ 只会在唯一一个起点处贡献 $1$ 的重复，直接计算出来求个和就好了。注意不在环上的点编号还是可能是重复的，再算一下就好了。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

char used[500010];
int pos[500010],a[500010],b[500010],cnt[500010];

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,res=0;
    int n=read();
    int k=read();

    memset(pos,-1,sizeof(pos));

    for(i=0;i<k;++i){
        pos[a[i]=read()]=i;
        ++used[a[i]];
    }

    for(i=0;i<k;++i){
        b[i]=read();
        ++used[b[i]];
        if(~pos[b[i]])
            ++cnt[(i-pos[b[i]]+k)%k];
    }

    for(i=0;i<k;++i)
        res=std::max(res,cnt[i]),cnt[i]=0;

    for(i=0;i<k;++i){
        if(~pos[b[i]])
            ++cnt[((k-i-1)-pos[b[i]]+k)%k];
    }

    for(i=0;i<k;++i)
        res=std::max(res,cnt[i]),cnt[i]=0;

    for(i=1;i<=n;++i)
        if(!used[i])
            ++res;

    print(res);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```
