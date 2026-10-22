---
title: "CW集训0717题解"
slug: "knbzx35b"
description: "T1 LOJ 6039. 「雅礼集训 2017 Day5」珠宝 首先可知本题是一个背包问题，正常情况下是 NP 的。但是任然有依赖值域的做法 mathcal{O}left(nWright) 这样的时间…"
date: "2023-07-18T13:57:57.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/knbzx35b"
sourceCategory: "个人记录"
sourceSha256: "4a219c83119859ee8d38d68a9ab02895ce99798d5a569500e1c86b653ecb713d"
---
# T1 [LOJ #6039. 「雅礼集训 2017 Day5」珠宝](https://loj.ac/p/6039)

首先可知本题是一个背包问题，正常情况下是 NP 的。但是任然有依赖值域的做法 $\mathcal{O}\left(nW\right)$ 这样的时间复杂度称之为 [Weakly polynomial time 弱多项式时间](https://oi.wiki/misc/cc-basic/#weakly-polynomial-time-%E5%BC%B1%E5%A4%9A%E9%A1%B9%E5%BC%8F%E6%97%B6%E9%97%B4) 。接下来观察到此题 $c$ 值域很小，考虑在 $c$ 上做文章，如果我们可以找到一个去除了 $W$ 因子，带有 $c$ 因子的时间复杂度算法，或许可解决问题。

由于 $n$ 巨大与 $c$ 差了几个数量级，那么可以考虑进行用 $c$ 分组，转化为分组背包。定义 DP 状态 $dp_{i,j}$ 表示考虑到了费用为 $c$ 的背包时花费 $j$ 的费用可以获得的最大价值。列出转移方程 $dp_{i,j}=\max{dp_{i-1,j-ik}+w_{i,k}}$ 其中 $k$ 表示在费用为 $i$ 这一层背包中取了 $k$ 个，而 $w_{i,k}$ 表示排序后取这一层前 $k$ 大的物品可以获得的价值。

观察发现 $j \bmod i= j-ik \bmod i$ 于是考虑对每一个同余为 $x$ 的一系列 DP 状态进行转移，每次转移一个系列。设 $g_b$ 表示同余为 $x$ 的 DP 状态的第 $b$ 个状态的上一层的值然后用这个东一转移出新的设其为 $f_i$ 表示第 $i$ 个状态的值，最后放回 DP 数组。发现这玩意决策单调性，读者可以自证，分治转移即可。

AC CODE

```cpp
#include<cstdio>
#include<vector>
#include<algorithm>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE long long
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

std::vector<long long> w[310];

long long dp[50010],g[50010],f[50010];

void solve(int l,int r,int s,int t,int noww){
    if(l>r) return;
    register int i,pos;
    int mid=(l+r)>>1;
    pos=mid;
    f[mid]=g[mid];
    for(i=s;i<=t&&i<mid;++i){
        if(mid-i>w[noww].size()) continue;
        if(g[i]+w[noww][mid-i-1]>f[mid]) f[mid]=g[i]+w[noww][mid-i-1],pos=i;
    }
    if(l==r) return;
    solve(l,mid-1,s,pos,noww);
    solve(mid+1,r,pos,t,noww);
    return;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,c,maxc=-1,j,cnt,k,l;
    register long long v;
    int n=read();
    int m=read();
    for(i=1;i<=n;++i){
        c=read();
        maxc=std::max(c,maxc);
        v=read();
        w[c].push_back(v);
    }
    for(i=maxc;i;--i){
        if(w[i].empty()) continue;
        std::sort(w[i].begin(),w[i].end(),[](int a,int b){return a>b;});//lambda体重载排序规则进行排序
        for(v=1;v<w[i].size();++v) w[i][v]+=w[i][v-1];//前缀和
        for(j=cnt=0;j<i;++j,cnt=0){//枚举同余结果 j
            for(k=j;k<=m;k+=i) g[++cnt]=dp[k];//放进去上一层DP结果进行滚动数组
            solve(1,cnt,1,cnt,i);//分治
            for(k=1,l=j;l<=m;++k,l+=i) dp[l]=f[k];//放回去
        }
        for(j=1;j<=m;++j) dp[j]=std::max(dp[j-1],dp[j]);//处理一下，同余的时候是分开搞得，要和在一起
    }

    for(i=1;i<=m;++i){
        print(dp[i]);putchar(' ');
    }

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```