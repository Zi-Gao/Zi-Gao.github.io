---
title: "CF226E Noble Knight's Path 题解"
slug: "ceivd4ec"
description: "前言 这道题思维难度其实不难，难度在代码实现的方式。而我在这提供一个需要费点脑子但是好写一些的实现方式。这样做可以节约很多比赛时间，毕竟比赛做题用时越少越好。 正文 0x01 问题分析 根据题面，得出…"
date: "2023-07-15T06:21:59.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/ceivd4ec"
sourceCategory: "题解"
sourceSha256: "c403a51061ffe1e79172698735b1a51de578c65c8a4e60ef493ea80704a87617"
---
## 前言

这道题思维难度其实不难，难度在代码实现的方式。而我在这提供一个需要费点脑子但是好写一些的实现方式。这样做可以节约很多比赛时间，毕竟比赛做题用时越少越好。

## 正文

### 0x01 问题分析

根据题面，得出需要在一个树上维护两个操作：

1. 标记某个点。

2. 查询在某个时刻，某两个点之间第 $k$ 个没有被标记的店。

显然可以用树链剖分+主席树解决，主席树维护某个区间在某个时间点被标记的数量。然后由于一个点不会被标记两次，故使用前缀和思想，**这段时间内被标记的数量=当前被标记的数量- $y$ 这个时刻被标记的数量**。

那么二分去找第 $k$ 个没有被标记的点即可。但是直接二分时间复杂度会达到 $\mathcal{O}\left(n\log ^3 n\right)$ ，但是可以考虑 **先从当前节点走一些重链，最后在一个重链里面二分** $\mathcal{O}\left(n\log ^2 n\right)$ 。

### 0x02 代码实现


首先处理 $k$ 不包含 $a$ 和 $b$ 两个端点的问题，这里可以对 $k$ 加上 $1$ 如果 $a$ 没有被标记的话，被标记则不管。这样处理可以直接在 $a$ $b$ 两个点之间二分。

其次我们并不需要像其他题解一样记录下路径上的重链剖分结果，可以考虑先找出他们的lca，计算 $a$ 到 $b$ 、 $a$ 到 $lca$ 上没有被标记的数量，然后进行判断在那一段上还是无解。若在 $a$ 到 $lca$ 这段上，直接网上二分到第 $k$ 个没有被标记的点；若在 $b$ 到 $lca$ 这段上，可以倒着二分，但是也可以先计算出第 $k$ 没被标记的点，在 $b$ 上面几个点，记为 $k_2$ 然后同样从 $a$ 向上二分即可。


```cpp
#include<cstdio>
#include<vector>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

int arr[100010];

#define PSEG_TREE_DATA_TYPE int

const int PSEG_DATA_SIZE=100010;
const int PSEG_SIZE=PSEG_DATA_SIZE*20;

struct PSEG_TREE_NODE{
    PSEG_TREE_DATA_TYPE data;
    int lChild,rChild;
};


//主席树模板
struct PSEG_TREE{
    PSEG_TREE_NODE tree[PSEG_SIZE];
    int root[PSEG_SIZE],tot;

    int getNewMem(){
        return tot++;
    }

    int build(int l,int r){
        int p=getNewMem();
        if(l==r)
            tree[p].data=0;
        else{
            int mid=(l+r)>>1;
            tree[p].lChild=build(l,mid);
            tree[p].rChild=build(mid+1,r);
            push_up(p);
        }
        return p;
    }

    int update(int pos,int s,int t,int old){
        int p=getNewMem();
        tree[p]=tree[old];
        if(s==t)
            tree[p].data=1;
        else{
            int mid=s+((t-s)>>1);
            if(pos<=mid) tree[p].lChild=update(pos,s,mid,tree[p].lChild);
            else tree[p].rChild=update(pos,mid+1,t,tree[p].rChild);
            push_up(p);
        }
        return p;
    }

    PSEG_TREE_DATA_TYPE query(int l,int r,int s,int t,int p){
        if(l<=s&&t<=r) return tree[p].data;
        int mid=s+((t-s)>>1);
        return ((l<=mid)?query(l,r,s,mid,tree[p].lChild):0)+((r>mid)?query(l,r,mid+1,t,tree[p].rChild):0);
    }

    void  push_up(int p){
        tree[p].data=tree[tree[p].lChild].data+tree[tree[p].rChild].data;
        return;
    }
}pseg;

std::vector<int> e[100010];

int n,cntid,depths[100010],cnttree[100010],id[100010],sid[100010],parents[100010],linktop[100010],hson[100010];

void addEdge(int u,int v){
    e[u].push_back(v);
}

int uPseg(int pos,int version){
    return pseg.update(pos,1,n,pseg.root[version]);
}

int qPseg(int l,int r,int version,int now){
    return r-l+1-pseg.query(l,r,1,n,pseg.root[now])+pseg.query(l,r,1,n,pseg.root[version]);
}

void dfsinit(int u,int p){
    parents[u]=p;
    depths[u]=depths[p]+1;
    cnttree[u]=1;
    for(auto v:e[u])
        if(v!=p){
            dfsinit(v,u);
            cnttree[u]+=cnttree[v];
            if(cnttree[hson[u]]<cnttree[v])
                hson[u]=v;
        }
}

void dfslink(int u,int top){
    id[u]=++cntid;
    sid[id[u]]=u;
    linktop[u]=top;
    if(!hson[u]) return;
    dfslink(hson[u],top);
    for(auto v:e[u])
        if(v!=parents[u]&&v!=hson[u])
            dfslink(v,v);
}

int getLca(register int u,register int v){
    while(linktop[u]!=linktop[v]){
        if(depths[linktop[u]]<depths[linktop[v]]) u^=v^=u^=v;
        u=parents[linktop[u]];
    }
    if(depths[u]>depths[v]) u^=v^=u^=v;
    return u;
}

int rangeQuery(int u,int v,int version,int now){
    register int res=0;
    while(linktop[u]!=linktop[v]){
        if(depths[linktop[u]]<depths[linktop[v]]) u^=v^=u^=v;
        res+=qPseg(id[linktop[u]],id[u],version,now);
        u=parents[linktop[u]];
    }
    if(depths[u]>depths[v]) u^=v^=u^=v;
    res+=qPseg(id[u],id[v],version,now);
    return res;
}

int search(int u,int val,int version,int now){
    //先向上走重链
    while(qPseg(id[linktop[u]],id[u],version,now)<val&&u) val-=qPseg(id[linktop[u]],id[u],version,now),u=parents[linktop[u]];
    register int l,r,mid;
    l=id[linktop[u]],r=id[u];
    //二分剩下一截
    val=qPseg(id[linktop[u]],id[u],version,now)-val+1;
    while(l<r){
        mid=(l+r)>>1;
        if(qPseg(id[linktop[u]],mid,version,now)<val) l=mid+1;
        else r=mid;
    }
    return sid[l];
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register char op;
    register int i,val,root,u,v,version,lca,all,left;
    n=read();

    for(u=1;u<=n;++u){
        v=read();
        if(v){
            addEdge(u,v);
            addEdge(v,u);
        }else root=u;
    }

    dfsinit(root,0);
    dfslink(root,root);

    pseg.root[0]=pseg.build(1,n);

    int q=read();
    for(i=1;i<=q;++i){
        op=read();
        if(op==1)
            pseg.root[i]=uPseg(id[read()],i-1);
        else{
            pseg.root[i]=pseg.root[i-1];
            u=read();
            v=read();
            val=read();
            version=read();

            //技巧性处理
            val+=qPseg(id[u],id[u],version,i);
            lca=getLca(u,v);
            all=rangeQuery(u,v,version,i);
            left=rangeQuery(u,lca,version,i);

            //注意无解判断方式
            if((all<=val&&qPseg(id[v],id[v],version,i))||(all<val))
                puts("-1");
            else{
                if(val<=left)//a到lca一段
                    print(search(u,val,version,i));
                else{//b到lca一段
                    val=all-val+1;
                    print(search(v,val,version,i));
                }
                putchar('\n');
            }
        }
    }

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```