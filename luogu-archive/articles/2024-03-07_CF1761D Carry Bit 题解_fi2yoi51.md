首先很显然有一个 $\mathcal{O}\left(nk\right)$ 的朴素 DP 做法，具体地设 $dp_{i,j,0/1}$ 表示当前考虑了前 $i$ 位，进位了 $j$ 次，并且 $i$ 位上是否向 $i+1$ 进位的方案数。考虑刷表计算，从 $dp_{i,j,0/1}$ 向下推，分类讨论一下第 $i+1$ 位两个数的情况可以得到：

1. $dp_{i,j,0}$ 下一位分别选 $\{0,0\},\{0,1\},\{1,0\}$ 三种情况都可以转移到 $dp_{i+1,j,0}$。

2. $dp_{i,j,0}$ 下一位分别选 $\{1,1\}$ 一种情况都可以转移到 $dp_{i+1,j+1,1}$。

3. $dp_{i,j,1}$ 下一位分别选 $\{0,1\},\{1,0\},\{1,1\}$ 三种情况都可以转移到 $dp_{i+1,j+1,1}$。

4. $dp_{i,j,1}$ 下一位分别选 $\{0,0\}$ 一种情况都可以转移到 $dp_{i+1,j,0}$。

最终答案是 $dp_{n,k,0}$ 或者 $dp_{n,k-1,1}$。发现可以重新给这个 DP 式子一个组合意义：有一个变量 $x=0$，每次有三种操作将 $x$ 异或上 $1$，一种操作异或上 $0$，然后任意操作 $n$，让每个时刻的 $x$ 的状态构成一个长度为 $n+1$ 的 $01$ 序列，答案就是有多少中操作方案使得最终序列里面有 $k$ 个 $1$。枚举 x 变化的总次数 $i$，那么 $01$ 串中有 $\lceil\frac{i}{2}\rceil$ 个 $0$ 的连续段，$\lfloor\frac{i}{2}\rfloor$ 个 $1$ 的连续段，$0$ 连续段的总长必须为 $n+1−k$，$1$ 连续段的总长必须为 $k$，用插板法计算方案数。

```cpp
MODINT::MODNUM pw3[2000010];

#define PC_DATA_TYPE long long

const PC_DATA_TYPE PC_MOD=1000000007;
const PC_DATA_TYPE PC_DATA_SIZE=2000010;

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

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    MODINT::init(1000000007);

    register int i;
    register MODINT::MODNUM res=0;
    int n=read();
    int k=read();

    init_pc(n*2);
    for(i=pw3[0]=1;i<=n*2;++i) pw3[i]=pw3[i-1]*3;

    if(k==0) return print(pw3[n]),0;

    for(i=1;i<=k;++i){
        if(n-i*2>=0) res+=pw3[n-i*2]*C(n-k,i)*C(k-1,i-1);
        if(n-i*2+1>=0) res+=pw3[n-i*2+1]*C(n-k,i-1)*C(k-1,i-1);
    }

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```