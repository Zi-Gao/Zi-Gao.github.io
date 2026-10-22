## 前言

没人写题解，研究了好久，来总结一下。正巧还没做过这种套路。

## 正文

### 0x00 题目分析

转化一下题目变成，给定了 $N,x$ 两个正整数，定义一个函数 $F\left(a,b,S\right)$，有：

$$F\left(a,b,S\right)=\sum_{i=0}^{k-1}S_i\times\left(a^{i}-b^{i}\right)$$

其中 $a,b$ 是两个正整数，满足 $a,b\le N,a\gt b$；$S$ 是一个下标 $0$ 起、元素个数为 $k$ 的数组，满足 $S_{k-1}\not=0$ 且 $0\leq S_{i}\lt\min\left(a,b,10\right)$。现在求对于 $a,b,S$ 使得 $F\left(a,b,S\right)=x$。

发现这玩意很像是一个特殊进制的数，不妨把 $i=0,1,\cdots,k-1$ 依次看做这个数的低位到高位，有一下性质符合和一个进制很像：

1. 随着 $S$ 的长度增长，$F$ 函数增长是指数级别的，即当 $S$ 的长度为 $k$ 时，$F\left(a,b,S\right)$ 函数是 $\mathcal{O}\left(a^k\right)$ 的。

2. 对于任意满足题目条件的 $S$，若 $x\gt0$，有 $F\left(a,b,S\right)\lt x\times\left(a^{k}-b^{k}\right)$。就像是进制填数一样，高位填的数一定是决定性的，后面永远追不上，证明显然拆开 $\left(a^{i}-b^{i}\right)$ 这一坨即可。

### 0x01 开始解题

根据第一条性质可得，对于任意会成为答案的 $k$，其级别是 $\mathcal{O}\left(\log x\right)$；根据第二条性质得，对于每一对确定的 $a,b,k$ 若存在解，只有唯一的 $S$ 能满足要求。

不妨考虑暴力枚举 $a,k$ 两个数，然后确定一个 $b$。那么对于一个 $b$，有一个基本的要求是 $a^{k-1}-b^{k-1}\leq x$ 不然最高位只能填 $0$，但是不能有前导 $0$，理性分析一下这个要求 $b^{k-1}\geq a^{k-1}-x$ 则，$b$ 下界是 $\mathcal{O}\left(a-\Delta\right)$ 的，而且 $\Delta$ 上界是 $\mathcal{O}\left(x^{\frac{1}{k-1}}\right)$，并且 $b\le a$ 反正这玩意小得很就对了，$b$ 取值范围大小肯定不超过根号。

这里枚举一下满足这些条件的 $a,b,k$ 就可以了最多枚举 $\mathcal{O}\left(n\sqrt{x}\right)$。接下来就是随便像是填一个其他进制的数一样把 $x$ 填进去，看能不能填下就可以了。

### 0x02 完了吗？

注意对于 $k=2$ 情况要特殊处理，由于 $i=0$ 时 $a^{i}-b^{i}$ 是 $0$，那么可以乱填；当 $i=1$ 时算出 $\left(a-b\right)\times S=x$ 的方案数即可。

其他情况，同样由于 $i=0$ 时 $a^{i}-b^{i}$ 是 $0$ 所以可以乱填，贡献答案有个系数注意计算。

最终时间复杂度 $\mathcal{O}\left(n\sqrt{x}\log^2 x\right)$，很多时候跑不满，常数很小。

### 0x03 代码实现

注意所谓乱填 $S_0$ 也不是乱填，要满足那几条条件。

AC CODE

``` cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

long long pw[200010][23];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,k;
    register long long a,b,S;
    const long long mod=998244353;
    register long long res=0,tmp,now;
    long long n=read();
    long long x=read();

    //k=2
    for(S=1;S<=std::min(x,9ll);++S)
        if(!(x%S)){
            for(a=S+1+(x/S);a<=n;++a){//b<10
                b=a-x/S;
                if(b>=10) break;
                (res+=b)%=mod;
            }
            if(n-(x/S)>=10) (res+=10*(n-((x/S)+10)+1))%=mod;//b>=10   a in [x/S+10,n] , b in [10,...]
        }

    //otherwise
    for(a=1;a<=x;++a) pw[a][2]=a;
    for(k=3;k<=22;++k){
        for(a=1;a<=std::min(x-1,n);++a){
            tmp=1;
            for(i=1;i<k&&tmp<=(1e13);++i) tmp*=a;
            if(tmp>(1e13)) break;
            pw[a][k]=tmp;//pw[a][k] = a^(k-1) , f = pw[a][k]*S1+pw[a][k-1]*S2 ...
            for(b=a-1;b;--b){
                //check
                if(pw[a][k]-pw[b][k]>x) break;
                now=x;
                for(i=k;i>1;--i)//S{k-i+1} = now mod pw[a][i]-pw[b][i]
                    if(now/(pw[a][i]-pw[b][i])>=std::min(10ll,b)) goto loop;
                    else now%=pw[a][i]-pw[b][i];
                if(now) goto loop;
                (res+=std::min(10ll,b))%=mod;
                loop:;
            }
        }
    }

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

抓住题目中这个东西“进制”这样的性质解题，熟悉套路。

p.s. 本文可能有笔误，看不懂得可以问我。