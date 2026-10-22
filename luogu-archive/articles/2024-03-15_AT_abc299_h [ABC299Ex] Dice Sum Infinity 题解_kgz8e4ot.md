## 题意

高桥有一个小于 $10^9$ 的正整数 $R$ 和一个初始是 $0$ 的数 $X$，每次等概率加 $1$ 到 $6$。直到当前 $X-R$ 为 $10^9$ 的倍数时停止，求期望次数。

## 题解

### 分析

题意就是从 $0$ 开始随机游走，求到 $R$ 的期望步数。发现每次错过 $R$，就会到 $R+0,R+1,R+2,R+3,R+4,R+5$，那么我们拿这些点出来建图，变成一个图上随机游走问题，求游走到 $R+0$ 的概率。但是为了把这个图描述出来，需要处理一些东西。

第一个 $E_i$ 表示，从 $0$ 开始刚好错过，或走到 $i$ 的期望步数，即走到 $i,i+1,i+2,i+3,i+4,i+5$ 的期望，但是注意一旦当前走到大于等于 $i$ 则应该立即停止，比如不能从 $i+1$ 走到 $i+3$，这个东西很好求，记 $E_{i,j}$ 表示从 $j$ 开始第一次过 $i$ 的期望，显然 $E_{i,i+1}=E_{i,i+2}=\cdots=E_{i,i+5}=0$，然后有：

$$
E_{i,j}=1+\sum_{k=1}^{6}\frac{1}{6}E_{i,j+k}
$$

矩阵快速幂求解即可。

第二个是 $P_i$ 表示从 $0$ 出发，走到 $i$ 的概率，同样设 $E_{i,j}$ 表示从 $j$ 开始走到 $i$ 的概率，有 $P_{i,i}=1$，转移：

$$
P_{i,j}=\sum_{k=1}^{6}\frac{1}{6}P_{i,j+k}
$$

然后就可以建图了，设 $dp_i$ 表示 $R+i$ 走到 $R+0$ 的期望步数，$dp_0=0$，其他的 $i$ 有：

$$
dp_i=E'_i+\sum_{j=0}^5 P_{j-i+10^9}dp_j
$$

注意这里的 $E'$ 有所不同，表示 $R+i$ 开始游走到第一次过 $R+0$ 的期望步数。这个转移的意思就是，我先走出去 $E'_i$ 转了一圈回来，然后剩下的路程从每一个点开始继续走，其中绕一圈到 $j$ 的概率是 $P_{j-i+10^9}$。高斯消元求解。最后统计答案：

$$
ans=E_R+\sum_{i=0}^5P_{R+i}dp_i
$$

其意义就是和上面的转移差不多，算上了从 $0$ 开始第一次到 $R$ 这一段。

### 实现

有个很巧妙的实现方法，避免多次矩阵快速幂，先把矩阵搞出来，然后发现求解概率和求解期望的矩阵只差是否加 $1$ 和初始，具体来说，求解期望时，第一个向量只有常量 $1$ 的位置是 $1$；求概率时，第一个向量只有 $P_i$ 的位置是 $1$。而转移矩阵都是相同的，所以对于算图上随机游走时，只需要先算出转移矩阵的 $10^9$ 次方，记为 $mat$，然后 $P_{j-i+B}=mat_{j,i},E'_{i}=mat_{6,i}$ 非常神奇。统计答案时同理，算出转移矩阵的 $R$ 次方就可以了。

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

#include<cstring>
#define MATRIX_MOD 
#define MATRIX_DATA_TYPE MODINT::MODNUM
const int MATRIX_MAX_N=7;
const int MATRIX_MAX_M=7;
struct MATRIX{
    int n,m;
    MATRIX_DATA_TYPE matrix[MATRIX_MAX_N][MATRIX_MAX_M];

    MATRIX operator + (const MATRIX &a) const {
        register int i,j;
        MATRIX ans;
        ans.n=n;
        ans.m=m;
        for(i=0;i<n;++i)
            for(j=0;j<m;++j)
                ans.matrix[i][j]=(matrix[i][j]+a.matrix[i][j])MATRIX_MOD;

        return ans;
    }

    MATRIX operator * (const MATRIX &a) const {
        register int i,j,k;
        MATRIX ans;
        ans.n=n;
        ans.m=a.m;
        for(i=0;i<n;++i)
            for(j=0;j<a.m;++j){
                ans.matrix[i][j]=0;
                for(k=0;k<m;++k)
                    ans.matrix[i][j]=(ans.matrix[i][j]+matrix[i][k]*a.matrix[k][j]MATRIX_MOD)MATRIX_MOD;
            }

        return ans;
    }

    friend MATRIX operator ^ (MATRIX base,register long long exponential){
        register int i,j;
        MATRIX ans;
        ans.n=base.n;
        ans.m=base.n;

        for(i=0;i<ans.n;++i)
            for(j=0;j<ans.m;++j)
                ans.matrix[i][j]=(i==j);

        while(exponential){
            if(exponential&1) ans=ans*base;
            base=base*base;
            exponential>>=1;
        }

        return ans;
    }

    void clear(){
        register int i,j;
        for(i=0;i<n;++i)
            for(j=0;j<m;++j)
                matrix[i][j]=0;
        return;
    }
    void print(){
        register int i,j;
        for(i=0;i<n;++i,putchar('\n'))
            for(j=0;j<m;++j,putchar(' '))
                ::print(matrix[i][j]);
        putchar('\n');
    }
}base,trans;

#define GJ_MOD_TYPE long long
const GJ_MOD_TYPE GJ_mod=998244353;

GJ_MOD_TYPE exgcd(GJ_MOD_TYPE a,GJ_MOD_TYPE b,GJ_MOD_TYPE &x,GJ_MOD_TYPE &y){
    if(!b){
        x=1;
        y=0;
        return a;
    }
    GJ_MOD_TYPE d=exgcd(b,a%b,y,x);
    y-=a/b*x;
    return d;
}

GJ_MOD_TYPE inv(GJ_MOD_TYPE n,GJ_MOD_TYPE p){
    GJ_MOD_TYPE x,y;
    exgcd(n,p,x,y);
    x%=p;
    return x>=0?x:x+p;
}
/*
-1:infinite solutions
0: no solution
1: only one solution
*/
int GJMODSolve(std::vector<GJ_MOD_TYPE> *mat,int n){
    register int r,c,i,j,maxR;
    register GJ_MOD_TYPE invnow;
    for(r=c=0;c<n;++c){
        maxR=r;
        for(i=r+1;i<n;++i) if(mat[i][c]>mat[maxR][c]) maxR=i;
        if(maxR!=r) mat[maxR].swap(mat[r]);

        if(!mat[r][c]) continue;

        invnow=inv(mat[r][c],GJ_mod);
        for(i=n;i>=c;--i) (mat[r][i]*=invnow)%=GJ_mod;
        for(i=0;i<n;++i)
            if(mat[i][c]&&i!=r)
                for(j=n;j>=c;--j)
                    (mat[i][j]+=GJ_mod-mat[r][j]*mat[i][c]%GJ_mod)%=GJ_mod;
        ++r;
    }
    if(r<n)
        for(i=r;i<n;++i)
            if(mat[i][n])
                return 0;

    return r<n?r-n:1;
}

long long B=1000'000'000;
const long long mod=998244353;

std::vector<long long> mat[6];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    MODINT::init(mod);

    register int i,j;
    register MODINT::MODNUM res=0;

    trans.n=trans.m=7;
    for(i=0;i<6;++i) trans.matrix[i][0]=MODINT::MODNUM(1)/6;
    for(i=1;i<6;++i) trans.matrix[i-1][i]=1;
    trans.matrix[6][6]=1;
    trans.matrix[6][0]=1;

    base=trans^B;
    
    long long R=read();
    for(i=0;i<6;++i){
        mat[i].resize(7);
        mat[i][i]=1;
        if(i){
            for(j=0;j<6;++j)
                mat[i][j]+=mod-base.matrix[j][i];
            mat[i][6]=base.matrix[6][i];
        }
    }

    GJMODSolve(mat,6);

    base=trans^R;

    res=base.matrix[6][0];

    for(i=0;i<6;++i)
        res+=mat[i][6]*base.matrix[i][0];

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```