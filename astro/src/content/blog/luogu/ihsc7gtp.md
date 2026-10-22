---
title: "CF113D Museum 题解"
slug: "ihsc7gtp"
description: "题意 给一个无向图，两个人从两个点出发，对于每个人，每个时刻若在 i 点，则有 pi 的概率留在这个点；否则随机等概率选出边到下一个点。若两人相遇则停止，问在每个点相遇概率 nleq 22 题解 根据…"
date: "2024-03-26T02:45:05.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/ihsc7gtp"
sourceCategory: "题解"
sourceSha256: "f40777768517e560d9ddef295b7d1d051f6d6347d7f141d86f7d7284444e6e4a"
---
## 题意

给一个无向图，两个人从两个点出发，对于每个人，每个时刻若在 $i$ 点，则有 $p_i$ 的概率留在这个点；否则随机等概率选出边到下一个点。若两人相遇则停止，问在每个点相遇概率

$n\leq 22$

## 题解

根据图上随机游走的套路，先设一个 dp 状态，然后消元求解。这道题是两个人游走，并且用概率作为状态并不号做，所以状态设两维 $dp_{i,j}$ 表示两人同时到 $dp_{i,j}$ 表示两人分别到达 $i,j$ 的期望次数，那么答案就是 $dp_{i,i}$，为什么期望变成了概率？因为到结束状态次数的随机变量只有可能是 $0$ 或者 $1$，这种情况期望就是概率。

转移非常简单，记相邻两个点 $u,v$ 某一个时刻从 $u$ 到 $v$ 的概率是 $P_{u,v}=\frac{1-p_u}{deg_u}$，分类讨论一下即可，假设当前在 $a,b$，并且 $x,y$ 是 $a,b$ 分别的相邻点：

1. 从 $x,y$ 转移，$x\not =y$，那么概率就是 $P_{x,a}P_{y,b}$。
2. 从 $x,v$ 转移，$x\not =v$，那么概率就是 $P_{x,a}p_v$。
3. 从 $u,y$ 转移，$u\not =y$，那么概率就是 $P_{y,b}p_u$。
4. 从 $u,v$ 转移，$u\not =v$，那么概率就是 $p_up_v$。

高斯消元求解即可，时间复杂度 $\mathcal{O}\left(n^6\right)$。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

std::vector<int> e[22];
std::vector<long double> mat[22*22];
long double p[22];
int deg[22],id[22][22];

void addEdge(int u,int v){
    e[u].push_back(v);
    e[v].push_back(u);
    ++deg[u],++deg[v];
    return;
}

#define GJ_TYPE long double
GJ_TYPE eps=1e-9;
/*
-1:infinite solutions
0: no solution
1: only one solution
*/
int GJSolve(std::vector<GJ_TYPE> *mat,int n){
    register int r,c,i,j,maxR;
    for(r=c=0;c<n;++c){
        maxR=r;
        for(i=r+1;i<n;++i) if(fabs(mat[i][c])>fabs(mat[maxR][c])) maxR=i;
        if(maxR!=r) mat[maxR].swap(mat[r]);

        if(fabs(mat[r][c])<eps) continue;

        for(i=n;i>=c;--i) mat[r][i]/=mat[r][c];
        for(i=0;i<n;++i)
            if(i!=r&&fabs(mat[i][c])>eps)
                for(j=n;j>=c;--j)
                    mat[i][j]-=mat[r][j]*mat[i][c];
        ++r;
    }
    if(r<n)
        for(i=r;i<n;++i)
            if(fabs(mat[i][n])>eps)
                return 0;

    return r<n?r-n:1;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,u,v,x,y,cnt=0,idu,idv;
    int n=read();
    int m=read();
    int a=read()-1;
    int b=read()-1;

    for(i=0;i<m;++i){
        u=read()-1;v=read()-1;
        addEdge(u,v);
    }

    for(i=0;i<n;++i) scanf("%Lf",p+i);

    for(u=0;u<n;++u)for(v=0;v<n;++v) id[u][v]=cnt++;

    for(u=0;u<n;++u)for(v=0;v<n;++v){
        idu=id[u][v];
        mat[idu].resize(cnt+2);

        mat[idu][idu]-=1;
        if(u!=v) mat[idu][idu]+=p[u]*p[v];
        for(auto x:e[u])
            for(auto y:e[v]){
                if(x==y) continue;
                idv=id[x][y];
                mat[idu][idv]+=(1-p[x])/deg[x]*(1-p[y])/deg[y];
            }
        for(auto x:e[u]){
            if(x==v) continue;
            idv=id[x][v];
            mat[idu][idv]+=(1-p[x])/deg[x]*p[v];
        }
        for(auto y:e[v]){
            if(u==y) continue;
            idv=id[u][y];
            mat[idu][idv]+=(1-p[y])/deg[y]*p[u];
        }
    }

    mat[id[a][b]][cnt]=-1;

    GJSolve(mat,cnt);

    for(i=0;i<n;++i) printf("%.10Lf ",mat[id[i][i]][cnt]);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```