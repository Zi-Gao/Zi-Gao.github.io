## 题意

有一个数轴，终点为原点。一个机器人位于 $D$，有 $n$ 条指令，对第 $i$ 条指令机器人会向终点移动 $d_i$ 距离，若移动后距离变大则不移动，意思是可能冲过，但是若距离变小就可以过去。

给出 $m$ 个询问，第 $i$ 次询问允许将 $d_{q_i}$ 修改为任意整数（仅当前询问生效）。问是否存在修改方案使机器人不能走到终点。

## 题解

记 $dis_i$ 表示不修改前 $i$ 个操作情况下，当前能走动哪。那么对于一次可以修改 $d_x$ 的询问，若存在一个 $y\leq d_{x-1}$ 使得 $y$ 在经过 $i+1$ 到 $n$ 的操作后没到 $0$ 则有解，否则无解。所以考虑求出最小使得走完后面操作不为 $0$ 的距离，记 $mn_i$ 表示最小走完 $i$ 到 $n$ 的操作之后不为 $0$ 的距离，倒着 dp 即可：

1. 当 $mn_{i+1}\leq\frac{d_i}{2}$，有 $mn_i=mn_{i+1}$。因为这种情况肯定会直接冲过，但是冲过 $d_i-mn_{i+1}\geq mn{i+1}$ 故不会这样走，这样 $mn_i$ 取到了下限。
2. 当 $mn_{i+1}\gt\frac{d_i}{2}$，有 $mn_i=mn_{i+1}+d_i$。分类讨论一下，若这一步是冲过的，那么 $m_i=d_i-mn_{i+1}\lt mn_{i+1}$ 所以不可能；若没动，那么 $mn_i=mn_{i+1}$ 这时候若直接冲过 $d_i-mn_{i+1}\lt mn_{i+1}$ 不可能，或者直接走过去 $mn_{i+1}-d_{i+1}\lt mn_{i+1}$ 所以也不可能；所以只能是直接走过去的情况。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

int mnD[500010],dis[500010],d[500010];

int abss(int x){return x<0?-x:x;}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i;
    int n=read();
    dis[0]=read();
    for(i=1;i<=n;++i){
        d[i]=read();
        dis[i]=std::min(abss(dis[i-1]-d[i]),dis[i-1]);
    }
    mnD[n+1]=1;
    for(i=n;i;--i){
        if(d[i]/2>=mnD[i+1]) mnD[i]=mnD[i+1];
        else mnD[i]=mnD[i+1]+d[i];
    }

    int q=read();
    while(q--){
        i=read();
        puts(dis[i-1]>=mnD[i+1]?"YES":"NO");
    }

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```