## 题意

两人轮流操作一个长度为 $n$ 的由字母表中前 $k$ 个字符组成的字符串。每次将字符串重新排列或删去一个字符，并不能和之前的字符串相同。不能操作者失败。

问有多少种字符串可以使得先手必胜，对质数 $p$ 取模。

$n \leqslant 250000,k \leqslant 26$

## 题解

假设给定一个字符串，考虑判断情况，假设当前每个字符出现了 $a_i$ 次，并且记重排方式有 $b$ 种，可以得到：

$$
b=\frac{n!}{\prod_{i=1}^ka_i!}
$$

若 $b$ 为偶数先手必胜，证明：

1. 若有一种一开始就删除的方案，自然会这样干。
2. 否则，先手重排一下，那么后手不可能去删除而取得获胜，这样与第一种情况矛盾。那么两人会一直重排，到最后后手不能就重排了。

那 $b$ 不是偶数怎么办呢？显然这个时候先手只能一开始就删除，假如删除的字符是 $i$，则 $b$ 会变成 $\frac{ba_i}{n}$，所以我们考虑找到最小的 $\text{lowbit}(a_i)$，假如是 $a_j$，由于 $a_i$ 的和等于 $n$，所以 $\text{lowbit}(a_j)\leq\text{lowbit}(n)$。考虑把 $b,a_j,n$ 分解质因数，发现若把 $a_j$ 删掉，$b$ 中二的因子只会减少，即还是奇数。那么局面没有变化两个人一直删数，所以当前 $n$ 是奇数时先手必胜。

总结一下：

1. $n$ 是奇数时，不管 $b$ 奇偶性，永远先手必胜。
2. 否则，$b$ 是偶数时先手必胜。

那么重点在于判断 $b$ 的奇偶性，所以不妨把计算 $b$ 放在模二意义下进行。

$$
b\equiv\frac{n!}{\prod_{i=1}^ka_i!} \pmod 2
$$

这样的式子并不好观察，换一种计算方式，设 $b_i$ 表示用 $i$ 种字符当前的重排数量。

$$
b_i\equiv {\sum_{i=1}^i a_i\choose a_i} b_{i-1} \pmod 2
$$

那么

$$
b_k\equiv {n\choose a_k} b_{k-1} \pmod 2
$$

根据卢卡斯定理 ${n\choose a_k} \bmod 2 = 1$ 当且仅当 $a_k$ 是 $n$ 的二进制子集，所以 $n-a_k$ 同样也是 $n$ 的二进制子集。于是可以归纳 $a_{k-1}$ 也是 $n$ 的二进制子集。最后得出 $a_i$ 都要是 $n$ 的二进制子集。

那么怎么计数呢？先把 $a_i$ 都要是 $n$ 的二进制子集，并且 $\sum_{i=1}^k a_i=n$ 转化成：把 $a_i$ 全部或起来等于 $n$，并且 $\text{popcount}(a_i)$ 的和等于 $\text{popcount}(n)$，于是可以 FWT 做。

时间复杂度是 $\mathcal{O}\left(n\log k \log^2 n\right)$ 感觉过不了是吧，但是官方题解就是这个复杂度。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

const int barK=64;
struct Barrett_Mod{
	unsigned long long d;__uint128_t m;
    void init(long long mod){
        m=(((__uint128_t)1)<<barK)/(d=mod);
        return;
    }

    inline __attribute((always_inline)) unsigned long long operator ()(register unsigned long long x){
        register unsigned long long w=(m*x)>>barK;
        w=x-w*d;
        return w>=d?w-d:w;
    }
}MOD;

long long mod;

void FWT_OR(long long *f,long long x,int n){
    register int i,j,k,o;
    for(o=2,k=1;o<=n;o<<=1,k<<=1)
        for(i=0;i<n;i+=o)
            for(j=0;j<k;++j)
                f[i+j+k]=MOD(f[i+j+k]+f[i+j]*x);
    return;
}

#define PC_DATA_TYPE long long

const PC_DATA_TYPE PC_DATA_SIZE=1000010;

PC_DATA_TYPE inv[PC_DATA_SIZE],fact[PC_DATA_SIZE],invfact[PC_DATA_SIZE];

void init_pc(int n){
    register int i;
    for(inv[0]=0,inv[1]=fact[0]=fact[1]=invfact[0]=invfact[1]=1,i=2;i<=n;++i)
        invfact[i]=invfact[i-1]*(inv[i]=mod-mod/i*inv[mod%i]%mod)%mod,fact[i]=fact[i-1]*i%mod;
    return;
}


#define QPOW_DATA_TYPE long long
QPOW_DATA_TYPE qpow(register QPOW_DATA_TYPE base,register QPOW_DATA_TYPE e){
    register QPOW_DATA_TYPE res=1;
    while(e){
        if(e&1) res=MOD(res*base);
        base=MOD(base*base);
        e>>=1;
    }
    return res;
}

long long f[19][300000],g[19][300000];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,k,len,e,cnt;
    register long long res;
    int n=read();
    int K=read();
    mod=read();

    MOD.init(mod);

    res=qpow(K,n);

    if(!(n&1)){
        cnt=__builtin_popcount(n);
        len=1<<std::__lg(n);
        if(len<=n) len<<=1;
        init_pc(len);

        for(i=0;i<len;++i) f[__builtin_popcount(i)][i]=invfact[i],g[0][i]=1;
        for(i=0;i<=cnt;++i) FWT_OR(f[i],1,len);

        e=K;
        while(e){
            if(e&1)
                for(j=cnt;~j;--j) for(k=0;k<j;++k) for(i=0;i<len;++i)
                    g[j][i]=MOD(g[j][i]+g[k][i]*f[j-k][i]);

            for(j=cnt;~j;--j) for(k=0;k<j;++k) for(i=0;i<len;++i)
                f[j][i]=MOD(f[j][i]+f[k][i]*f[j-k][i]);

            e>>=1;
        }

        FWT_OR(g[cnt],mod-1,len);
        (res+=mod-g[cnt][n]*fact[n]%mod)%=mod;
    }

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```