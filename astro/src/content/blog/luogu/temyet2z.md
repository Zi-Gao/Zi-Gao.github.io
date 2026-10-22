---
title: "P5493 质数前缀统计 题解"
slug: "temyet2z"
description: "前言 借此篇题解记录一下 Min25 筛中的预处理所有 Sleft(leftlfloor frac{n}{i}rightrfloorright) 方法。 记号与约定 在本文中若无特殊说明，记号均采用以…"
date: "2024-03-03T13:06:59.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/small-tools.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/temyet2z"
sourceCategory: "题解"
sourceSha256: "79c652dd78e0754056c26e5c1e79a63c1e48ec6345ef0c27db29044b1e97140c"
---
## 前言

借此篇题解记录一下 Min\_25 筛中的预处理所有 $S\left(\left\lfloor \frac{n}{i}\right\rfloor\right)$ 方法。

## 记号与约定

在本文中若无特殊说明，记号均采用以下定义：

- $\frac{a}{b}=\left\lfloor\frac{a}{b}\right\rfloor$。

- $p$ 表示一个质数。

- $p_i$ 表示第 $i$ 个质数，令 $p_0=1$。

- $\text{lpf}\left(n\right)$ 表示 $n$ 的最小质因子。

- $\text{isPri}\left(n\right)$ 表示 $n$ 是否是质数。

- 题面中的 $k$ 在本文中记作 $e$。同时 $k$ 失去原有定义。

## 正文

考虑直接求得 $S\left( \frac{n}{i}\right)$ 并不好求，于是我们考虑设计一种递推的方法，从全体小于 $n$ 的自然数开始，依次去掉最小质因子为 $p_i$ 的合数，这样做的好处非常明显，因为对于一个合数 $a$ 有 $\text{lpf}^2\left(a\right)\leq a$，所以我们令 $x$ 为最大的 $p_x^2\leq n$，那么 $g\left(n,x\right)=S\left(n\right)$，意思是只需要递推到 $x$ 即可，并且 $x$ 并不大可以粗略看作 $\mathcal{O}\left(\sqrt{n}\right)$ 的。定义 $g\left(n,k\right)$：

$$
g\left(n,k\right)=\sum_{i=1}^n \left[\text{isPri}\left(i\right)\lor\text{lpf}\left(i\right)\gt p_k\right] i^e
$$

自然有边界 $g\left(n,0\right)=\sum_{i=1}^n i^e$ 为了预处理这个边界可以参考 CF622F 一题，可以在 $\mathcal{O}\left(e\right)$ 内处理出单点值。

现在考虑从 $g\left(n,k-1\right)$ 递推到 $g\left(n,k\right)$，考虑这个过程中哪些数被踢了出去，自然是最小质因子为 $p_k$ 的合数，把 $p_k$ 提出来可以得到：$p_k^eg\left(\frac{n}{p_k},k-1\right)$ 但是这样把小于 $g\left(\frac{n}{p_k},k-1\right)$ 中小于 $p_k$ 质数会成为更小的质因子，所以是 $g\left(\frac{n}{p_k},k-1\right)-g\left(p_{k-1},k-1\right)$，最终递推式子：

$$
g\left(n,k\right)=g\left(n,k-1\right)-p_k^e\left(g\left(\frac{n}{p_k},k-1\right)-g\left(p_{k-1},k-1\right)\right)
$$

虽然 $k$ 只有 $\mathcal{O}\left(\sqrt{n}\right)$，但是第一维似乎还是很大？别急理性分析一波，第一维的形式一定类似于 $n$ 一直连除一些数向下取整的形式，由于有：

$$
\left\lfloor\frac{\left\lfloor\frac{n}{b}\right\rfloor}{b}\right\rfloor=\left\lfloor\frac{n}{ab}\right\rfloor
$$

所以，第一维只可能是 $\left\lfloor\frac{n}{i}\right\rfloor$ 中的取值，很经典地，我们知道这个东西取值只有 $\mathcal{O}\left(\sqrt{n}\right)$ 个，但是这两个上界都很不紧，继续通过一些列分析可以得到最终递推复杂度是 $\mathcal{O}\left(\frac{n^{0.75}}{\log n}\right)$ 的，具体过程可以参考 [OI Wiki 上的证明](https://oi-wiki.org/math/number-theory/min-25/#%E5%A4%8D%E6%9D%82%E5%BA%A6%E5%88%86%E6%9E%90)。

## 代码

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE long long
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

long long mod;
int K;

long long qpow(register long long base,register long long e){
    register long long res=1;
    base%=mod;
    while(e){
        if(e&1) res=(res*base)%(mod);
        base=(base*base)%(mod);
        e>>=1;
    }
    return res;
}

#define INV_DATA_TYPE long long
INV_DATA_TYPE exgcd(INV_DATA_TYPE a,INV_DATA_TYPE b,INV_DATA_TYPE &x,INV_DATA_TYPE &y){
    if(!b){
        x=1;
        y=0;
        return a;
    }
    INV_DATA_TYPE d=exgcd(b,a%b,y,x);
    y-=a/b*x;
    return d;
}

INV_DATA_TYPE inv(INV_DATA_TYPE n,INV_DATA_TYPE p){
    n%=p;
    INV_DATA_TYPE x,y;
    exgcd(n,p,x,y);
    x%=p;
    return x>=0?x:x+p;
}

long long pl[20],pr[20],fac[20],y[20],b[20];

long long S_all(long long n){
    register int i;
    register long long ans=0,a;
    pl[0]=pr[K+3]=1;
    for(i=1;i<=K+2;i++) pl[i]=pl[i-1]*(n%mod-i)%mod;
    for(i=K+2;i>=1;i--) pr[i]=pr[i+1]*(n%mod-i)%mod;
    
    for(i=1;i<=K+2;i++){
        a=pl[i-1]*pr[i+1]%mod;
        (ans+=y[i]*a%mod*b[i]%mod)%=mod;
    }
    return (ans+mod)%mod;
}

long long sp[1000010],n;
long long g[1000010],val[1000010];

int sqrtN,cntId,idx_s[1000010],idx_b[1000010];

std::bitset<1000010> isPrime;
long long prime[1000010];
int cntPri;

void Euler(int n){
    register long long i,j;
    for(i=2;i<=n;++i){
        if(!isPrime[i]){
            prime[++cntPri]=i;
            sp[cntPri]=(sp[cntPri-1]+qpow(i,K))%mod;
        }
        for(j=1;j<=cntPri&&prime[j]*i<=n;++j){
            isPrime[prime[j]*i]=1;
            if(!(i%prime[j])) break;
        }
    }
}

int getIdx(long long a){
    if(a<=sqrtN) return idx_s[a];
    else return idx_b[n/a];
}

void initG(){
    register long long i,nxt,tmp;
    register int id;
    for(i=1;i<=n;i=nxt+1){
        nxt=n/(n/i);
        val[++cntId]=n/i;

        g[cntId]=(S_all(val[cntId])+mod-1)%mod;

        if(n/i<=sqrtN) idx_s[n/i]=cntId;
        else idx_b[n/(n/i)]=cntId;
    }

    for(register int i=1,j;i<=cntPri;++i){
        tmp=qpow(prime[i],K);
        for(j=1;j<=cntId&&prime[i]*prime[i]<=val[j];++j){
            id=getIdx(val[j]/prime[i]);
            (g[j]+=mod-tmp*(g[id]+mod-sp[i-1])%mod)%=mod;
        }
    }
    return;
}

long long inv6;

long long s2(long long n){
    n%=mod;
    return n*(n+1)%mod*(n*2+1)%mod*inv6%mod;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register long long res=0,i,nxt;
    sqrtN=std::sqrt(n=read());
    K=read();
    mod=read();

    for(i=fac[0]=1;i<=K+2;i++) fac[i]=fac[i-1]*i%mod,y[i]=(y[i-1]+qpow(i,K))%mod;
    for(i=1;i<=K+2;i++) b[i]=inv(fac[i-1]*((K-i)&1?mod-1:1)%mod*fac[K+2-i],mod)%mod;
    
    inv6=inv(6,mod);

    Euler(sqrtN);
    initG();

    for(i=1;i<=sqrtN;i=nxt+1){
        nxt=std::min(n/(n/i),(long long)sqrtN);
        (res+=(s2(nxt)+mod-s2(i-1))*g[getIdx(n/i)])%=mod;
    }

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```