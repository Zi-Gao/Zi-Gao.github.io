> 题意：
>
> 给定一个 $n$ 个点的 DAG，并且有向边一定从编号小的点连向编号大的点，现在给出了两两间路径条数的奇偶性，问原图有多少条连边，可以证明答案唯一确定。
>
> $n\leq 750$

首先你需要知道如何求解这个问题的逆向问题，即给定一个这样的图，输出两两点连边的奇偶性，显然考虑一个 dp，设 $dp_{u,v}$ 表示 $u$ 和 $v$ 号点之间的连边奇偶性，显然有递推式子 $dp_{u,v}=\sum_{u\rightarrow w}dp_{w,v} \bmod2$。

然后考虑简化问题，只有两个点的时候怎么办？显然奇偶性为 $1$ 就是有边，否则没边。可以发现在原图扩张时由于 $n-1$ 号点只可能和 $n$ 点连边，这个性质仍然成立，这样就确定了一条边。继续考虑确定剩下的边，不妨先考虑 $n-2$ 号点和 $n-1$ 号点的连边情况，由于这两个点至多有一条连边，所以这条边的情况一可以直接确定。这时若有连边，那么 $n-2$ 号点就能通过 $n-1$ 号点尝试到达 $n$ 号点，然后就可以像上面的 dp 式子一样逆向转移一下，把这个点的贡献减出去，就可以少考虑一个点了。进而会发现当前 $n-2$ 号点到 $n$ 号点的其他路径已经确认完毕了，就剩是否直连的情况，在 dp 式子逆向转移后 $dp_{n-2,n}=1$ 那么肯定有边 $n-2\rightarrow n$ 了。不妨把这个解决过程推广到全图，从编号大的点倒序考虑，递推出来所有的连边情况。

用 `bitset` 实现的，因为可以发现逆向转移实际上就是在做一个异或。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

std::bitset<750> e[750],sour[750];

int main(){

    register char c;
    register int i,j,res=0;
    int n=read();
    for(i=0;i<n;++i){
        for(j=i+1;j<n;++j){
            loop:c=getchar();
            if(c!='0'&&c!='1') goto loop;
            sour[i][j]=e[i][j]=c-'0';
        }
    }

    for(i=n-1;~i;--i)
        for(j=i+1;j<n;++j)
            if(e[i][j]){
                ++res;
                e[i]=e[i]^sour[j];
            }

    print(res);

    return 0;
}
```
