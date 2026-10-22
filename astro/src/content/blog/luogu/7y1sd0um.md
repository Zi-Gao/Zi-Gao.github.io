---
title: "Baekjoon-8049 The Labyrinth of Wells 题解"
slug: "7y1sd0um"
description: "前言 这个题好冷门，不知道某某 OI 知名教练怎么找出来的。 正文 0x00 题目分析 题面有点绕(没某某 OI 知名教练，出的模拟赛改版题面绕)。但是分析一下就是，抽象为：一个 DAG 每个点有一个…"
date: "2023-08-03T12:22:11.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/7y1sd0um"
sourceCategory: "个人记录"
sourceSha256: "ac9aba69b72a10565070aa4b6048d54424ab89103c6523eb80641a7688f4e40a"
---
## 前言

这个题好冷门，不知道~~某某 OI 知名教练怎么找出来的~~。

## 正文

### 0x00 题目分析

题面有点绕(~~没某某 OI 知名教练，出的模拟赛改版题面绕~~)。但是分析一下就是，抽象为：一个 DAG 每个点有一个点权，每条边有一个边权，对于图上任意一条路径的边权和点权按照访问顺序链接成两个有序序列，这两个序列设其为这个路径的代表元，然后对于所有的路径生成的代表原形成一个集合 $S$ ，设其为这个图的代表集合。你需要构建出一个新的 DAG 使得它的代表集合和原图代表集合相等，并且点数最小化。

分析一下由于最终要到 $n$ 点，我们记录下每一个点开始生成的代表集合(就是不看前面的点)。若有两个点他们的代表集合相同则可以合并为一个点，具体就是这两个点的入弧全部连到新图的同一个点上，并且只有这样的点能够省去，不然新图的代表区间则不同。

那么用 hash (~~乱记一通~~)记录每个点为起点生成的代表集合的 hash 值即可。 

### 0x01 代码实现

先 DFS 预处理所有的 hash 值。注意 hash 由于是对有序序列进行 hash 那么 hash值要对顺序变化铭感，可以采用类似于字符串 hash 的技巧，用一个大质数作为进制，自然溢出之类的。

```cpp
#include<cstdio>
#include<vector>
#include<queue>
#include<map>
#include<bitset>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

std::map<unsigned long long,std::map<unsigned long long,unsigned long long> > mp;

int n;
unsigned long long hash1[500010],hash2[500010],mod1=100000000000000003,mod2=1000000000000000003;

std::queue<int> Q;
std::bitset<500010> book;

std::vector<int> e[500010];
char s[500010];
void addEdge(int u,int v){
    e[u].push_back(v);
    return;
}

void dfs(int u){
    register int v;
    if(hash1[u]||hash2[u]) return;
    hash1[u]=hash2[u]=mod1+mod2+1140514+10919810;

    for(v=0;v<e[u].size();++v){
        dfs(e[u][v]);
        hash1[u]=hash1[e[u][v]]*mod1*1145141919819000+s[u]*(v+mod2)+hash1[u]*114514;
        hash2[u]=hash2[e[u][v]]*mod2*114051410919819+(v+1)*(s[u]+mod1)+hash2[u]*1919810;
    }
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int u,v,res=0;
    register char c;
    n=read();

    for(u=1;u<n;++u){
        loop:c=getchar();
        if(c<'A'||'Z'<c) goto loop;
        s[u]=c;
        v=read();
        addEdge(u,v);
        v=read();
        addEdge(u,v);
        v=read();
        addEdge(u,v);
    }

    dfs(1);

    Q.push(1);

    while(!Q.empty()){
        u=Q.front();
        Q.pop();
        for(auto v:e[u])
            if(!book[v]){
                book[v]=1;
                if(!mp[hash1[v]][hash2[v]]) mp[hash1[v]][hash2[v]]=1,++res;
                Q.push(v);
            }
    }

    print(res+1);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```