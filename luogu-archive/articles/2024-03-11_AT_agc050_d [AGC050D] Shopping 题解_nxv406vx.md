## 题意

有 $n$ 个人，$m$ 个物品，初始在一个队列里面排好，然后玩一个游戏：

1. 取出对头的人，这一回合这个人玩。
2. 这个人从自己在之前的回合中没选到过的物品中等概率选择一个物品。
   1. 若这个物品被其他人选走，则让这个人去到队尾。
   2. 若这个物品没被其他人选走，则让这个人离开，并选走这个物品。
3. 若队列里面还有人并且还有物品没被选走，则重复第一步。

问每个人拿到任意一个商品的概率，$n,m\leq 40$。

## 题解

肯定考虑设计一个 $dp$，表示什么什么的概率，但是发现一个很简单的状态难以描述本题这样复杂的局面，那就多记一点东西，设 $dp_{l,r,x,y}$ 表示考虑的这个人获得物品的概率，并且他左边有 $l$ 个人，右边有 $r$ 个人，现在算到这 $l+r+1$ 个人中第 $x$ 个人，在第 $y$ 大轮中。一大轮指队列循环了多少次，这样避免队列循环的问题。

发现可以转移了，分类讨论一下当前人是否拿到了物品即可，而这个概率是可以通过目前记下来的状态算出来的，首先到现在已经有 $n-l-r-1$ 个人被选走了，剩下 $m-\left(n-l-r-1\right)$ 个物品，而对于这个人前 $y-1$ 轮，每轮选一个物品，这些都不会选了，所以是 $m-\left(y-1\right)$，所以记 $p$ 为选走一个物品的概率，显然 $p=\frac{m-\left(n-l-r-1\right)}{m-\left(y-1\right)}$，剩下的就是分类讨论一下每种情况就可以了，看代码就好。

使用记搜要方便一些

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
        friend inline MODNUM operator + (const MODINT_TYPE &o,const MODNUM&a){return a+o;}
        inline MODNUM operator - (const MODNUM& o) const{return (MODNUM){(val-o.val<0)?(val-o.val+d):(val-o.val)};}
        inline MODNUM operator - (const MODINT_TYPE& o) const{return *this-MODNUM(o);}
        friend inline MODNUM operator - (const MODINT_TYPE &o,const MODNUM&a){return MODNUM(o)-a;}
        inline MODNUM operator * (const MODNUM& o) const{return (MODNUM){mod(val*o.val)};}
        inline MODNUM operator * (const MODINT_TYPE& o) const{return *this*MODNUM(o);}
        friend inline MODNUM operator * (const MODINT_TYPE &o,const MODNUM&a){return a*o;}
        inline MODNUM operator / (const MODNUM& o) const{return (MODNUM){mod(val*inv(o.val,d))};}
        inline MODNUM operator / (const MODINT_TYPE& o) const{return *this/MODNUM(o);}
        friend inline MODNUM operator / (const MODINT_TYPE &o,const MODNUM&a){return MODNUM(o)/a;}

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

        operator MODINT_TYPE(){return val;}

    };
};



MODINT::MODNUM dp[50][50][50][50],inv[50];
std::bitset<50> vis[50][50][50];

int n,k;

MODINT::MODNUM dfs(int x,int y,int z,int w){
    if(vis[x][y][z][w]) return dp[x][y][z][w];
    if(w>k||n-(x+y+1)>=k) return 0;
    register MODINT::MODNUM res=0,p=(k-(n-(x+y+1)))*inv[k-w+1],p2;
    p2=1-p;
    if(z==x+1) res=p*1+p2*(y?dfs(x,y,z+1,w):dfs(x,y,1,w+1));
    else if(z<x+1) res=p*dfs(x-1,y,z,w)+p2*dfs(x,y,z+1,w);
    else{
        if(z==x+y+1) res=p*dfs(x,y-1,1,w+1)+p2*dfs(x,y,1,w+1);
        else res=p*dfs(x,y-1,z,w)+p2*dfs(x,y,z+1,w);
    }

    vis[x][y][z][w]=1;
    return dp[x][y][z][w]=res;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    MODINT::init(998244353);

    register int i;
    n=read();k=read();
    for(i=1;i<=k;++i)
        inv[i]=1/MODINT::MODNUM(i);

    for(i=1;i<=n;++i) print(dfs(i-1,n-i,1,1)),putchar('\n');

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```