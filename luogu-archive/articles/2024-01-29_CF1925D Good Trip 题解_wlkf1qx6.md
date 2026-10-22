## 前言

估值要掉没了，快来写题解。

## 正文

### 0x00 分析题目

发现这题需要计算期望，不妨先把期望转化为求所有情况的贡献和，最后除一个情况数即可。首先可以发现贡献相对独立，不同的两对朋友之间的贡献互不影响，于是考虑拆分贡献，对于第 $i$ 对朋友，首先枚举其一起出游了几次，记为 $j$，总共有 $\frac{j\left(j+1\right)}{2}+\left(f_i-1\right)j$ 的贡献。其次考虑有多少中情况可以取到这样的贡献，分成两部分计算，第一部分是在哪几次出游自然有 $\tbinom{k}{j}$ 中选法，然后考虑剩下出游次数的贡献，除了这对朋友，其他可以任意选，所以是 $\left(\frac{n\left(n-1\right)}{2}-1\right)^{k-j}$ 种选法那么总的贡献是 $\left(\frac{j\left(j+1\right)}{2}+\left(f_i-1\right)j\right)\tbinom{k}{j}\left(\frac{n\left(n-1\right)}{2}-1\right)^{k-j}$，发现可以分离变量 $f_i$ 那么预处理两部分的贡献即可。

### 0x01 代码实现

AC CODE

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

#define PC_DATA_TYPE long long

const PC_DATA_TYPE PC_MOD=1000000007;
const PC_DATA_TYPE PC_DATA_SIZE=200010;

PC_DATA_TYPE inv[PC_DATA_SIZE],fact[PC_DATA_SIZE],invfact[PC_DATA_SIZE];

void init_pc(int n){
    register int i;
    for(inv[0]=0,inv[1]=fact[0]=fact[1]=invfact[0]=invfact[1]=1,i=2;i<=n;++i)
        invfact[i]=invfact[i-1]*(inv[i]=PC_MOD-PC_MOD/i*inv[PC_MOD%i]%PC_MOD)%PC_MOD,fact[i]=fact[i-1]*i%PC_MOD;
    return;
}

PC_DATA_TYPE A(int n,int m){
    if(n<0||m<0||n<m) return 0;
    return fact[n]*invfact[n-m]%PC_MOD;
}
PC_DATA_TYPE C(int n,int m){
    if(n<0||m<0||n<m) return 0;
    return fact[n]*invfact[n-m]%PC_MOD*invfact[m]%PC_MOD;
}

#define QPOW_DATA_TYPE MODINT::MODNUM
QPOW_DATA_TYPE qpow(register QPOW_DATA_TYPE base,register int e){
    register QPOW_DATA_TYPE res=1;
    while(e){
        if(e&1) res=(res*base);
        base=(base*base);
        e>>=1;
    }
    return res;
}

void solve(){
    register long long i;
    register MODINT::MODNUM baseVal=0,sum=0,res=0,tmp,sum2=0,now;
    long long n=read();
    long long m=read();
    long long k=read();
    if(m==0) return puts("0"),void();
    for(i=1;i<=k;++i){
        tmp=C(k,i)*qpow(n*(n-1)/2-1,k-i);
        baseVal+=tmp*(i*(i+1)/2);
        // sum2+=tmp;
        sum+=tmp*i;
    }
    for(i=0;i<m;++i){
        read();read();
        now=read();
        res+=sum*(now-1)+baseVal;
    }
    res/=qpow(n*(n-1)/2,k);
    print(res),putchar('\n');
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    MODINT::init(1000000007);
    init_pc(PC_DATA_SIZE-1);

    int T=read();
    while(T--) solve();

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```
