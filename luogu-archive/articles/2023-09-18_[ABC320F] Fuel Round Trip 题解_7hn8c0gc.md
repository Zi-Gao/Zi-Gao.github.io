## 前言

纪念一下第一次做出 AT 评分 2000 的题，还有名字水色。

## 正文

### 0x00 题目分析

题意很简单就是要在从 $0$ 位置走到 $X_N$ 位置，然后倒回来回到 $0$ 位置。并且每走一格需要 $1$ 的油，油箱最多携带 $H$ 的油，途中有一些**只能使用一次的**加油站，选择加油只能强制花费 $P_i$ 元加入 $F_i$ 的油，装不下只能抛弃。现在问你从 $0$ 开始有 $H$ 的油，走一个来回最小要多少钱。

可以发现这个题有两个难点：

1. 需要返回 $0$ 点，那么意味着来去选择的加油站会互相影响。

2. 由于第一点引出了第二点加油站只能使用一次，那么很难设计一个 DP 状态，第一反应只是状压。

但是同时可以发现 $H,N$ 都极小，默认为同阶，考虑近 $\mathcal{O}\left(N^3\right)$ 的算法。

对于这样的题可以先考虑去掉一些限制条件加上观察性质，找到一个大致的思路。

### 0x01 弱化版问题

假如不考虑需要返回 $0$ 这样的条件，只考虑走到 $X_N$，我们考虑设计 DP 状态，可以设计为 $dp_{i,j}$ 表示走到 $i$ 这个点，剩了 $j$ 的油需要的最小花费，这个 DP 设计显然是容易转移的，在每个加油站考虑加还是不加，这样一个状态只会转移到 $\mathcal{O}\left(1\right)$ 个状态，时间复杂度 $\mathcal{O}\left(n^2\right)$。观察时间复杂度都知道由于减少了限制条件，我们并没有发挥出这个算法的最大价值，而且考虑把这个算法修改为完全限制条件下的算法，可以利用的空间还有 $\mathcal{O}\left(n\right)$ 可以霍霍。

这里需要动一下脑筋，读者可以先想一下。

### 0x02 重新强化回去

观察到若只是需要走到 $X_N$ 那么状态就是从 $1$ 到 $i$ 的最小花费。那么这里有返回就不妨定义为从 $i$ 到 $N$ 然后返回 $i$ 的最小花费，这里发现状态定义不完全，无法确定返回 $i$ 时的油，直接大力升维即可。最终 DP 状态定义为 $dp_{i,j,k}$ 表示从 $i$ 到 $N$ 然后返回 $i$ 的最小花费，并且第一次来到 $i$ 的时候有 $j$ 的油，返回 $i$ 的时候有 $k$ 的油。考虑倒序转移，分 $3$ 个转移方式：

1. 第 $i$ 个加油站来时和返回时都不加油。

2. 第 $i$ 个加油站来时加油。

3. 第 $i$ 个加油站返回时加油。

转移方程显然。

### 0x03 代码实现

考虑刷表法，考虑 $dp_{i+1,j,k}$ 可以转移到那去，倒着 DP 即可。需要特别注意的是，可以选择性的抛弃一些油来达到更优的策略，那么做一个前缀 $\min$ 即可。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

long long p[310],f[310],x[310],dp[310][310][310];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,k;
    register long long dis,tmp;
    int n=read();
    long long h=read(),res=0x3f3f3f3f3f3f3f3fll;

    memset(dp,0x3f,sizeof(dp));
    for(i=1;i<=n;++i) x[i]=read();
    for(i=1;i<=n-1;++i) p[i]=read(),f[i]=read();
    for(i=0;i<=h;++i)
        dp[n][i][i]=0;

    for(i=n-1;~i;--i){
        for(j=0;j<=h;++j)
            for(k=0;k<=h;++k){
                dis=x[i+1]-x[i];
                if(j+dis>h) continue;
                if(k<dis) continue;
                tmp=dp[i+1][j][k];
                //case 0
                dp[i][j+dis][k-dis]=std::min(dp[i][j+dis][k-dis],tmp);
                //case 1
                dp[i][std::max(j+dis-f[i],0ll)][k-dis]=std::min(dp[i][j+dis-f[i]][k-dis],tmp+p[i]);
                //cass 2
                dp[i][j+dis][std::min(k-dis+f[i],h)]=std::min(dp[i][j+dis][std::min(k-dis+f[i],h)],tmp+p[i]);
            }
        for(j=1;j<=h;++j)
            for(k=h;k;--k)
                dp[i][j][k]=std::min({dp[i][j][k],dp[i][j-1][k+1],dp[i][j][k+1],dp[i][j-1][k]});
    }

    for(i=0;i<=h;++i)
        res=std::min(res,dp[0][h][i]);

    print(res==0x3f3f3f3f3f3f3f3fll?-1:res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

这样的题需要加深对 DP 的理解，不能死板的套用常规 DP 的方式，而要根据题目要求具体分析设计状态。并且需要具备对问题的拆解、组合能力，把大问题简化，找到大问题和小问题之间的关联，往往能提供一个正确的大方向。