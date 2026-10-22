发现对于某一种情况的操作，操作次数取决于最后一个被染色的方块，根据套路考虑 min-max 容斥，记随机变量 $t_i$ 表示抽到第 $i$ 张卡的时间。

$$
\begin{aligned}
Ans&=E\left(\max\left\{t_i\right\}\right)\\
&=\sum_{S\subset U} \left(-1\right)^{\left|S\right|+1}\min\left(S\right)
\end{aligned}
$$

然后考虑如何计算 $\min\left(S\right)$，那么在第一个这里面的格子被染色前，染色的格子只能宣导 $S$ 以外的，记 $cnt_S$ 表示和 $S$ 相交的区间的个数，所以期望就是 $E\left(\min\left(S\right)\right)=\frac{m}{cnt_S}$。直接子集枚举显然做不了，于是考虑记一个 $dp_{i,j}$ 表示考虑了前 $i$ 个格子，选到 $cnt_S=j$ 的所有集合的**带系数**和，为了方便写出转移式子，记 $f_{i,j}$ 表示 $L\in\left[i,j\right],R\in\left[j,n\right]$ 的区间个数。

$$
dp_{i,j}=-\sum_{k=0}^{i-1}dp_{k,j-f_{k+1,i}}
$$

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

#define MODINT_TYPE long long

namespace MODINT{
	unsigned long long d;
    __uint128_t m;
    const unsigned int barK=64;
    void init(long long mod){
        m=(((__uint128_t)1)<<barK)/(d=mod);
        return;
    }

    inline unsigned long long mod(register unsigned long long x){
        register unsigned long long w=(m*x)>>barK;
        w=x-w*d;
        return w>=d?w-d:w;
    }

    MODINT_TYPE exgcd(MODINT_TYPE a,MODINT_TYPE b,MODINT_TYPE &x,MODINT_TYPE &y){
        if(!b){
            x=1;
            y=0;
            return a;
        }
        MODINT_TYPE d=exgcd(b,a%b,y,x);
        y-=a/b*x;
        return d;
    }

    MODINT_TYPE inv(MODINT_TYPE n,MODINT_TYPE p){
        MODINT_TYPE x,y;
        exgcd(n,p,x,y);
        x%=p;
        return x>=0?x:x+p;
    }

    struct MODNUM{
        MODINT_TYPE val;
        MODNUM(MODINT_TYPE x){
            if(x<0){
                val=d-mod(-x);
                if(val>=d) val-=d;
            }else val=mod(x);
            return;
        }
        MODNUM(){val=0;}
        inline MODNUM operator + (const MODNUM& o) const{return (MODNUM){(val+o.val>=d)?(val+o.val-d):(val+o.val)};}
        inline MODNUM operator + (const MODINT_TYPE& o) const{return *this+MODNUM(o);}
        inline MODNUM operator - (const MODNUM& o) const{return (MODNUM){(val-o.val<0)?(val-o.val+d):(val-o.val)};}
        inline MODNUM operator - (const MODINT_TYPE& o) const{return *this-MODNUM(o);}
        inline MODNUM operator * (const MODNUM& o) const{return (MODNUM){mod(val*o.val)};}
        inline MODNUM operator * (const MODINT_TYPE& o) const{return *this*MODNUM(o);}
        inline MODNUM operator / (const MODNUM& o) const{return (MODNUM){mod(val*inv(o.val,d))};}
        inline MODNUM operator / (const MODINT_TYPE& o) const{return *this/MODNUM(o);}

        inline MODNUM operator ++(){
            ++val;
            if(val>=d) val-=d;
            return *this;
        }
        inline MODNUM operator ++(const int){
            MODNUM tmp=*this;
            ++val;
            if(val>=d) val-=d;
            return tmp;
        }
        inline MODNUM operator --(){
            --val;
            if(val<0) val+=d;
            return *this;
        }
        inline MODNUM operator --(const int){
            MODNUM tmp=*this;
            --val;
            if(val<0) val+=d;
            return tmp;
        }

        inline MODNUM& operator += (const MODNUM& o) {return *this=*this+o;}
        inline MODNUM& operator += (const MODINT_TYPE& o) {return *this=*this+o;}
        inline MODNUM& operator -= (const MODNUM& o) {return *this=*this-o;}
        inline MODNUM& operator -= (const MODINT_TYPE& o) {return *this=*this-o;}
        inline MODNUM& operator *= (const MODNUM& o) {return *this=*this*o;}
        inline MODNUM& operator *= (const MODINT_TYPE& o) {return *this=*this*o;}
        inline MODNUM& operator /= (const MODNUM& o) {return *this=*this/o;}
        inline MODNUM& operator /= (const MODINT_TYPE& o) {return *this=*this/o;}

        operator MODINT_TYPE(){
            return val;
        }
    };
};

MODINT::MODNUM dp[410][410],cnt[410];
std::vector<int> rpos[410];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    MODINT::init(998244353);

    register int i,j,k,l,r;
    register MODINT::MODNUM res=0;
    int n=read();
    int m=read();

    for(i=0;i<m;++i){
        l=read();r=read();
        rpos[l].push_back(r);
    }

    dp[0][0]=-1;
    for(i=1;i<=n;++i){
        for(j=i;j;--j){
            cnt[j]=cnt[j+1];
            for(auto r:rpos[j]) cnt[j]+=(r>=i);
        }
        for(j=1;j<=m;++j)
            for(k=0;k<i;++k)
                if(j-cnt[k+1]>=0)
                    dp[i][j]-=dp[k][j-cnt[k+1]];
        for(j=1;j<=m;++j) res+=dp[i][j]/j;
    }

    print(res*m);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```