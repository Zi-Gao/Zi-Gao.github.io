---
title: "P7913 [CSP-S 2021] 廊桥分配 题解"
slug: "6gzoj7qi"
description: "前言 喵喵题+1 正文 0x00 题目分析 发现题目难点在于需要分出两个不同的区域，而且有数量限制固定，十分恼火。那么考虑简化问题变成：只有一类飞机飞来，靠在廊桥的机位有 k 个，求出靠在廊桥的飞机数…"
date: "2023-09-19T04:12:03.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/6gzoj7qi"
sourceCategory: "个人记录"
sourceSha256: "25a0b4e674fd540bc5a35e472d0b70fabf6c643d7ae27b6656f85ce317f5a249"
---
## 前言

喵喵题+1

## 正文

### 0x00 题目分析

发现题目难点在于需要分出两个不同的区域，而且有数量限制固定，十分恼火。那么考虑简化问题变成：只有一类飞机飞来，靠在廊桥的机位有 $k$ 个，求出靠在廊桥的飞机数量。

发现这类问题有个通解：对于机位从小到大标号，前面 $k$ 个靠在廊桥，其他在远机位。来一个飞机贪心地尽量分编号小的机位。实际上发现这个过程与 $k$ 无关。那么记录每个编号的机位飞机停靠的次数，打出一个前缀和，这样即可快速求出有 $k$ 个靠在廊桥的机位时，停在靠在廊桥的飞机数量。

接下来很简单，对于两种飞机都这样跑一次，拼起来即可。

### 0x01 代码实现

前缀和要多打一些，不能只达到 $m_1$ 要打到 $n$ 。

```AC CODE
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

struct EVENT{
    int t,pos;

    bool operator < (const EVENT &another) const{
        return t<another.t;
    }

    bool operator > (const EVENT &another) const{
        return t>another.t;
    }
};

struct PL{
    int a,b;

    bool operator < (const PL &another) const{
        return a<another.a;
    }

    bool operator > (const PL &another) const{
        return a>another.a;
    }
}a[100010],b[100010];

int resa[100010],resb[100010],all;

void calc(int n,PL *pls,int *res){
    std::priority_queue<EVENT,std::vector<EVENT>,std::greater<EVENT>> Qe;
    std::priority_queue<int,std::vector<int>,std::greater<int>> Qp;
    register int i;
    std::sort(pls,pls+n);
    for(i=1;i<=n;++i) Qp.push(i);
    for(i=0;i<n;++i){
        while(!Qe.empty()&&Qe.top().t<pls[i].a) Qp.push(Qe.top().pos),Qe.pop();
        ++res[Qp.top()],Qe.push((EVENT){pls[i].b,Qp.top()}),Qp.pop();
    }
    for(i=1;i<=all;++i) res[i]+=res[i-1];
    return;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,res=-1;
    int n=read();
    all=n;
    int m1=read();
    int m2=read();
    for(i=0;i<m1;++i){
        a[i].a=read();
        a[i].b=read();
    }

    for(i=0;i<m2;++i){
        b[i].a=read();
        b[i].b=read();
    }

    calc(m1,a,resa);
    calc(m2,b,resb);
    for(i=0;i<=n;++i) res=std::max(res,resa[i]+resb[n-i]);

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```