## 前言

来个无脑分块做法，不需要并查集。

## 正文

首先有一个结论，观察到绝对值函数 $f_a\left(x\right)=\left|x-a\right|$ 关于 $x=a$ 这条直线对称，并且题目要求对这样的函数进行复合得到 $g\left(x\right)=f_{a_0}\left(f_{a_1}\left(\cdots f_{a_n}\left(x\right)\cdots\right)\right)$，显然 $g\left(x\right)$ 函数的对称性和 $f_{a_n}\left(x\right)$ 的对称性一样。

现在给定了一个长度为 $n$ 的数组 $a$，每次询问给定 $l,r,x$，求 $f_{a_r}\left(f_{a_{r-1}}\left(\cdots f_{a_l}\left(x\right)\cdots\right)\right)$ 的值，记为 $f_{l,r}\left(x\right)$。考虑对 $a$ 序列分块，自然想到处理出每个块区间的函数复合后的长度为 $V$ 的完整映射。由于第一个结论，可以考虑这样一个处理过程来求出 $x\in\left[l,r\right]$ 对于 $f_{s,t}\left(x\right)$ 函数的映射，进行一个分类讨论：

1. 当 $s=t$ 时直接计算。
2. 当 $a_{s}\in \left[l,r\right]$ 再进行一个分类讨论
   1. 当 $a_s-l\geq r-a_s$ 时，递归处理 $x\in\left[0,a_s-l\right]$ 的 $f_{s+1,t}$，得到 $x\in\left[l,a_s\right]$ 的 $f_{s,t}\left(x\right)=f_{s+1,t}\left(a_s-\left(x-l\right)\right)$，然后根据对称轴填充另一部分 $f_{s,t}\left(x\right)=f_{s,t}\left(2a_s-x\right)$。
   2. 反正同理。
3. 否则，进行一个分类讨论：
   1. 当 $a_s\le l$ 时，递归处理 $x\in\left[l-a_s,r-a_s\right]$ 的 $f_{s+1,t}$，得到 $x\in\left[l,a_s\right]$ 的 $f_{s,t}\left(x\right)=f_{s+1,t}\left(x-l\right)$。
   2. 反之同理。

这样处理每一个块只需要填 $\mathcal{O}\left(V\right)$ 次，不会重复填，所以预处理时间复杂度是 $\mathcal{O}\left(\frac{nV}{B}\right)$，总的时间复杂度是 $\mathcal{O}\left(\frac{nV}{B}+m\left(\frac{n}{B}+B\right)\right)$，实测当 $B=2\sqrt{n}$ 时最优。

## 代码

代码实现上可以用一个函数 `solve(l,r,s,t)` 表示需要解决 $x\in\left[l,r\right]$ 的映射关系，并且把这个映射关系填到记录映射数组的 $\left[s,t\right]$ 位置上去。注意当 $l\ge r$ 时将值域区间翻转一下 $l\leftarrow 2a_s-l,r\leftarrow 2a_s-r$。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

const int NNNN=100010;
const int MMMM=1010;
// const int NNNN=110;
// const int MMMM=110;
int V=NNNN-5;

int abss(int x){return x<0?-x:x;}

struct BA{
    int len,cnt,id[NNNN],arr[NNNN],F[MMMM][NNNN],L[MMMM],R[MMMM],tag[MMMM];

    void build(int n,int *data){
        register int i;
        len=std::sqrt(n)*3;
        cnt=n/len;
        if(n%len) ++cnt;
        for(i=1;i<=n;++i) arr[i]=data[i],id[i]=(i-1)/len+1;
        for(i=1;i<=cnt;++i) L[i]=(i-1)*len+1,R[i]=i*len,buildB(i);
        R[cnt]=n;
        return;
    }

    void solve(int l,int r,int s,int t,int id,int now,int end){
        register int i;
        if(s>t) s=arr[now]-s+arr[now],t=arr[now]-t+arr[now];  
        if(now==end){
            for(i=l;i<=r;++i)
                F[id][i]=abss(i-l+s-arr[now]);
            return;
        }
        if(s<arr[now]&&arr[now]<t){
            if(arr[now]-s>t-arr[now]){
                solve(l,l+arr[now]-s,arr[now]-s,0,id,now+1,end);
                for(i=l+arr[now]-s+1;i<=r;++i)
                    F[id][i]=F[id][(l+arr[now]-s)-(i-(l+arr[now]-s))];
            }else{
                solve(l+arr[now]-s,r,0,t-arr[now],id,now+1,end);
                for(i=l;i<l+arr[now]-s;++i)
                    F[id][i]=F[id][(l+arr[now]-s)+((l+arr[now]-s)-i)];
            }
        }else solve(l,r,abss(s-arr[now]),abss(t-arr[now]),id,now+1,end);
        return;
    }

    void buildB(int id){
        return solve(0,V,0,V,id,L[id],R[id]);
    }

    int query(int l,int r,int x){
        register int i;
        int begin=id[l],end=id[r];
        if(begin==end){
            for(i=l;i<=r;++i) x=abss(x-arr[i]);
            return x;
        }
        for(i=l;id[i]==begin;++i)
            x=abss(x-arr[i]);
        for(i=begin+1;i<end;++i)
            x=F[i][x];
        for(i=L[end];i<=r;++i)
            x=abss(x-arr[i]);
        return x;
    }
}ba;

int arr[100010];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,latans=0,l,r,x;
    int n=read();
    int q=read();
    for(i=1;i<=n;++i) arr[i]=read();
    ba.build(n,arr);

    for(i=0;i<q;++i){
        l=read()^latans;
        r=read()^latans;
        x=read()^latans;
        print(latans=ba.query(l,r,x)),putchar('\n');
    }

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```
