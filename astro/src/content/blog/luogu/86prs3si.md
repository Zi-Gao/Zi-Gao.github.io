---
title: "P9977 [USACO23DEC] Bovine Acrobatics S 题解"
slug: "86prs3si"
description: "题意： 给你 n 种牛，每种牛有 ai 个，同种牛的重量都相同为 wi，现在牛要叠牛塔，每座牛塔都是由若干个牛叠成，并且要求相邻两头牛在上面和下面的重量分别为 a,b，要求满足 aleq b+k 其中…"
date: "2023-12-25T02:07:27.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/86prs3si"
sourceCategory: "题解"
sourceSha256: "f601fd529dd15e12d5b9ee165a8f2e581b7c5776c6dab6a91e01099b5564a508"
---
> 题意：
>
> 给你 $n$ 种牛，每种牛有 $a_i$ 个，同种牛的重量都相同为 $w_i$，现在牛要叠牛塔，每座牛塔都是由若干个牛叠成，并且要求相邻两头牛在上面和下面的重量分别为 $a,b$，要求满足 $a\leq b+k$ 其中 $k$ 是给定常数。现在要叠 $m$ 做牛塔，问最多由多少头牛参与叠塔。
>
> $n\leq 3\cdot 10^5$ 并且 $a_i,b_i\leq 10^9$

我猜你在想 `dp`，实际上这个题很像是一个 `dp` ，我一开始也这样想的，但是做不出来。放开思路，不妨考虑贪心，先按照牛种类的重量从大到小排序，依次考虑，并且维护当前有多少座牛塔可以往上叠设为 $m$，贪心地想现在 $v_i$ 头牛要尽可能的叠上去，那么肯定会选出 $\min\left(v_i,m\right)$ 头牛放在可以堆叠的塔顶上，然后 $m$ 减少 $\min\left(v_i,m\right)$。如何实现呢？先按照 $w_i$排序，然后双指针，一个指针 $i$ 指着当前考虑的牛种类，另一个指针 $j$ 指着比当前牛种类重量大 $k$ 的重量的牛种类，对于每个牛种类记录选中了多少个放在塔顶 $cho_i=\min\left(v_i,m\right)$，并且 $m$ 减去 $cho_i=\min\left(v_i,m\right)$。然后考虑挪动另一个指针，若能挪动说明这个种类的牛以成为的塔顶的 $cho_j$ 个塔，已经可以被现在的牛拿去继续叠了，所以 $m$ 加上 $cho_j$。

```cpp
#include<bits/stdc++.h>
#define int long long
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

struct COW{
    int w,v;
    bool operator < (const COW o) const{
        return (w==o.w)?(v<o.v):(w<o.w);
    }
}cows[500010];

int dp[500010];

signed main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,j,ans=0;
    int n=read();
    int m=read();
    int k=read();

    for(i=1;i<=n;++i){
        cows[i].w=read();
        cows[i].v=read();
    }

    std::sort(cows+1,cows+1+n);

    for(i=n,j=n+1;i;--i){
        while(cows[j-1].w-cows[i].w>=k) m+=dp[--j];
        ans+=(dp[i]=std::min(m,cows[i].v));
        m-=dp[i];
    }

    print(ans);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```
