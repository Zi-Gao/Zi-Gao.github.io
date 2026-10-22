---
title: "P9979 [USACO23DEC] Target Practice S 题解"
slug: "exhv8slp"
description: "题意： 给一个数轴，上面有 n 个目标分别在 posi 的位置，然后有一个人首先站在原点，会依次执行 m 个操作，每个操作可能是 1. 向左移动 1 单位。 2. 向右移动 1 单位。 3. 开火，若…"
date: "2023-12-25T02:08:43.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/exhv8slp"
sourceCategory: "题解"
sourceSha256: "7ff179a008e7752ced07400f22b0cc384d7de31dc6ece07b6e730b273fe673eb"
---
> 题意：
>
> 给一个数轴，上面有 $n$ 个目标分别在 $pos_i$ 的位置，然后有一个人首先站在原点，会依次执行 $m$ 个操作，每个操作可能是
>
> 1. 向左移动 $1$ 单位。
> 2. 向右移动 $1$ 单位。
> 3. 开火，若这个地方有目标，则目标被摧毁，不能摧毁已经摧毁的目标
>
> 但是现在要求把其中一个操作换成另一个不同的操作，问最多可以摧毁多少个目标。
>
> $n\leq 10^5,-m\leq pos_i\leq m$ 并且 $pos_i$ 互不相同

不妨先考虑去除一段前缀或者后缀操作最多摧毁多少个目标，显然可以维护一个桶 $buc_i$ 表示在 $buc_i$ 这个位置经过了多少次，若当前是第一次经过这个位置然后开火了，并且这里有个目标则会多摧毁一个目标。考虑枚举哪个位置的操作被修改，然后可以把问题转化为把前后两端操作的贡献合并起来，然后单独考虑这个位置的贡献，实际上可以使用 `bitset` 可以在 $\mathcal{O}\left(\frac{n}{w}\right)$ 的时间复杂的内对两个 `bitset` 求按位与、或、异或操作，以及对一个 `bitset` 求多少个位置值为 $1$。可以从后往前考虑，对于前缀每次减少一个操作出去并维护前缀经过位置的桶，以及可以打中的目标的 `bitset`，然后对于后缀，由于修改操作可能导致后缀位置发生集体偏移但是偏移绝对值不会超过 $2$ 维护同样一个桶和 $5$ 个 `bitset` 表示不同偏移量可以打中的目标，然后把前后缀对应两个桶求按位于，然后求多少个位置值为 $1$ 即可算出当前答案，时间复杂度 $\mathcal{O}\left(\frac{n^2}{w}\right)$。

这样做题有点对不起题目的意思，只是出题人不小心放过了这个算法。那就给出一个线性做法，还是仿照前面的过程，只不过动态维护前缀桶和 `bitset` 与每一个后缀 `bitset` 的并，以及每个 `bitset` 的并的答案，可以发现每次最多使桶内和每个 `bitset` 内一个值发生变化，只把这个变化领出来即可，那么答案变化也可以维护。

你说得对，但是我写的 $bitset$。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

char opers[500010];
int pos[500010],buc[500010],tar[500010];

std::bitset<100010> pre,suf[5],tmp;

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,j,B,ans;
    int T=read();
    int C=read();
    B=140000;

    for(i=1;i<=T;++i) tar[read()+B]=i;
    scanf("%s",opers+1);

    for(i=1,pos[0]=B;i<=C;++i)
        if(opers[i]=='L') pos[i]=pos[i-1]-1;
        else if(opers[i]=='R') pos[i]=pos[i-1]+1;
        else{
            ++buc[pos[i]=pos[i-1]];
            if(tar[pos[i]]) pre[tar[pos[i]]]=1;
        }

    ans=pre.count();

    for(i=C;i;--i){
        if(i>1&&opers[i]=='F'){
            --buc[pos[i]];
            if(buc[pos[i]]==0&&tar[pos[i]]!=0) pre[tar[pos[i]]]=0;
        }
        if(opers[i]=='L'){
            ans=std::max(ans,(int)((suf[4]|pre).count()));

            tmp=(suf[3]|pre);
            if(tar[pos[i-1]]!=0) tmp[tar[pos[i-1]]]=1;
            ans=std::max(ans,(int)(tmp.count()));
        }else if(opers[i]=='R'){
            ans=std::max(ans,(int)((suf[0]|pre).count()));

            tmp=(suf[1]|pre);
            if(tar[pos[i-1]]!=0) tmp[tar[pos[i-1]]]=1;
            ans=std::max(ans,(int)(tmp.count()));
        }else ans=std::max({ans,(int)((suf[1]|pre).count()),(int)((suf[3]|pre).count())});
        if(opers[i]=='F')
            for(j=-2;j<=2;j++)
                if(tar[pos[i]+j]!=0) suf[j+2][tar[pos[i]+j]]=1;
    }

    print(ans);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```
