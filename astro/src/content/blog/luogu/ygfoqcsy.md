---
title: "P14311 【MX-S8-T4】平衡三元组 题解"
slug: "ygfoqcsy"
description: "出题人题解，欢迎观看视频题解，打不开的把链接 首先转化条件为 2Byleq Bx+Bz。 那么就是在区间 l,r 内找三个下标 lleq x<y<zleq r,2Ayleq Ax+Az，最大化 Ax+…"
date: "2025-10-26T23:38:58.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/ygfoqcsy"
sourceCategory: "题解"
sourceSha256: "07e174e1cb9ec5eba3c2b35dc2d499ab33a492b5ff4aa3d9eb27960f9b271ff6"
---
出题人题解，[欢迎观看视频题解](https://www.bilibili.com/video/BV1hhsfzYEdc/)，打不开的把链接`https://www.bilibili.com/video/BV1hhsfzYEdc/`复制下来打开。





首先转化条件为 $2B_y\leq B_x+B_z$。

那么就是在区间 $l,r$ 内找三个下标 $l\leq x<y<z\leq r,2A_y\leq A_x+A_z$，最大化 $A_x+A_y+A_z$。

**提示1**：考虑固定 $y$ 的时候，$x,z$ 的取值。

这个时候 $x$ 肯定取到 $[l,y)$ 的最大值，同理 $z$ 取到 $(y,r]$ 的最大值。

于是可以快速得到一个 $\mathcal{O}(nq)$ 的做法，对于区间做前缀和后缀最大值，枚举 $y$ 的位置即可。


继续优化，观察 $x,y,z$ 还有什么性质。

**观察到**：由于 $x,z$ 覆盖了整个左右区间，那么 $x,z$ 中一定有一个是区间最大值。

根据这点，我们钦定 $a$ 是区间最大值，作为 $x$，接下来考虑 $y$ 放在什么地方，$z$ 是 $(y,r]$ 的最大值。

于是自然的想到一个特殊的 $z$，为 $(a,r]$ 的最大值，记为 $a_0$。那么 $\forall y\in(a,a_0)$ 都有 $y\leq A_{a_0}\leq A_{a}$，于是 $(a,y,a_0)$ 合法，可以贡献答案。

分析一下，到这个时候我们已经考虑了 $y\in (a,a_0)$ 的所有情况，接下来考虑 $y=a_0$ 的情况，记 $a_1$ 为 $(a_0,r]$ 的最大值，如果 $(a,a_0,a_1)$ 合法则可以贡献答案。

这个时候已经考虑 $y\in (a,a_0]$ 的所有情况。如果 $(a,a_0,a_1)$ 合法，对于 $\forall y\in(a_0,r],A_y\leq A_{a_0}$ 以及 $\forall z\in(a_0,r],A_z\leq A_{a_1}$，可以得到不会有更好的 $(a,x,y)$ 了。


如果  $(a,a_0,a_1)$ 不合法怎么办？只有继续考虑 $y\in(a_0,r]$ 的情况。

延续刚才的想法，我们先钦定 $z=a_1$，那么 $\forall y\in(a_0,a_1)$  都有 $(a,y,a_1)$ 合法，并且可以找到 $a_2$ 是 $(a_1,r]$ 的最大值，尝试贡献 $(a,a_1,a_2)$。

可以立刻意识到我们进入了一个和刚才相似的递归子结构，到这里我们处理了 $y\in (a,a_1]$ 的所有情况。

**提示2**：尝试分析是否会继续递归吗？最多递归多少层？


直接分析 $2A_{a_0}> A_a+A_{a_1}$ 那么 $A_{a_1}<2A_{a_0}-A_a$。

接下来 $2A_{a_1}>A_a+A_{a_2}$，那么 $A_{a_2}<2A_{a_1}-A_a<4A_{a_0}-3A_a$。

归纳一下 $A_i< 2^iA_{a_0}-(2^i-1)A_a=A_a-2^i(A_a-A_{a_0})$。

所以如果 $A_a\not=A_{a_0}$，只会递归 $\mathcal{O}(\log V)$ 次。如果 $A_a=A_{a_0}$ 则从 $a_1$ 开始归纳也一样，如果 $A_a=A_{a_0}=A_{a_1}$ 那么 $(a,a_0,a_1)$ 就已经合法了。

总结一下只需要求区间最大值和其位置，修改只有区间加法，线段树即可解决。时间复杂度 $\mathcal{O}(q\log V\log n)$，这里认为 $qX$ 和 $V$ 同阶。

```cpp
#include<bits/stdc++.h>

#define NOBUG
// #define ONLINE_JUDGE
#define il inline __attribute((always_inline)) 

#ifdef NOBUG
#define dbg(...) fprintf (stderr, __VA_ARGS__)
#else
#define dbg(...) void()
#endif

using u32=unsigned int;
using i64=long long;
using u64=unsigned long long;

const i64 INF=0x3f3f3f3f3f3f3f3fll;

#define lc (p<<1)
#define rc (lc|1)

i64 tag[1000010<<2];

struct NODE{
	i64 max;
	int pos;
	NODE operator + (const NODE &o) const{
		i64 mx=std::max(max,o.max);
		int p=0;
		if(max==mx) p=pos;
		if(o.max==mx) p=o.pos;
		return {mx,p};
	}
}tree[1000010<<2];

void down(int p,i64 x){
	tree[p].max+=x;
	tag[p]+=x;
}

void pushdown(int p){
	down(lc,tag[p]),down(rc,tag[p]);
	tag[p]=0;
}
void pushup(int p){
	tree[p]=tree[lc]+tree[rc];
}

void read(int p,int l,int r){
	if(l==r){
		tree[p]={0,l};
		scanf("%lld",&tree[p].max);
		return;
	}
	int mid=(l+r)>>1;
	read(lc,l,mid),read(rc,mid+1,r);
	pushup(p);
}

void modify(int p,int l,int r,int s,int t,int x){
	if(s<=l&&r<=t) return down(p,x);
	int mid=(l+r)>>1;
	pushdown(p);
	if(s<=mid) modify(lc,l,mid,s,t,x);
	if(mid<t) modify(rc,mid+1,r,s,t,x);
	pushup(p);
}

NODE qry(int p,int l,int r,int s,int t){
	if(s<=l&&r<=t) return tree[p];
	int mid=(l+r)>>1;
    pushdown(p);
	NODE res={-INF,0};
	if(s<=mid) res=res+qry(lc,l,mid,s,t);
	if(mid<t) res=res+qry(rc,mid+1,r,s,t);
	return res;
}

int n;

NODE qry(int l,int r,char rev){
	if(rev){
		l=n-l+1,r=n-r+1;
		std::swap(l,r);
	}
	if(l>r) return {-INF,0};
    NODE res=qry(1,1,n,l,r);
    if(rev) res.pos=n-res.pos+1;
	return res;
}

int cnt=0;

i64 calc(int l,int r,char rev){
	NODE n1=qry(l,r,rev),n2,n3;
	i64 res=-INF;
	n2=n1,n3=qry(n1.pos+1,r,rev);
	while(n3.pos){
		++cnt;
		res=std::max(res,n1.max+qry(n2.pos+1,n3.pos-1,rev).max+n3.max);
		n2=n3;
		n3=qry(n2.pos+1,r,rev);
		if(n2.max*2<=n1.max+n3.max){
			res=std::max(res,n1.max+n2.max+n3.max);
			break;
		}
	}
    return res;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("d_6_4.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

	int o,l,r,x,q;
	scanf("%d%d",&n,&q);
	read(1,1,n);
	while(q--){
		scanf("%d%d%d",&o,&l,&r);
		if(o==1){
			i64 res=std::max(calc(l,r,0),calc(n-r+1,n-l+1,1));
            if(res<=-INF/2) puts("No");
            else printf("%lld\n",res);
		}else{
			scanf("%d",&x);
			modify(1,1,n,l,r,x);
		}
	}

    return 0;
}
```