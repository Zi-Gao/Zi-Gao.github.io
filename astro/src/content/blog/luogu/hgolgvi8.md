---
title: "CF273E Dima and Game 题解"
slug: "hgolgvi8"
description: "大家都是打表做的，但是没人说怎么打表。 首先肯定是要算出 sg 值的，然后发现 sg 值只和 r-l 有关，令 x=r-l 则两种操作分别是把 x 变成 lfloorfrac{x}{3}rfloor,…"
date: "2024-03-26T12:11:11.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/hgolgvi8"
sourceCategory: "题解"
sourceSha256: "001623eae1dd4782bb0decfd23e8e4e18e10c1766fd06a2310569200fa749ef4"
---
大家都是打表做的，但是没人说怎么打表。

首先肯定是要算出 sg 值的，然后发现 $sg$ 值只和 $r-l$ 有关，令 $x=r-l$ 则两种操作分别是把 $x$ 变成 $\lfloor\frac{x}{3}\rfloor,x-\lfloor\frac{x}{3}\rfloor$，先随便打个表，猜测最终 sg 是一段一段的，并且段数很少。于是换个打表方式记 $pos_i$ 表示第 $i$ 段结束位置，$sg_i$ 表示第 $i$ 段的 sg 值。由于对于一个 $x$ 会有一段取值的 $y$ 使得 $\lfloor\frac{y}{3}\rfloor=x$ 同样有一段取值的 $y$ 使得 $y-\lfloor\frac{y}{3}\rfloor=x$。那么用两个 $u,v$ 表示当前考虑一段 $x$ 的取值使 $\lfloor\frac{x}{3}\rfloor=pos_u,x-\lfloor\frac{x}{3}\rfloor=pos_v$，算出最大的 $x$ 满足条件，并作为新的一段 sg 值加入数组，然后挪动成为上界指针即可。同样也可以以此证明，sg 值段数只有 $\mathcal{O}\left(\log V\right)$ 级别。

剩下的随便 dp 一下就可以了。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

const long long mod=1000000007;

int pos[1000],sg[1000];
long long cntSg[4],f[1010][4],p;

long long getSum(long long l,long long r){
    l=p-l,r=p-r;
    return (l+r)*(l-r+1)/2%mod;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,k,cnt=0,u=1,v=1,n;
    register long long uMax,vMax;
    n=read();p=read();

    pos[++cnt]=2;
    while(pos[cnt]<p){
        uMax=pos[u]*3+2;
        if(pos[v]&1) vMax=(pos[v]-1)/2*3+1;
        else vMax=pos[v]/2*3;
        for(i=0;i<2;++i)
            if(sg[u]!=i&&sg[v]!=i)
                break;
        if(i!=sg[cnt]) sg[++cnt]=i;
        pos[cnt]=std::min(uMax,vMax);
        if(uMax==pos[cnt]) ++u;
        if(vMax==pos[cnt]) ++v;
    }
    for(i=1;i<=cnt;++i)
        (cntSg[sg[i]]+=getSum(pos[i-1]+1,std::min(pos[i],(int)p)))%=mod;

    f[0][0]=1;
    for(i=1;i<=n;++i)
        for(j=0;j<4;++j)
            for(k=0;k<4;++k)
                (f[i][j^k]+=cntSg[j]*f[i-1][k])%=mod;

    print((f[n][1]+f[n][2]+f[n][3])%mod);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```