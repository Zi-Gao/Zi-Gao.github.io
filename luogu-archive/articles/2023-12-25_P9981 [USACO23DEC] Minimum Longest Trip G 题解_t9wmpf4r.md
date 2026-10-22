> 题意：
>
> 给定 $n$ 个点 $m$ 条边的的带边权 DAG，问原图从每个点出发的最长路径上，由边权依次组成的字符串字典序最小的路径，求出这个路径长度和边权和。注意路径长度是不带权路径，即只计算路径条数。
>
> $n\leq 2\cdot 10^5,m\leq 4\cdot10^5,l_i\leq 10^9$ 其中 $l_i$ 是边权。

考虑拓扑排序然后 dp，但是由于有相同的边权不能直接 dp，因为你无法判断这个这个字符串是否更优，一个暴力的想法是记录转移，然暴力比较两个字符串，然后就能得到一个 $\mathcal{O}\left(n^2\right)$ 的做法。在这个过程中可以发现有大部分的操作是不必要的，因为比较两个字符串只需要比较他们的第一个不同的字符大小即可，找到这个字符的位置，就能快速比较。现在的问题就是如何找到两个字符串第一个不同的位置，可以考虑在转移上倍增，记录字符串哈希，倍增到第一个不同点然后去比较即可。

话说这是 CWOI 原题，太典了。实现上字符集太大了，有点不好字符串哈希，可以离散化下来然后哈希，这样字符集小了很多。

```cpp
#include<bits/stdc++.h>
using namespace std;
const long long mod=1000000093,base=1000639;
inline long long read(){
    long long x=0,f=1;char ch=getchar();
    while (!isdigit(ch)){if (ch=='-') f=-1;ch=getchar();}
    while (isdigit(ch)){x=x*10+ch-48;ch=getchar();}
    return x*f;
}
struct edge{long long v,w,nxt;}e[400010];
long long head[200010],tot,deg[200010],h[200010][24],pw[200010],p[200010][24],lst[200010];
void add(long long u,long long v,long long w){e[++tot]=(edge){v,w,head[u]},head[u]=tot,deg[v]++;}
struct Node{
    long long u,val,len,hsh,ans;
    bool operator <(const Node &x)const{
        if(len!=x.len)return len<x.len;if(val!=x.val)return val>x.val;long long a=u,b=x.u;
        for(long long i=23;i>=0;i--)if(p[a][i]!=0&&p[b][i]!=0&&h[a][i]==h[b][i])a=p[a][i],b=p[b][i];return lst[a]>lst[b];
    }
}f[200010];
Node max(Node x,Node y){return (x<y)?y:x;}
std::map<int,int> mp;
signed main(){
    long long n=read(),m=read();pw[0]=1ll;for(long long i=1;i<=n;i++)pw[i]=pw[i-1]*base%mod;
    for(long long i=1,u,v,w;i<=m;i++)u=read(),v=read(),mp[w=read()]=1,add(v,u,w);
    int iii=1;
    for(auto val:mp) mp[val.first]=++iii;
    queue<long long>q;for(long long i=1;i<=n;i++)if(deg[i]==0)q.push(i);
    while(!q.empty()){
        long long u=q.front();q.pop();
        for(long long i=head[u];i;i=e[i].nxt){;
            long long v=e[i].v,w=mp[e[i].w];f[v]=max(f[v],(Node){u,w,f[u].len+1,(f[u].hsh+w)*base%mod,f[u].ans+e[i].w});
            if((--deg[v])==0){q.push(v);p[v][0]=f[v].u,h[v][0]=lst[v]=f[v].val;for(long long j=1;j<=22;j++)p[v][j]=p[p[v][j-1]][j-1],h[v][j]=(h[p[v][j-1]][j-1]*pw[1<<(j-1)]+h[v][j-1])%mod;}
        }
    }
    for(long long i=1;i<=n;i++) printf("%lld %lld\n",f[i].len,f[i].ans);
    return 0;
}
```
