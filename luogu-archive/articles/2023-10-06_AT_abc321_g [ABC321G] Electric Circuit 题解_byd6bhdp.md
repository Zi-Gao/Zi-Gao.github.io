## 前言

没怎么写过概率、期望的题，做不了一点。并且感觉其他题解写的有点简略了，有点看不懂，结合自己的理解记录一下。

## 正文

### 0x00 题目分析

简述一下题意：给定一个 $2m+n$ 个点的无向图，其中有 $m$ 个红色点、$m$ 个蓝色点、$n$ 个黑色点，每个红或蓝点连接了一个黑色点，现在你要连接 $m$ 条边，使得每个红点连接了一个蓝点，并且每个蓝点连接了一个红点。相当于是一个排列，求随机连出来这个图期望联通分量个数。

发现这个题每一个黑点连接哪些蓝点和红点是不重要的，只需要关注每一个黑点连接了几个蓝点和红点就可以了，那么后续的讨论本质是对黑点的讨论，并且黑点的数量十分少。不妨记 $R_i$ 表示 $i$ 这个黑点连接的红点数量；$B_i$ 表示 $i$ 这个黑点连接的蓝点数量。

### 0x01 拆分贡献

发现这个题是求期望，那么要想到期望的性，当然比较重要的就是期望的线性性，也正是这个题的入手点。相当于是把一个整体计算性的问题，拆分成了一个一个小的局部问题计算贡献，而把大问题转化为小问题，往往就是突破题目的关键。

具体来说就是先把分母算完，分母很多时候更好就算，对于拆分出来的一个小局部问题，对分母的贡献就是，这个局部的答案乘上包含这个局部的情况数量，最后除一下总的情况数量就是分母，就可以了。

不妨先考虑每一个黑点子集 $S$ 能否恰好构成一个独立的连通分量，也就是 $S$ 中的点不会向外部连边并且 $S$ 连通，这样就可以只关注这一个连通分量了。满发现这个事情的必要条件的是：

$$\sum_{i\in S}R_i=\sum_{i\in S}B_i$$

记整数是 $d_S$，显然这个东西不是充分条件，因为这个子集内部还可能分成两个联通分量，这样并不好统计贡献，但是这个东西至少保证了 $S$ 不与外部连边。

### 0x02 算方案数

先看看这个子集可能形成恰好一个联通分量的方案数有多少，记这个值是 $dp_s$，也就是子集内部的方案数，不考虑外面，显然最多有 $d_S!$，但是这个只是上界，考虑把多的方案减出去。尝试枚举每一个 $S$ 的子集 $T$，若 $T$ 恰好形成一个单独的联通分量时对 $d_s!$ 的贡献有多少，这个值是：

$$dp_T\times(d_T-d_S)!$$

可以理解为，$T$ 自己形成一个联通分量的方案数，这时不管外边怎么连边它 $S$ 都至少有两个联通分量。但是这个式子还是会算重，具体来说就是 $S$ 形成多个连通分量时，其中每个连通分量都会被计算一次，这肯定是不想看到的，钦定这个 $T$ 时多个连通分量的最后一个连通分量，有一个好的方式就是钦定 $T$ 包含 $S$ 中编号最小的那个点，这样显然不会重复计算了，并也不会算少，因为 $T'$ 只要不包含 $S$ 的最小编号的那个点，这个 $T'$ 成为一个连通分量时的答案已经在 $T$ 包含 $S$ 的最小编号的那个点的 $T$ 时计算了。当然不一定时最小编号的那个点，其他都可以只是这样比较方便。最后得出一个式子：

$dp_T=d_S!-\sum_{T\in S,Smin\in T} dp_T\times(d_T-d_S)!$

### 0x03 算贡献

算了方案数还没算贡献呢，其实这里和算 $dp_T$ 的思路很像，最终 $S$ 对分母的贡献就是：

$$dp_S\times d_S!$$

但是这里不会算重，因为算的时期望的贡献，对于每个联通分量他就会贡献 $1$ 的答案。最终答案就是：

$$\frac{\sum_S dp_S\times d_S!}{m!}$$

### 0x04 代码实现

写起来很简单，跑得也很快，时间复杂度 $\mathcal{O}\left(m3^m\right)$ 。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

#define INV_DATA_TYPE long long
INV_DATA_TYPE exgcd(INV_DATA_TYPE a,INV_DATA_TYPE b,INV_DATA_TYPE&x,INV_DATA_TYPE&y){if(!b){x=1;y=0;return a;}INV_DATA_TYPE d=exgcd(b,a%b,y,x);y-=a/b*x;return d;}INV_DATA_TYPE inv(INV_DATA_TYPE n,INV_DATA_TYPE p){INV_DATA_TYPE x,y;exgcd(n,p,x,y);x%=p;return x>=0?x:x+p;}

const long long mod=998244353;
int rsiz[1<<17],bsiz[1<<17],rdeg[17],bdeg[17];
long long fact[100010],dp[1<<17];

int lowbit(int x){return x&-x;}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,s,maxs,subs;
    register long long res=0;
    int n=read();
    int m=read();
    fact[0]=1;
    for(i=1;i<=m;++i) fact[i]=fact[i-1]*i%mod;
    for(i=0;i<m;++i) ++rdeg[read()-1];
    for(i=0;i<m;++i) ++bdeg[read()-1];
    maxs=1<<n;
    for(s=1;s<maxs;++s){
        for(i=0;i<n;++i)
            if((s>>i)&1)
                rsiz[s]+=rdeg[i],
                bsiz[s]+=bdeg[i];
        if(rsiz[s]!=bsiz[s]) continue;
        dp[s]=fact[rsiz[s]];
        for(subs=s&(s-1);subs;subs=(subs-1)&s){
            if(lowbit(subs)!=lowbit(s)||rsiz[subs]!=bsiz[subs]) continue;
            (dp[s]+=mod-dp[subs]*fact[rsiz[s]-rsiz[subs]]%mod)%=mod;
        }
        (res+=dp[s]*fact[m-rsiz[s]])%=mod;
    }

    print(res*inv(fact[m],mod)%mod);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

抓住概率和期望的性质，对问题进行拆分贡献，可以尝试选择用总的方案数减去不合法方案数，这样的结构对问题进一次拆分简化问题。