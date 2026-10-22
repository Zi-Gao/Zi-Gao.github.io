## 前言

F 居然比 G 难，考场上做完 F 就没时间了，亏大了。但是这场 0 伤通过 A 到 F 还是挺开心的。

## 正文

### 0x00 分析题目

一个基础的观察是，一个盒子里面只有一种颜色的球。继续观察发现这个第一步把球往后放的操作其实就是把球围成一个圈，从不同的地方断开进行操作。于是可以经典操作，断链成环，这样就只需要解决从每个点开始的一段长度为 $n$ 的区间内会发生的事情了。考虑用滑动窗口的方法解决，我这里使用的是从后向前滑动，维护所有盒子的第一个球的下标，以及每种颜色被放入盒子的球的下标。并且可以知道，同一个颜色的球肯定是某个前缀可以放进去，后面都没有放进去。若现在在序列开头加入了一个球，分类讨论一下：

1. 之前这个颜色的球每个都放入了某个盒子中。

   那么在序列开头加入这个颜色的球，肯定还是会有限处理这个颜色的球，相当于把这个的分配方案向前平移了一段，所以这个颜色的球放入的方案不会发生变化，仍然会每个球都能放入某个盒子中，并且弹出最后一个这个颜色的球。但是对于其他颜色的球会不会有影响呢？答案是不会的，正如前文所说这样的情况是在平移这个颜色放入方案，那么其他球并不会被影响到。

2. 之前并不是所有这个颜色的球都放入了盒子中。

   显然这时所有放这个颜色球的盒子都已经装满了，在序列开头加入，必定会优先处理这个颜色，新开一个盒子往里面放。但是与上面一种情况不同的是，这种情况会对其他球的分配方案造成影响，若当前用的盒子超出了限制，自然会导致最后一个开的盒子被踢出去。

### 0x01 代码实现

用一个 `set` 和 $n$ 个 `deque` 实现，分别维护全局每个盒子的第一个球的下标和每种颜色放入盒子的球的下标。

AC CODE

```cpp
#include<bits/stdc++.h>
#define int long long
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

std::set<int> Q;//fir:col sec:id
std::deque<int> QCol[200010];

int cntBox[200010],C[400010],buc[200010],ans[200010];

signed main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,col,res=0;
    int n=read();
    int m=read();
    int K=read();
    for(i=0;i<n;++i) C[i]=C[i+n]=read();
    if(m>=n){
        for(i=0;i<n;++i) print(n),putchar(' ');
        return 0;
    }
    for(i=n;i<n*2;++i){
        if(cntBox[C[i]]*K>=++buc[C[i]]) ++res;
        else if(Q.size()==m) ;
        else Q.insert(i),QCol[C[i]].push_back(i),++cntBox[C[i]],++res;
    }

    for(i=n-1;~i;--i){
        if(cntBox[C[i]]*K>=buc[C[i]]){
            Q.erase(QCol[C[i]].back()),QCol[C[i]].pop_back();
            Q.insert(i),QCol[C[i]].push_front(i);
        }else{
            res-=cntBox[C[i]]*K;
            Q.insert(i),QCol[C[i]].push_front(i),++cntBox[C[i]];
            res+=std::min(cntBox[C[i]]*K,buc[C[i]]);

            if(Q.size()>m){
                col=C[*std::prev(Q.end())],Q.erase(*std::prev(Q.end()));
                res-=std::min(buc[col],cntBox[col]*K);
                QCol[col].pop_back(),--cntBox[col];
                res+=std::min(buc[col],cntBox[col]*K);
            }
        }

        ans[i]=res;
    }

    for(i=0;i<n;++i) print(ans[i]),putchar('\n');

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```
