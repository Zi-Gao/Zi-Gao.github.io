---
title: "P9466 [EGOI2023] Bikes vs Cars / 骑车与汽车 题解"
slug: "7lulvdqy"
description: "前言 今天模拟赛 C 题题解啊，但是这个题确实惊艳到我了。 正文 0x00 题目分析 简化题面： 给定一个 nleq 500 个点的完全图，每条边有两个权值 B,C 满足 B+C=W，请你求出一个与其…"
date: "2023-11-13T14:46:12.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/7lulvdqy"
sourceCategory: "题解"
sourceSha256: "a996c6ce2456f522b1716ddd428e90640a13b6bd56ec0dab7777fbb673f1816c"
---
## 前言

今天模拟赛 C 题题解啊，但是这个题确实惊艳到我了。

## 正文

### 0x00 题目分析

> **简化题面：**
> 
> 给定一个 $n\leq 500$ 个点的完全图，每条边有两个权值 $B,C$ 满足 $B+C=W$，请你求出一个与其等价的图，使得其边数少于 $2023$。并且与原图等价，其中等价的定义为：
> 
> 1. 每两个点 $u,v$ 之前都可通过一条路径，这条路径上边权 $B$ 的最小值等于 $B_{u,v}$。且不存在一条路径使得路径上边权 $B$ 的最小值大于 $B_{u,v}$。
> 2. 同理定义 $C$ 权值。
> 3. 图联通
> 
> 可能无解。期望时间复杂度 $\mathcal{O}\left(n^3\right)$。

考虑只能用很少边，不如直接考虑能不呢用一个树给他们穿起来，而且时间复杂度很充裕。

### 0x01 解决问题

发现两个边权非常难搞啊，考虑简化版本的问题变成只有边权 $B$。此时发现一个图无解的充分必要条件显然是：存在一组互不相同的点 $u,v,k$ 使得 $B_{u,v}\lt\min\left(B_{u,k},B_{k,v}\right)$，那么有界的充分不要条件是对于任意互不相同的点 $u,v,k$ 都有 $B_{u,v}\geq\min\left(B_{u,k},B_{k,v}\right)$。

然后考虑找出一个可行方案，可以对这个原来的完全图跑一个最大生成树，会发现一个有意思的东西。若存在一对点 $u,v$，边 $\left(u,v,B_{u,v}\right)$ 其中 $w$ 是权值，是非树边，记 $Bmin_{u,v}$ 表示树上 $u$ 到 $v$ 路径上的边权最小值：

1. 首先根据上面的结论有 $B_{u,v}\geq Bmin_{u,v}$。
2. 由于这是最大生成树，那么这条边有 $B_{u,v}\leq Bmin_{u,v}$ 若不是则这条边会被加入最大生成树。

推出 $B_{u,v}= Bmin_{u,v}$，意思是我们根本就不用管非树边~~是不是很神奇！！！~~

现在考虑加上另一个边权 $C$，不妨考虑直接分开建立最大生成树，然后缝在一起。但是会发现个问题，会加入一些不能加入的边，可以发现这些满足不能加入的边满足一个性质就是 $B_{u,v}+C_{u,v}\lt W$ 显然不可能加入，总有一个会无法满足。考虑直接删除这些边，然后两个权值分开做，跑最大生成树，跑完进行一个类似 Floyd 的算法吧两两点的最大可以走到的权值跑出来，形式化的：$B_{u,v}=\max\left\{\min\left(B_{u,k},B_{k,v}\right),B_{u,v}\right\}$。然后去与原图比较即可，判断是否无解。思考一下这样为啥是对的？首先对于 $B_{u,v}+C_{u,v}\geq W$ 这样的边两个最大生成树中肯定不会互相干扰；其次对于 $B_{u,v}+C_{u,v}\lt W$ 这样的边也没有问题，因为若有问题的话就算换个生成树的方式仍然有问题，都不会存在问题。

### 0x02 代码实现

非常好写啊。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

const int UFDS_SIZE=510;
struct UFDS{
	int parents[UFDS_SIZE];

	void build(int n){
		for(register int i=1;i<=n;++i)
			parents[i]=i;
		return;
	}

	int find(int x){
		return x==parents[x]?x:(parents[x]=find(parents[x]));
	}

	int find_b(int x){
		while(parents[x]!=x)
			x=parents[x];
		return x;
	}

	void merge(int i,int j){
		parents[find(i)]=find(j);
		return;
	}

	void clear(){
		for(int i=1;i<UFDS_SIZE;i++)
			parents[i]=i;
		return;
	}
}UB,UC;

#define NOOOOOO \
{puts("NO");\
return 0;}

struct EDGE{
    int u,v,w;
    bool operator < (const EDGE o) const{
        return w>o.w;
    }
};

std::vector<EDGE> edges_b,edges_c,outE;

int B[510][510],C[510][510],Bnew[510][510],Cnew[510][510];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    memset(Bnew,~0x3f,sizeof(Bnew));
    memset(Cnew,~0x3f,sizeof(Cnew));

    register int i,j,k,u,v,W;

    int n=read();
    W=read();

    for(u=0;u<n;++u)
        for(v=0;v<u;++v)
            B[u][v]=B[v][u]=read();
    for(u=0;u<n;++u)
        for(v=0;v<u;++v)
            C[u][v]=C[v][u]=read();

    for(u=0;u<n;++u)
        for(v=0;v<u;++v)
            for(k=0;k<n;++k)
                if(k!=u&&k!=v&&(B[u][v]<std::min(B[u][k],B[k][v])||C[u][v]<std::min(C[u][k],C[k][v]))) NOOOOOO

    for(u=0;u<n;++u)
        for(v=0;v<u;++v)
            if(B[u][v]+C[u][v]>=W){
                edges_b.push_back((EDGE){u,v,B[u][v]});
                edges_c.push_back((EDGE){u,v,C[u][v]});
            }

    std::sort(edges_b.begin(),edges_b.end());
    std::sort(edges_c.begin(),edges_c.end());

    UB.build(n),UC.build(n);

    for(auto edge:edges_b)
        if(UB.find(edge.u)!=UB.find(edge.v))
            Bnew[edge.u][edge.v]=Bnew[edge.v][edge.u]=edge.w,
            outE.push_back((EDGE){edge.u,edge.v,W-edge.w}),
            UB.merge(edge.u,edge.v);

    for(auto edge:edges_c)
        if(UC.find(edge.u)!=UC.find(edge.v))
            Cnew[edge.u][edge.v]=Cnew[edge.v][edge.u]=edge.w,
            outE.push_back(edge),
            UC.merge(edge.u,edge.v);

    for(k=0;k<n;++k)
        for(u=0;u<n;++u)
            for(v=0;v<u;++v)
                if(k!=u&&k!=v)
                    Bnew[u][v]=Bnew[v][u]=std::max(Bnew[u][v],std::min(Bnew[u][k],Bnew[k][v])),
                    Cnew[u][v]=Cnew[v][u]=std::max(Cnew[u][v],std::min(Cnew[u][k],Cnew[k][v]));

    for(u=0;u<n;++u)
        for(v=0;v<u;++v)
            if(B[u][v]!=Bnew[u][v]||C[u][v]!=Cnew[u][v]||Bnew[u][v]<0||Cnew[u][v]<0) NOOOOOO

    print(outE.size()),putchar('\n');
    for(auto edge:outE) print(edge.u),putchar(' '),print(edge.v),putchar(' '),print(edge.w),putchar('\n');

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

非常有意思的题，重点在于大力观察出两个重要的不等式，啊啊啊太厉害了。
