这是一篇 $\mathcal{O}(n)$ 题解，代码**巨**简洁。

首先考虑这个限制条件意味着什么，发现当且仅当，区间 LIS 序列和 LDS 序列并为整个区间，交为一个点，形如一个叉叉的样子。枚举交的这个点 $a_i$，考虑向后向前的扩展，这里只考虑向后，那么每个 $a_j\le a_i$ 一定要加入 LIS 序列，否则一定要加入 LDS 序列。那么单调栈就可维护，每次把端点移动到弹出点的位置即可。

然后需要维护一个矩形并面积大小，但是发现左下角的点和右上角的点横纵坐标都单调递增，那么每次减去相交即可。

```cpp
il void calc(int op){
    int i,j,p=0,sum;
    std::stack<int> A,B;
    for(i=1;i<=n;++i){
        while((!A.empty())&&a[i]>a[A.top()]) p=std::max(p,A.top()),A.pop();
        while((!B.empty())&&a[i]<a[B.top()]) p=std::max(p,B.top()),B.pop();

        if(a[i]>a[i+1]) A.push(i);
        else B.push(i);

        pos[op][op?n-i+1:i]=i-p;
    }
}

void solve(){
    int i;
    i64 res=0,lx=0,ly=0,xa,ya,xb,yb;
    n=read();
    for(i=1;i<=n;++i) a[i]=read();
    calc(0);
    std::reverse(a+1,a+1+n);
    calc(1);

    for(i=1;i<=n;++i){
        xa=i-pos[0][i]+1,ya=i;
        xb=i,yb=i+pos[1][i]-1;
        res+=(xb-xa+1)*(yb-ya+1)-std::max(lx-xa+1,0ll)*std::max(ly-ya+1,0ll);
        lx=xb,ly=yb;
    }
    print(res),putchar('\n');
}
```