---
title: "P7077 [CSP-S2020] 函数调用 题解"
slug: "4suqcdu9"
description: "前言 感觉挺妙喵喵的，写个题解总结一下。 正文 0x00 题目分析 看见这个题可以发现主要难点在于：加法操作和乘法操作混杂进行。那么这种情况混杂的难题一般想先分解这个题，变成几个简单的小部分。根据这个…"
date: "2023-09-19T04:00:55.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/4suqcdu9"
sourceCategory: "个人记录"
sourceSha256: "9a860f8f0d17142576d5b0b70ac08a2d1aaf0505d872705ae0a749a52197a404"
---
## 前言

感觉挺妙~~喵喵~~的，写个题解总结一下。

## 正文

### 0x00 题目分析

看见这个题可以发现主要难点在于：加法操作和乘法操作混杂进行。那么这种情况混杂的难题一般想先分解这个题，变成几个简单的小部分。根据这个思路对题目进行一个拆的解：

1. 若没有全局乘法操作，显然根据调用关系建立一个 DAG 图，然后用建立超级原点的方式依次调用函数，最后跑一个拓扑排序，算出每个函数调用几次即可。

2. 若没有点单加法操作，同样可以跑一个拓扑排序计算出每个函数调用次数，然后乘上去即可。

观察这两个简化问题，能这样做的原因都是因为这些操作具有交换、结合律。但是这两种操作之间并不具有这样良好的性质，所以无法这样做。

### 0x01 最终答案

既然找到了问题所在那么我们就像尽量满足原有顺序进行调用。但是若顺寻考虑，无法确定这个操作最终究竟会对答案有多少的贡献，显然不可做。这里读者可以自行思考一下怎么做。

答案是，顺序不行就倒序考虑，这里的倒序并不是真正的倒序执行操作，而是倒序计算操作对答案的贡献，观察发现一个很好的性质，若一个加法函数操作执行完之后乘上了 $k$ ，那么相当于这个函数加的值要乘上 $k$ 的系数。不妨考虑先预处理出执行每个函数会全局乘上多少，然后执行拓扑排序，而执行拓扑排序时，对于每个点 $u$ 的出边倒序枚举，这样即可算出往当前出边执行时，前面会有多少的系数，然后系数一层层下推到最终的函数。这样一层层的递推系数即可保证系数计算不重不漏。

需要注意的是还是要建立超级原点，按照调运顺序加边，可能有重边，但是并不是错误，而是正确的调用。

### 0x02 代码实现

注意最终计算答案先要把全局乘法操作执行完，然后就没有乘法的影响了，已经把乘法转化为了加法系数，直接加上去系数乘加法值即可。

预处理每个函数会全局乘上多少，不需要拓扑排序，跑个 DFS 记搜即可。

AC CODE
```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE long long
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

std::queue<int> Q;
std::vector<int> e[1000010];
std::bitset<1000010> vis;
int d[1000010];
long long mul[1000010],times[1000010],add[1000010],pos[1000010],dat[1000010];
const long long mod=998244353;

void addEdge(int u,int v){
    return (void)e[u].push_back(v);
}

void getMul(int u){
    if(vis[u]) return;
    vis[u]=1;
    for(auto v:e[u])
        getMul(v),(mul[u]*=mul[v])%=mod,++d[v];
    return;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,k,tp,u,v;
    register long long nowmul;
    int n=read();
    for(i=1;i<=n;++i) dat[i]=read();

    int m=read();

    mul[0]=times[0]=1;
    for(i=1;i<=m;++i){
        tp=read();
        mul[i]=1;
        if(tp==1){
            pos[i]=read();
            add[i]=read();
        }else if(tp==2) mul[i]=read();
        else{
            k=read();
            u=i;
            while(k--){
                v=read();
                addEdge(u,v);
            }
        }
    }

    int q=read();
    for(i=0;i<q;++i) addEdge(0,read());

    getMul(0);

    Q.push(0);
    while(!Q.empty()){
        u=Q.front(),Q.pop();
        nowmul=1;
        std::reverse(e[u].begin(),e[u].end());
        for(auto v:e[u]){
            if(!(--d[v])) Q.push(v);
            (times[v]+=times[u]*nowmul)%=mod;
            (nowmul*=mul[v])%=mod;
        }
    }

    for(i=1;i<=n;++i) (dat[i]*=mul[0])%=mod;
    for(i=0;i<=m;++i) (dat[pos[i]]+=times[i]*add[i]%mod)%=mod;

    for(i=1;i<=n;++i) print(dat[i]),putchar(' ');

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}

## 总结

把混杂问题转换为小问题，观察小问题之间的关系，找到性质，最终融合
```