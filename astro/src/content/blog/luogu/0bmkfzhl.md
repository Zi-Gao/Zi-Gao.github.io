---
title: "CF1208F Bits And Pieces 题解"
slug: "0bmkfzhl"
description: "前言 如果你还不会 SOSDP，其实也没关系，这道题可以使用更简单的方法完成。 正文 0x00 题目分析 首先肯定考虑从高位开始贪心，而且这样的贪心是显然正确的。并且这样的操作具有二进制集合性质，可以…"
date: "2023-08-22T23:43:47.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/0bmkfzhl"
sourceCategory: "题解"
sourceSha256: "090cadbf9cd54e54e7934c007ef7ebd5ddbc059db1438f8ba4b0a61c806661e5"
---
## 前言

如果你还不会 SOSDP，其实也没关系，这道题可以使用更简单的方法完成。

## 正文

### 0x00 题目分析

首先肯定考虑从高位开始贪心，而且这样的贪心是显然正确的。并且这样的操作具有二进制集合性质，可以从集合的元素进行考虑。那么我们从高位贪心就可以抽象为检查某个元素 $x$ 是否有两个被集合同时包含，若有则将 $x$ 元素纳入当前的答案。接下来考虑次高位 $y$ 元素，但是现在具有限制条件，必须还要同时包含了 $x$ 元素，若这样的集合有两个才行。

那么可以对每个集合把他的所有子集才出来，并且记录每一次子集出现了多少次。但是现在的时间复杂度达到了 $\mathcal{O}\left(2^{\log a}n\right)=\mathcal{O}\left(na\right)$，显然无法通过。考虑优化，我们只需要检查某个子集是否出现了 $2$ 次即可，那么当某个子集已经被标记了两次时，这个子集的子集都不需要再次访问了。可以使用一个递归实现每次减少一个元素。最终时间复杂度 $\mathcal{O}\left(2^{\log a}+n\log a\right)=\mathcal{O}\left(n\log a+a\right)$。

### 0x01 代码实现

AC CODE

```
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

int arr[2000010],vis[2000010],sum[2000010];

void addE(int val,int pos){
    if(sum[val]>1|vis[val]==pos) return;//优化
    ++sum[val],vis[val]=pos;
    register int i;
    for(i=std::__lg(val);~i;--i)
        addE((~(1<<i))&val,pos);
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,k,val,ans=0;

    int n=read();
    for(i=n-1;~i;--i) arr[i]=read();
    for(i=0;i<n;++i){
        val=arr[i];
        if(i>1){
            k=0;//k就是当前纳入考虑的元素集合
            for(j=20;~j;--j)//从高位贪心
                if(!(val&(1<<j))&&sum[k|(1<<j)]>1)
                    k|=(1<<j);
            ans=std::max(ans,val|k);
        }
        addE(val,i+1);
    }

    print(ans);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

这样二进制位运算求 max 通常可以从高位贪心，然后通过值域较小的特点计算即可。