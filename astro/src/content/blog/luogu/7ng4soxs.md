---
title: "P9982 [USACO23DEC] Haybale Distribution G 题解"
slug: "7ng4soxs"
description: "题意： 给定一条数轴上面有 n 个点，分别在 xi 的位置。定义数轴上两个点 x,y（这里是坐标，不是下标）之间运输成本 W{x,y} 为。 其中 a,b 为给定常数。现在有 q 次询问每次询问给定一…"
date: "2023-12-25T02:10:29.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/7ng4soxs"
sourceCategory: "题解"
sourceSha256: "998b6a2ca6979775861f98508b3809827e130f51076238f7f444c9278a908e7d"
---
> 题意：
>
> 给定一条数轴上面有 $n$ 个点，分别在 $x_i$ 的位置。定义数轴上两个点 $x,y$（这里是坐标，不是下标）之间运输成本 $W_{x,y}$ 为。
>
$$
W_{x,y}=
\begin{cases}
a\cdot\left(y-x\right), & x\leq y,\\
b\cdot\left(x-y\right), & x\gt y
\end{cases}
$$
>
> 其中 $a,b$ 为给定常数。现在有 $q$ 次询问每次询问给定一组 $a,b$ 询问互相独立，你要求一个点 $y$（也是坐标，不一定是给定的点上）最小化 $\sum_{i=1}^{n} W_{y,x_i}$。
>
> $n\leq 2\cdot 10^5,1\leq a,b \leq 10^6$

固定一组 $a,b$ 时，定义函数 $f\left(y\right)=\sum_{i=1}^{n} W_{y,x_i}$ 发现这个函数具有单峰性，具体来说两边大，中间小，所以可以三分解决。

关于三分的正确性，若三分有平台，即函数连续相同段，有些时候不能三分解决，但是若平台只出现在峰的顶端可以三分解决，其他地方若也有平台则无法三分解决。这道题的函数的平台只会在峰顶出现。

不太会三分，写的二分（别喷

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

long long a,b,presum[1000100],cnt[1000100];
long long check(int pos){
    return (cnt[pos]*pos-presum[pos])*a+(presum[1000100-1]-presum[pos]-(cnt[1000100-1]-cnt[pos])*pos)*b;
}

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,l,r,mid,x,q;
    register long long res;
    int n=read();

    for(i=1;i<=n;++i){
        x=read()+20;
        presum[x]+=x,cnt[x]+=1;
    }

    for(i=1;i<1000100;++i) presum[i]+=presum[i-1],cnt[i]+=cnt[i-1];

    q=read();
    while(q--){
        a=read();b=read();
        l=15,r=1000030;
        while(l+2<r){
            mid=(l+r)>>1;
            if(check(mid)>check(mid+1))
                l=mid+1;
            else r=mid;
        }
        for(res=0x3f3f3f3f3f3f3f3fll,i=l-5;i<=l+5;++i) res=std::min(res,check(i));
        print(res),putchar('\n');
    }

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```
