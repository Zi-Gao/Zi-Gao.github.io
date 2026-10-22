---
title: "P3590 [POI 2015 R2] 三座塔 Three towers 题解"
slug: "4ljr6vfk"
description: "感觉区间两个端点都很不靠边的时候很不优，打个表看看是否有满足 l,r 合法，并且 l,r 周围都有还有 3 个没选的字符，并且没有比 l,r 更大的合法区间： 只输出了 0 0 1 也就是单字符，不会…"
date: "2025-12-11T12:29:04.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/4ljr6vfk"
sourceCategory: "题解"
sourceSha256: "813db58003b47f007f97a96497a433c4680f3899a8c5f72cebd0db9e0319d14d"
---
感觉区间两个端点都很不靠边的时候很不优，打个表看看是否有满足 $l,r$ 合法，并且 $l,r$ 周围都有还有 $3$ 个没选的字符，并且没有比 $l,r$ 更大的合法区间：

```
#include<bits/stdc++.h>

char s[10];

const int lim=3;

char dfs(std::array<int,3> c,int st){
    if(st==lim*2){
        char res=0;
        auto calc=[&](){
            res|=((!c[0])+(!c[1])+(!c[2])==2||(c[0]!=c[1]&&c[0]!=c[2]&&c[1]!=c[2]));
        };
        auto cp=c;
        for(int i=0;i<=lim;++i){
            auto cp=c;
            for(int j=0;j<=lim;++j){
                if(i||j) calc();
                ++c[s[j+lim]];
            }
            c=cp;
            ++c[s[i]];
        }
        c=cp;
        return !res;
    }
    char res=0;
    for(s[st]=0;s[st]<3;++s[st]) res|=dfs(c,st+1);
    return res;
}

int main(){
    int i,j,k;
    for(i=0;i<=10;++i) for(j=!!i;j<=10;++j) for(k=!!(i+j);k<=10;++k) if(dfs({i,i+j,i+j+k},0)) printf("%d %d %d\n",i,i+j,i+j+k);
    return 0;
}
```

只输出了 `0 0 1` 也就是单字符，不会影响。

扫描满足 $l\in[1,3]\lor r\in[n-2,n]$ 的 $\mathcal{O}(n)$ 个区间，就过了。