## 前言

现场发明了个“可撤销背包”记录一下。

## 正文

### 0x00 题目分析

实现一个维护一个可重集，每次可能加入或删除一个元素，求当前有多少子集元素和为 $k$，无非就是一个 01 背包带了一个删除嘛。这里需要读者会使用正常一维的 01 背包。

考虑简单的要删除的元素是上一次添加的，那么按照加入元素跑背包的方式反着跑一次，加上的值反着减回去，这里不理解的可以等会看看代码，还原出原来的背包。现在考虑删除的元素不是上一次加入的元素，不妨想加入元素操作具有交换律，无论这个元素在哪个时候加入都可以默认为最后加入的。还是一样反转跑个背包就行。

### 0x01 代码实现

由于加入元素要倒序枚举，那么若加入的元素是 $x$，会倒序影响 $dp$ 背包数组中 $\left[x,k\right]$ 区间的值，对于每一个 $dp_i\leftarrow dp_i+dp_{i-k}$。那么还原直接正着一次还原出来原来的值，$dp_i\leftarrow dp_i-dp_{i-k}$，这里正确性是因为，在还原更大的 $i$ 时较小的 $i$ 已经被还原，而 $\left[0,k\right)$ 以开始没有变化就是对的。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

long long dp[5010];
const long long mod=998244353;

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register char c;
    register int i,j,x;
    int q=read();
    int k=read();
    dp[0]=1;
    while(q--){
        loop:c=getchar();
        if(c!='-'&&c!='+') goto loop;
        x=read();
        if(c=='-')//正着枚举减回去
            for(i=0;i+x<=k;++i) (dp[i+x]+=mod-dp[i])%=mod;
        else//倒序枚举跑背包
            for(i=k;i>=x;--i) (dp[i]+=dp[i-x])%=mod;
        print(dp[k]);puts("");
    }
    

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```