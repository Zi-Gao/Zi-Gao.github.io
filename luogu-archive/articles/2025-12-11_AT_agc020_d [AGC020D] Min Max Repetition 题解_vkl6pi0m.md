记 $S^k$ 表示把字符串 $S$ 重复 $k$ 次。

首先通过贪心填找一下限制，设 $X$ 为出现次数最多的元素，那么一定是按照 $(X^{k-1}Y)^?(X^kY)^?X^k$ 这样填，那么 $k$ 就是答案，容易发现 $k=\lceil\frac{x}{y+1}\rceil$。

但是为了让字符串更小，我们可以先按照 $(A^kB)^?A^?$ 填，后面为了弥补多填的 $A$，会填成 $B^?(AB^k)^?$，直接二分分界点即可，不用任何分类讨论。

```cpp
#include<bits/stdc++.h>

void solve(){
    int i,k,l,r,mid,a,b,A,B,C,D;
    char now;
    scanf("%d%d%d%d",&A,&B,&C,&D);
    k=std::ceil(std::max(1.0*A/(B+1),1.0*B/(A+1)));
    l=0,r=A+B;
    while(l<r){
        mid=(l+r)>>1;
        b=mid/(k+1);
        a=A-mid+b;
        b=B-b;
        if(1ll*a*k>=b) l=mid+1;
        else r=mid;
    }
    for(i=C;i<=D;++i){
        if(i<=l) now=!(i%(k+1));
        else now=!!((A+B+1-i)%(k+1));
        putchar(now+'A');
    }
    putchar('\n');
}

int main(){

    int T;
    scanf("%d",&T);
    while(T--) solve();

    return 0;
}
```