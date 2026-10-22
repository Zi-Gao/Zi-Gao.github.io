---
title: "CF1918E 有个人交互题输出不换行"
slug: "drpl996f"
description: "前言 有个人交互题输出不换行，到比赛结束都没调过。 正文 0x00 分析题目 根据这个题奇怪的交互方式，可以发现我们并没有办法直接获得每个数的具体数值，但是可以获得某个数和其他数的偏序关系。由于要找出…"
date: "2024-01-31T02:17:31.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/drpl996f"
sourceCategory: "个人记录"
sourceSha256: "a37fa34588faec179146bf32fdcf619e2d3978ccd09272a7cd50bcb0a0888933"
---
## 前言

有个人交互题输出不换行，到比赛结束都没调过。

## 正文

### 0x00 分析题目

根据这个题奇怪的交互方式，可以发现我们并没有办法直接获得每个数的具体数值，但是可以获得某个数和其他数的偏序关系。由于要找出这个排列，不难想到这是一个排序的过程，如果能对值排序后并且知道原来的下标即可解决问题。而解决排序问题一个最出名的办法就是快速排序，观察快速排序的过程，会发现快速排序也只需要知道偏序关系就行！那么可以很自然的设计出一个解决过程，假设当前要解决下标集合 $S$ 的排序问题：

1. 在 $S$ 中随机选出一个下标 $pos$。

2. 重复询问 $a_{pos}$ 直到 $x$ 与 $a_{pos}$ 相等。

3. 找出 $S$ 中其他元素与 $a_{pos}$ 的偏序关系，分成 $S_0,S_1$ 分别表示比 $a_{pos}$ 小的元素下标集合以及更大的下标集合。

4. 分治处理 $S_0,S_1$。

5. 现在已知 $S_0$ 内的元素都比 $a_{pos}$ 小，$S_1$ 内的元素都比 $a_{pos}$ 小，以及 $S_0,S_1$ 各自的偏序关系，即可求出 $S$ 的偏序关系。

### 0x01 询问复杂度分析

分两部分：

1. 对于上面过程第 $3$ 步，这里复杂度同快排时间复杂度。

2. 对于第 $2$ 步，这里每次分治时最多偏移 $\left|S\right|$ 就能让 $x=a_{pos}$ 所以也没问题。

大概有个 $4$ 倍或更小的常数，可以通过。

### 0x02 代码实现

记得在询问以后每次把 $x$ 调回 $a_{pos}$。

AC CODE

```cpp
#include<bits/stdc++.h>
using namespace std;
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

int id[2010],cp[2010],val[2010],res[2010];
std::mt19937 mt(time(0));

char getC(){
    int c=getchar();
    if(c!='>'&&c!='='&&c!='<') return getC();
    return c;
}

void get(int l,int r){
    if(l>=r) return;
    int pos=mt()%(r-l+1)+l,rpos=r,lpos=l+1,i,min;
    std::swap(id[pos],id[l]);
    printf("? "),print(id[l]);cout<<endl;
    while(getC()!='='){printf("? "),print(id[l]);cout<<endl;}
    for(i=l+1;i<=r;++i){
        printf("? "),print(id[i]);cout<<endl;
        if(getC()=='<') cp[lpos++]=id[i];
        else cp[rpos--]=id[i];
        printf("? "),print(id[l]);cout<<endl;getC();
    }
    val[l]=0;
    for(i=l+1;i<=r;++i) id[i]=cp[i];
    get(l+1,lpos-1);
    get(lpos,r);
    for(i=l+1,min=-0x3f3f3f3f;i<lpos;++i) min=std::max(min,val[i]);
    for(i=l+1;i<lpos;++i) val[i]+=-min-1;
    for(i=lpos,min=0x3f3f3f3f;i<=r;++i) min=std::min(min,val[i]);
    for(i=lpos;i<=r;++i) val[i]+=-min+1;
    return;
}

void solve(){
    int i,min;
    int n=read();
    for(i=1;i<=n;++i) id[i]=i,val[i]=res[i]=0;
    get(1,n);
    for(i=1,min=0x3f3f3f3f;i<=n;++i) min=std::min(min,val[i]);
    for(i=1;i<=n;++i) val[i]+=-min+1;

    for(i=1;i<=n;++i) res[id[i]]=val[i];
    printf("! ");
    for(i=1;i<=n;++i) print(res[i]),putchar(' ');
    cout<<endl;
    return;
}

int main(){

    int T=read();
    while(T--) solve();

    return 0;
}
```
