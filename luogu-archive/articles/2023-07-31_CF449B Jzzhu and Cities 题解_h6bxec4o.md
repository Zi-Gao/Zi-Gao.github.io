## 前言

为什么大家写的这么麻烦。。。

## 正文

### 0x00 问题分析

要删去尽量多的边就要保留最少的边，那么要尽量少使用特殊边去松弛最短路。这里分类讨论一下：

1. 当前用于尝试松弛的边是特殊边

- $dis_u+w<dis_v$ 时，必须使用这个边松弛，否则无法保证正确答案。

- otherwise，不使用这个边。

2. 当前用于尝试松弛的边不是特殊边

- $dis_u+w<dis_v$ 时，必须使用这个边松弛，而且更优（用的特殊边更少）。

- $dis_u+w=dis_v$ 时，用这个边替换掉之前的边。

- otherwise，不使用这个边。

那么我们在堆内用多关键字排序：第一关键字——路径长度；第二关键字——边的类型。然后记录来时的边，最后统计即可。

### 0x01 代码实现

AC CODE

```cpp
#include<cstdio>
#include<vector>
#include<queue>
#include<cstring>
#include<bitset>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

struct EDGE{
    int to,type;
    long long w;
    bool operator < (const EDGE another) const{//多关键字
        return w==another.w?type>another.type:w>another.w;
    }
};

std::vector<EDGE> e[100010];
std::priority_queue<EDGE> Q;
void addEdge(int u,int v,int w,int type){e[u].push_back((EDGE){v,type,w});return;}
long long dis[100010];
int from[100010];
std::bitset<100010> vis;

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,u,v,res=0;
    register long long w;
    int n=read();
    int m=read();
    int k=read();
    for(i=0;i<m;++i){
        u=read();
        v=read();
        w=read();
        addEdge(u,v,w,0);
        addEdge(v,u,w,0);
    }

    for(i=0;i<k;++i){
        u=1;
        v=read();
        w=read();
        addEdge(u,v,w,1);
        addEdge(v,u,w,1);
    }

    memset(dis,0x3f,sizeof(dis));
    dis[1]=0;
    Q.push((EDGE){1,0,0});

    while(!Q.empty()){
        u=Q.top().to;
        Q.pop();
        if(vis[u]) continue;
        vis[u]=1;
        for(auto edge:e[u]){
            v=edge.to;
            w=edge.w;
            if((dis[u]+w<dis[v])){//分类讨论 - 必须使用
                from[v]=edge.type;
                dis[v]=dis[u]+w;
                Q.push((EDGE){v,edge.type,dis[v]});
            }else if((dis[u]+w==dis[v]&&edge.type==0))//进行替换
                from[v]=edge.type;
        }
    }

    for(i=1;i<=n;++i) res+=from[i];//统计

    print(k-res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```

## 后记

用我的做法，实际上这个题加强成任意特殊边都行。