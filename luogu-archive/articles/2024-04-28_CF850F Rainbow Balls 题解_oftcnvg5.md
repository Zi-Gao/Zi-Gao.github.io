## 题意

有一袋 $n$ 个颜色球，第 $i$ 个颜色的球有 $a_i$ 个。

当袋子里至少有两个不同颜色的球时，执行以下步骤：

1. 一个接一个的按照顺序随机取出两个的球，这些球的颜色可能是一样的。
2. 把第二个球涂成第一个球的颜色，然后把两个球放回袋子里。

求期望操作次数。

$n\le 2500,1\le a_i \le 10^5$

## 题解

考虑计算最后颜色全是 $x$ 的情况，设 $f_i$ 表示已经有 $i$ 个 $x$ 颜色，把这所有都变成 $x$ 还需要的期望次数。先计算一下选出两个求，一个是 $x$，另一个不是的概率设为 $p$，并且记 $s$ 表示球总数：

$$
p=\frac{i(s-i)}{s(s-1)}
$$

然后列出转移方程，先考虑边界，$f_s=0$，$f_0$ 不存在，因为永远走不到。按照正常的套路是：

$$
f_i=pf_{i-1}+pf_{i+1}+(1-2p)f_i+1
$$

即表示走出去这一步，但是发现这样干会错，应为走出去这一步不一定就能走到 $f_n$ 了，可能直接走到 $f_0$，所以这一步不是所有情况都能贡献到。假设贡献为 $v$，可以知道 $v$ 就是能走到 $f_n$ 的概率。dp 计算一下，设 $g_i$ 表示有 $i$ 个为 $x$ 的球，到最后的概率所有球都变成 $x$ 的概率：

$$
\begin{align}
&g_0=0,g_s=1\\
&g_i=pg_{i-1}+pg_{i+1}+(1-2p)g_i\\
&g_{i+1}-g_{i}=g_i-g_{i-1}
\end{align}
$$

所以 $g$ 是等差数列，并且知道首项和尾项，可以解出：

$$
v=g_i=\frac{i}{s}
$$

带入列一下转移方程：

$$
\begin{align}
&f_i=pf_{i-1}+pf_{i+1}+(1-2p)f_i+\frac{i}{s}\\
&f_{i}-f_{i+1}=f_{i-1}-f_i+\frac{s-1}{s-i}\\
&f_{i+1}=2f_i-f_{i-1}-\frac{s-1}{s-i}
\end{align}
$$

由于没有 $f_0$，可得 $f_2=2f_1-1$，现在需要把 $f_1$ 解出来。根据 $f_{i}-f_{i+1}=f_{i-1}-f_i+\frac{s-1}{s-i}$ 可以把 $f_1$ 和 $f_s$ 用差分的方式列出来：

$$
f_1-0=f_1-f_s=\sum_{i=2}^s f_i-f_{i-1}
$$

考虑差分数列上相邻两项的差的贡献：

$$
\begin{align}
&\sum_{i=2}^s f_i-f_{i-1}\\
=&(s-1)(f_1-f_2)+\sum_{i=2}^{s-1} \frac{s-1}{s-i}(s-i)\\
=&(s-1)(f_1-f_2)+(s-2)(s-1)
\end{align}
$$

把 $f_2=2f_1-1$ 带入得 $f_1=\frac{(s-1)^2}{s}$。答案就是 $\sum_{i=1}^n f_{a_i}$

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

#define MODINT_TYPE long long
#define barK (64)

namespace MODINT{
	unsigned long long d;
    __uint128_t m;
    inline __attribute((always_inline)) void init(const long long &mod){
        m=(((__uint128_t)1)<<barK)/(d=mod);
        return;
    }

    inline __attribute((always_inline)) unsigned long long mod(const unsigned long long &x){
        register unsigned long long w=(m*x)>>barK;
        w=x-w*d;
        return w>=d?w-d:w;
    }

    MODINT_TYPE exgcd(MODINT_TYPE a,const MODINT_TYPE b,MODINT_TYPE &x,MODINT_TYPE &y){
        if(!b){
            x=1;
            y=0;
            return a;
        }
        MODINT_TYPE d=exgcd(b,a%b,y,x);
        y-=a/b*x;
        return d;
    }

    inline __attribute((always_inline)) MODINT_TYPE inv(const MODINT_TYPE &n,const MODINT_TYPE &p){
        MODINT_TYPE x,y;
        exgcd(n,p,x,y);
        x%=p;
        return x>=0?x:x+p;
    }

    struct MODNUM{
        MODINT_TYPE val;
        inline __attribute((always_inline)) MODNUM(const MODINT_TYPE &x){
            if(x<0){
                val=d-mod(-x);
                if(val>=d) val-=d;
            }else val=mod(x);
            return;
        }
        inline __attribute((always_inline)) MODNUM(){val=0;}
        inline __attribute((always_inline)) MODNUM operator + (const MODNUM& o) const{return (MODNUM){(val+o.val>=d)?(val+o.val-d):(val+o.val)};}
        inline __attribute((always_inline)) MODNUM operator + (const MODINT_TYPE& o) const{return *this+MODNUM(o);}
        friend inline __attribute((always_inline)) MODNUM operator + (const MODINT_TYPE &o,const MODNUM&a){return a+o;}
        inline __attribute((always_inline)) MODNUM operator - (const MODNUM& o) const{return (MODNUM){(val-o.val<0)?(val-o.val+d):(val-o.val)};}
        inline __attribute((always_inline)) MODNUM operator - (const MODINT_TYPE& o) const{return *this-MODNUM(o);}
        friend inline __attribute((always_inline)) MODNUM operator - (const MODINT_TYPE &o,const MODNUM&a){return MODNUM(o)-a;}
        inline __attribute((always_inline)) MODNUM operator * (const MODNUM& o) const{return (MODNUM){mod(val*o.val)};}
        inline __attribute((always_inline)) MODNUM operator * (const MODINT_TYPE& o) const{return *this*MODNUM(o);}
        friend inline __attribute((always_inline)) MODNUM operator * (const MODINT_TYPE &o,const MODNUM&a){return a*o;}
        inline __attribute((always_inline)) MODNUM operator / (const MODNUM& o) const{return (MODNUM){mod(val*inv(o.val,d))};}
        inline __attribute((always_inline)) MODNUM operator / (const MODINT_TYPE& o) const{return *this/MODNUM(o);}
        friend inline __attribute((always_inline)) MODNUM operator / (const MODINT_TYPE &o,const MODNUM&a){return MODNUM(o)/a;}

        inline __attribute((always_inline)) MODNUM operator ++(){
            ++val;
            if(val>=d) val-=d;
            return *this;
        }
        inline __attribute((always_inline)) MODNUM operator ++(const int){
            MODNUM tmp=*this;
            ++val;
            if(val>=d) val-=d;
            return tmp;
        }
        inline __attribute((always_inline)) MODNUM operator --(){
            --val;
            if(val<0) val+=d;
            return *this;
        }
        inline __attribute((always_inline)) MODNUM operator --(const int){
            MODNUM tmp=*this;
            --val;
            if(val<0) val+=d;
            return tmp;
        }

        inline __attribute((always_inline)) MODNUM& operator += (const MODNUM& o) {return *this=*this+o;}
        inline __attribute((always_inline)) MODNUM& operator += (const MODINT_TYPE& o) {return *this=*this+o;}
        inline __attribute((always_inline)) MODNUM& operator -= (const MODNUM& o) {return *this=*this-o;}
        inline __attribute((always_inline)) MODNUM& operator -= (const MODINT_TYPE& o) {return *this=*this-o;}
        inline __attribute((always_inline)) MODNUM& operator *= (const MODNUM& o) {return *this=*this*o;}
        inline __attribute((always_inline)) MODNUM& operator *= (const MODINT_TYPE& o) {return *this=*this*o;}
        inline __attribute((always_inline)) MODNUM& operator /= (const MODNUM& o) {return *this=*this/o;}
        inline __attribute((always_inline)) MODNUM& operator /= (const MODINT_TYPE& o) {return *this=*this/o;}

        inline __attribute((always_inline)) operator MODINT_TYPE(){return val;}
    };
}

#define mint MODINT::MODNUM

int arr[2510];
mint dp[100010];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

	MODINT::init(1000'000'007);

	register int i,max=0,sum=0;
	register mint res=0;
	int n=read();

	for(i=0;i<n;++i) sum+=(arr[i]=read()),max=std::max(max,arr[i]);
	dp[1]=mint(sum-1)*(sum-1)/sum;
	dp[2]=dp[1]*2-1;

	for(i=2;i<max;++i)
		dp[i+1]=dp[i]*2-dp[i-1]-mint(sum-1)/(sum-i);

	for(i=0;i<n;++i) res+=dp[arr[i]];

	print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```