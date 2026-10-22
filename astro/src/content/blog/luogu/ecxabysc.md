---
title: "CF1270I Xor on Figures 题解"
slug: "ecxabysc"
description: "前言 第一次做这种重定义矩阵+求逆题记录一下，感觉这个题好多人类智慧。 正文 0x00 题目分析 观察题目中的操作可得几个性质。 1. 首先一对 left(p,qright) 至多操作一次，否则操作次…"
date: "2023-08-22T13:28:07.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/ecxabysc"
sourceCategory: "题解"
sourceSha256: "6ba7805aa90f6bf9e9371a9c9429a6e30b6163a79c6aa7df43f824f101bccaec"
---
## 前言

第一次做这种重定义矩阵+求逆题记录一下，感觉这个题好多人类智慧。

## 正文

### 0x00 题目分析

观察题目中的操作可得几个性质。

1. 首先一对 $\left(p,q\right)$ 至多操作一次，否则操作次数将会变多。

2. 操作具有交换律。

3. 操作具有结合律（可以理解为在全 $0$ 矩阵上操作，然后 xor 在一起，最终结果不变）。

4. 操作具有自反性。

5. 在上述条件下可以推出操作唯一性，即不存在最小化的说法，只需要找出合法操作即可。

#### 0x01 抽象矩阵

为了标示和观察所有的 $x,y$ 参数。可以将这些参数放入一个矩阵中：对于每一个 $x_i,y_i$ 令 $F_{x_i,y_i}$ 为 $1$；其余格子否则为 $0$。

可以发现一对 $\left(p,q,w\right)$ 可以抽象为一种矩阵乘法运算。假若有这样一种矩阵乘法可以使得，为 $1$ 的格子乘 $w$ 还是 $w$ 并进行对应的异或；为 $0$ 的格子乘上了 $w$ 还是 $0$ 这样异或操作则不会发生。

显然定义这样的操作为：

若

$$A\times B=C$$ 

则

$$C_{i,j}=\bigoplus_{x=0}^{2^k}\bigoplus_{y=0}^{2^k} A_{x,y}\times B_{(x-i)\bmod 2^k,(y-i)\bmod 2^k}$$

这样即可实现想要的操作。

由于操作自反性且目标为全 $0$ 矩阵，现在我们的目标就是找到答案矩阵 $Ans$ 使得：

$$A=F\times Ans$$

也就是：

$$Ans=A\times F^{-1}$$

在重载的定一下找到一个 $F$ 的逆矩阵即可。

### 0x03 矩阵求逆

令单位矩阵为 $I$，即任意矩阵 $M$，有 $I\times M=M$，显然 $I_{0,0}=1$ 其余位置是 $0$。

猜想 $F^{2^k}=I$。证明：

1. 容易观察到 $F^{2^k}$ 只有 $F_{2^k\times i\bmod 2^k,2^k\times j\bmod 2^k}$ 可能有值，即只有 $F_{0,0}$ 可能有值且为 $1$。

2. $F^2$ 只有 $F_{2\times x_i\bmod,2\times y_i\bmod}$ 可能有值，应为 $F_{x_i+x_j,y_i+y_j}$ 会被正反异或两次抵消。

3. 由于原来 $F$ 只有奇数个值，那么 $F^2$ 也只能有奇数个值因为若有 $2\times x_i\equiv 2\times x_j$ 时，一定会有两个值会被同时异或抵消，这样奇偶数性质不变。

综上可得：

$$F^{2^k}=I$$

那么

$$F^{2^k-1}=F^{-1}$$

这样得到了一个很劣的时间复杂度 $\mathcal{O}\left(2^{5k}\right)$。但是至少能算了。

### 0x04 加速计算

使用类似于快速幂的方法二进制分解 $2^k-1$，这样只需要 $\mathcal{O}\left(k\right)$ 次乘法，但是还是过不了。进而想到优化乘法。

大力观察题目发现 $t$ 很小，也就是说 $F$ 中的 $1$ 很少，而且肯定越乘越少。这样当 $F_{i,j}$ 没有值的时候就不枚举剩下两维了，这样单次乘法 $\mathcal{O}\left(2^{2k}\right)$。总时间复杂度达到了 $\mathcal{O}\left(kt4^k\right)$。

### 0x05 代码实现

注意不要弄反乘法顺序了，要把 $F$ 放在前面，不然时间复杂度无法保证。

AC CODE
```cpp

#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE long long
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

int k,n,mask;

struct MAT{
    long long mat[512][512];
    void setOne(){
        register int i,j;
        for(i=0;i<n;++i)
            for(j=0;j<n;++j) mat[i][j]=0;
        mat[0][0]=1;
        return;
    }

    MAT operator * (MAT another) const{
        register int i,j,k,l;
        register MAT ans;
        ans.setOne();
        ans.mat[0][0]=0;
        for(i=0;i<n;++i)
            for(j=0;j<n;++j)
                if(mat[i][j])
                    for(k=0;k<n;++k)
                        for(l=0;l<n;++l)
                            ans.mat[(i+k)&mask][(j+l)&mask]^=mat[i][j]*another.mat[k][l];
        return ans;
    }

}A,F;

signed main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,x,y,res=0;
    k=read();
    n=1<<k;
    mask=n-1;

    for(i=0;i<n;++i)
        for(j=0;j<n;++j)
            A.mat[i][j]=read();

    int q=read();

    for(i=0;i<q;++i){
        x=read()-1;
        y=read()-1;
        F.mat[x][y]^=1;
    }

    for(i=0;i<k;++i){
        A=F*A;
        F=F*F;
    }

    for(i=0;i<n;++i)
        for(j=0;j<n;++j)
            res+=(A.mat[i][j]!=0);

    print(res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 总结

这种题要观察到其是矩阵异或乘法这样的性质，并分析这样的操作，善于观察才能完成。