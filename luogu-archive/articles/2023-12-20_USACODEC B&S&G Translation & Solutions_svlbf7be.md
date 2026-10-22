# Bronze

## Problem 1. Candy Cane Feast

> 题意：
> 给定 $n$ 头和 $m$ 个糖果，每头牛有个身高 $h_i$，每个糖果有个长度 $c_i$。这 $m$ 个糖果依次被吃，吃第 $i$ 个糖果时，这个糖果会被挂起来，每一个单位的糖果看成一小节，最低的一段是第一段，最高的一段是第 $m$ 段，然后 $n$ 个牛依次来尝试吃掉这个糖果的底部一些，设当前吃到了第 $k$ 段，那么若这头牛的当前身高 $h_j\le k$ 他就可以吃到 $\min\left(c_i,h_j\right)-k+1$ 段糖果，并且身高增加这么多，然后吃掉的糖果消失。问最后每头牛有多高。
> $n,m\leq 2\cdot 10^5$ 以及 $1\leq h_i,c_i\leq 10^9$。

有点诈骗，题面可能有点绕。需要观察到一个性质，对于第一头牛：

1. 要么把这个糖吃完，后面的牛都没得吃。
2. 要么没吃完，但是他的身高增加了一倍，然后后面的牛继续吃。

观察到第二种情况最多出现 $\mathcal{O}\left(\log V\right)$ 次，所以考虑直接暴力求解，并且在糖被吃完时及时跳出循环即可。

```cpp
#include<bits/stdc++.h>
#define int long long
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

long long h[200010],c[200010];

signed main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,j,nowl,nowr,tmp;
    int n=read();
    int m=read();

    for(i=1;i<=n;++i) h[i]=read();

    for(i=1;i<=m;++i){
        nowl=1,nowr=read();
        for(j=1;j<=n&&nowl<=nowr;++j)
            if(h[j]>=nowl){
                tmp=h[j]+1;
                h[j]+=std::min(h[j],nowr)-nowl+1;
                nowl=tmp;
            }
    }

    for(i=1;i<=n;++i) print(h[i]),putchar('\n');

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```

## Problem 2. Cowntact Tracing 2

> 题意：
> 
> 给了 $n$ 头牛排成一列，最初在某一天有一些牛感染了病毒，每天感染了的牛都一定会向其左边和右边的牛（如果有的话）传染，并且一定传染成功，已经感染的牛二次感染也没有变化。现在给定结束状态哪些牛感染了，请你求出初始状态最少被感染的牛数量。
> 
> $n\leq 3\cdot 10^5$

下文中把一个牛扩散出去的传染也叫做传染，即 $A$ 牛传染了 $B$ 牛，$B$ 牛传染了 $C$ 牛，也成为 $A$ 牛传染了 $C$ 牛。贪心地想，每头最初被感染的牛一定要传染扩撒最多的牛这样才能找到最优的答案，也就是最多传染多少天，但是由于有边界的牛为了方便，考虑找到每头牛可能最多传染的天数。先将结束状态的感染的牛划分成若干个连续段，自然每个连续段内的牛只可能是是被这个连续段内的牛传染的，不妨设当前连续段的长度为 $len$ 然后依次只每个连续段内的牛可以最多传染天 $k$：

1. 当前连续段紧贴着边界时，那么挨着边界的那头牛可以连续传染 $k_{max}=len-1$ 天。
2. 其他情况时最中间的牛可以连续传染 $k_{max}=\lfloor\frac{len-1}{2}\rfloor$ 天。

然后把这些段全部合起来考虑，肯定要满座每个段的情况，把所有的 $k_{max}$ 取最小，记 $A=min\left(k_{max}\right)$。那么这就是最多经过的天数了。考虑计算答案，还是按照连续段考虑，这时每头牛最多传染 $2A$ 头牛，包含他自己就是一共 $2A+1$ 头牛，还是贪心考，让每个最初感染的牛都把这 $2A+1$ 头牛取满，于是对于一个长度为 $len$ 的连续段最初的牛最少有 $\lceil\frac{len}{2A+1}\rceil$。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

std::vector<int> vals;

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register char c;
    register int i,cnt=0,cnt0=0,min=0x3f3f3f3f,res=0,fir=0x3f3f3f3f,lat=0x3f3f3f3f;
    int n=read();

    for(i=1;i<=n;++i){
        loop:c=getchar();
        if(c!='0'&&c!='1') goto loop;
        if(c=='0'){
            if(cnt){
                if(!cnt0) fir=cnt;
                else vals.push_back(cnt);
            }
            cnt=0;
            ++cnt0;
        }else ++cnt;
    }

    if(cnt) lat=cnt;

    min=std::min(lat-1,fir-1);

    for(auto val:vals) min=std::min((val-1)/2,min);

    if(fir!=0x3f3f3f3f) vals.push_back(fir);
    if(lat!=0x3f3f3f3f) vals.push_back(lat);

    for(auto val:vals) res+=(val+(min*2+1)-1)/(min*2+1);

    print(res);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```

## Problem 3. Farmer John Actually Farms

> 题意：
> 有 $n$ 株植物，初始高度为 $h_i$，并且每天长 $a_i$。现在给了一些限制，问存不存在一天使得满足每个限制，给出最小解，其中每个限制是要第 $i$ 株植物比其他 $t_i$ 株植物高。
> $n,m\leq 2\cdot 10^5$ 以及 $1\leq h_i,c_i\leq 10^9$ 并且 $t_i$ 互不相同。

发现这个限制就是再说按高度排序后第 $i$ 株植物排在第 $t_i$ 位，那么不妨先把这个按高度排序后的植物数组处理出来，现在就只需要考虑相邻两个植物的高度关系即可，设符合条件在第 $x$ 天，设 $i$ 和 $j$ 相邻，要求 $i$ 比 $j$ 高：

1. $h_i\geq h_j$ 要求 $h_i+a_ix\gt h_j+a_jx$ 也就是 $x\gt \frac{h_i-h_j}{a_j-a_i}$。
2. $h_i\leq h_j$ 同理可得 $x\lt \frac{h_j-h_i}{a_i-a_j}$。

还有一些边界情况细节见代码。那么可以得到 $x$ 的上界和下界，若有解就是下界小于等于上界，输出下界即可。

我的实现有点垃圾。

```cpp
#include<bits/stdc++.h>
#define int long long
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

int h[200010],a[200010],p[200010],t[200010];

long long abss(long long x){return x<0?-x:x;}

long long floor_(long long a,long long b);

long long ceil_(long long a,long long b){
    if(a>=0&&b>=0) return (a+b-1)/b;
    else if(a<0&&b<0) return ((-a)+(-b)-1)/(-b);
    else return -floor_(abss(a),abss(b));
}

long long floor_(long long a,long long b){
    if(a>=0&&b>=0) return a/b;
    else if(a<0&&b<0) return (-a)/(-b);
    else return -ceil_(abss(a),abss(b));
}

void solve(){
    register int i,l=0,r=0x3f3f3f3f3f3f3f3fll,j;
    int n=read();
    for(i=0;i<n;++i) h[i]=read();
    for(i=0;i<n;++i) a[i]=read();
    for(i=0;i<n;++i) p[t[i]=read()]=i;
    for(i=0;i<n;++i){
        if(t[i]==n-1) continue;
        j=p[t[i]+1];
        if(h[i]>h[j]){
            if(a[i]>=a[j]) continue;
            else{
                if((h[i]-h[j])%(a[j]-a[i])) r=std::min(r,floor_(h[i]-h[j],a[j]-a[i]));
                else r=std::min(r,floor_(h[i]-h[j],a[j]-a[i])-1);
            }
        }else if(h[i]<h[j]){
            if(a[i]<=a[j]){
                r=std::min(r,-1ll);
                continue;
            }else{
                if((h[j]-h[i])%(a[i]-a[j])) l=std::max(l,ceil_(h[i]-h[j],a[j]-a[i]));
                else l=std::max(l,ceil_(h[i]-h[j],a[j]-a[i])+1);
            }
        }else{
            if(a[i]>a[j]) l=std::max(l,1ll);
            else r=std::min(r,-1ll);
        }
    }
    if(l<=r) print(l);
    else print(-1);
    return putchar('\n'),void();
}

signed main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    int T=read();
    while(T--) solve();

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```

# Silver

## Problem 1. Bovine Acrobatics

> 题意：
> 给你 $n$ 种牛，每种牛有 $a_i$ 个，同种牛的重量都相同为 $w_i$，现在牛要叠牛塔，每座牛塔都是由若干个牛叠成，并且要求相邻两头牛在上面和下面的重量分别为 $a,b$，要求满足 $a\leq b+k$ 其中 $k$ 是给定常数。现在要叠 $m$ 做牛塔，问最多由多少头牛参与叠塔。
> $n\leq 3\cdot 10^5$ 并且 $a_i,b_i\leq 10^9$

我猜你在想 `dp`，实际上这个题很像是一个 `dp`我一开始也这样想的，但是不会。放开思路，不妨考虑贪心，先按照牛种类的重量从大到小排序，依次考虑，并且维护当前由多少座牛塔可以往上叠设为 $m$，贪心地想现在 $v_i$ 头牛要尽可能的叠上去，那么肯定会选出 $\min\left(v_i,m\right)$ 头牛放在塔顶上，然后 $m$ 减少这么多。如何实现呢？双指针，一个指针指着当前考虑的牛种类，另一个指针 $j$ 指着比当前牛重量大 $k$ 的重量的牛，对于每个牛种类记录选中了多少个放在塔顶 $cho_i=\min\left(v_i,m\right)$ 当另一个指针挪动时，说明这个种类的牛以成为的塔顶的塔以及可以被现在的牛拿去继续叠了，所以 $m$ 加上 $cho_j$。

```cpp
#include<bits/stdc++.h>
#define int long long
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

struct COW{
    int w,v;
    bool operator < (const COW o) const{
        return (w==o.w)?(v<o.v):(w<o.w);
    }
}cows[500010];

int dp[500010];

signed main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,j,ans=0;
    int n=read();
    int m=read();
    int k=read();

    for(i=1;i<=n;++i){
        cows[i].w=read();
        cows[i].v=read();
    }

    std::sort(cows+1,cows+1+n);

    for(i=n,j=n+1;i;--i){
        while(cows[j-1].w-cows[i].w>=k) m+=dp[--j];
        ans+=(dp[i]=std::min(m,cows[i].v));
        m-=dp[i];
    }

    print(ans);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```

## Problem 2. Cycle Correspondence

> 题意：
> 
> 给定一个有且仅有一个 $k$ 元环 $n$ 个点的无向图，然后给这个图每个点标了两次号，分别是 $a_i,b_i$ 保证 $a_i,b_i$ 各自形成一个排列。然后依次按照某个顺序（顺时针或者逆时针）给出了这个环上没个点的两个编号，两次给出的标号顺序起点终点方向都可能不同，但是相邻两个给出点的一定在图上也相邻，问最多有多少个两次编号是同一个。
> 
> $n,k\leq 2\cdot 10^5$

从暴力出发，考虑固定第一个编号，然后枚举第二个编号的起点和方向，可以得到一个 $\mathcal{O}\left(n^2\right)$ 的做法。然后就可以考虑先固定第二个编号的方向，只考虑起点，会发现对于每个 $b_i$ 只会在唯一一个起点处贡献 $1$ 的重复，直接计算出来求个和就好了。注意不在环上的点编号还是可能是重复的，再算一下就好了。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

char used[500010];
int pos[500010],a[500010],b[500010],cnt[500010];

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,res=0;
    int n=read();
    int k=read();

    memset(pos,-1,sizeof(pos));

    for(i=0;i<k;++i){
        pos[a[i]=read()]=i;
        ++used[a[i]];
    }

    for(i=0;i<k;++i){
        b[i]=read();
        ++used[b[i]];
        if(~pos[b[i]])
            ++cnt[(i-pos[b[i]]+k)%k];
    }

    for(i=0;i<k;++i)
        res=std::max(res,cnt[i]),cnt[i]=0;

    for(i=0;i<k;++i){
        if(~pos[b[i]])
            ++cnt[((k-i-1)-pos[b[i]]+k)%k];
    }

    for(i=0;i<k;++i)
        res=std::max(res,cnt[i]),cnt[i]=0;

    for(i=1;i<=n;++i)
        if(!used[i])
            ++res;

    print(res);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```

## Problem 3. Target Practice

> 题意：
> 
> 给一个数轴，上面有 $n$ 个目标分别在 $pos_i$ 的位置，然后有一个人首先站在原点，会依次执行 $m$ 个操作，每个操作可能是
> 
> 1. 向左移动 $1$ 单位。
> 2. 向右移动 $1$ 单位。
> 3. 开火，若这个地方有目标，则目标被摧毁，不能摧毁已经摧毁的目标
> 
> 但是现在要求把其中一个操作换成另一个不同的操作，问最多可以摧毁多少个目标。
> 
> $n\leq 10^5,m\leq pos_i\leq m$ 并且 $pos_i$ 互不相同

不妨先考虑去除一段前缀或者后缀操作最多摧毁多少个目标，显然可以维护一个桶 $buc_i$ 表示在 $buc_i$ 这个位置经过了多少次，若当前是第一次经过这个位置然后开火了，并且这里有个目标则会多摧毁一个目标。考虑枚举哪个位置的操作被修改，然后可以把问题转化为把前后两端操作的贡献合并起来，然后单独考虑这个位置的贡献，实际上可以使用 `bitset` 可以在 $\mathcal{O}\left(\frac{n}{w}\right)$ 的时间复杂的内对两个 `bitset` 求按位与、或、异或操作，以及对一个 `bitset` 求多少个位置值为 $1$。可以从后往前考虑，对于前缀每次减少一个操作出去并维护前缀经过位置的桶，以及可以打中的目标的 `bitset`，然后对于后缀，由于修改操作可能导致后缀位置发生集体偏移但是偏移绝对值不会超过 $2$ 维护同样一个桶和 $5$ 个 `bitset` 表示不同偏移量可以打中的目标，然后把前后缀对应两个桶求按位于，然后求多少个位置值为 $1$ 即可算出当前答案，时间复杂度 $\mathcal{O}\left(\frac{n^2}{w}\right)$。

这样做题有点对不起题目的意思，只是出题人不小心放过了这个算法。那就给出一个线性做法，还是仿照前面的过程，只不过动态维护前缀桶和 `bitset` 与每一个后缀 `bitset` 的并，以及每个 `bitset` 的并的答案，可以发现每次最多使桶内和每个 `bitset` 内一个值发生变化，只把这个变化领出来即可，那么答案变化也可以维护。

你说得对，但是我写的 $bitset$ 。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

char opers[500010];
int pos[500010],buc[500010],tar[500010];

std::bitset<100010> pre,suf[5],tmp;

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,j,B,ans;
    int T=read();
    int C=read();
    B=140000;

    for(i=1;i<=T;++i) tar[read()+B]=i;
    scanf("%s",opers+1);

    for(i=1,pos[0]=B;i<=C;++i)
        if(opers[i]=='L') pos[i]=pos[i-1]-1;
        else if(opers[i]=='R') pos[i]=pos[i-1]+1;
        else{
            ++buc[pos[i]=pos[i-1]];
            if(tar[pos[i]]) pre[tar[pos[i]]]=1;
        }

    ans=pre.count();

    for(i=C;i;--i){
        if(i>1&&opers[i]=='F'){
            --buc[pos[i]];
            if(buc[pos[i]]==0&&tar[pos[i]]!=0) pre[tar[pos[i]]]=0;
        }
        if(opers[i]=='L'){
            ans=std::max(ans,(int)((suf[4]|pre).count()));

            tmp=(suf[3]|pre);
            if(tar[pos[i-1]]!=0) tmp[tar[pos[i-1]]]=1;
            ans=std::max(ans,(int)(tmp.count()));
        }else if(opers[i]=='R'){
            ans=std::max(ans,(int)((suf[0]|pre).count()));

            tmp=(suf[1]|pre);
            if(tar[pos[i-1]]!=0) tmp[tar[pos[i-1]]]=1;
            ans=std::max(ans,(int)(tmp.count()));
        }else ans=std::max({ans,(int)((suf[1]|pre).count()),(int)((suf[3]|pre).count())});
        if(opers[i]=='F')
            for(j=-2;j<=2;j++)
                if(tar[pos[i]+j]!=0) suf[j+2][tar[pos[i]+j]]=1;
    }

    print(ans);

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```

# Gold

## Problem 1. Flight Routes

> 题意：
> 
> 给定一个 $n$ 个点的 DAG，并且有向边一定从编号小的点连向编号大的点，现在给出了两两间路径条数的奇偶性，问原图有多少条连边，可以证明答案唯一确定。
> 
> $n\leq 750$

首先你需要知道如何求解这个问题的逆向问题，即给定一个这样的图，输出两两点连边的奇偶性，显然考虑一个 dp，设 $dp_{u,v}$ 表示 $u$ 和 $v$ 号点之间的连边奇偶性，显然有递推式子 $dp_{u,v}=\sum_{u\rightarrow w}dp_{w,v} \bmod2$。

然后考虑简化问题，只有两个点的时候怎么办？显然奇偶性为 $1$ 就是有边，否则没边。可以发现在原图扩张时由于 $n-1$ 号点只可能和 $n$ 点连边，这个性质仍然成立，这样就确定了一条边。继续考虑确定剩下的边，不妨先考虑 $n-2$ 号点和 $n-1$ 号点的连边情况，由于这两个点至多有一条连边，所以这条边的情况一可以直接确定。这时若有连边，那么 $n-2$ 号点就能通过 $n-1$ 号点尝试到达 $n$ 号点，然后就可以像上面的 dp 式子一样逆向转移一下，把这个点的贡献减出去，就可以少考虑一个点了。进而会发现当前 $n-2$ 号点到 $n$ 号点的其他路径已经确认完毕了，就剩是否直连的情况，在 dp 式子逆向转移后 $dp_{n-2,n}=1$ 那么肯定有边 $n-2\rightarrow n$ 了。不妨把这个解决过程推广到全图，从编号大的点倒序考虑，递推出来所有的连边情况。

用 `bitset` 实现的，因为可以发现逆向转移实际上就是在做一个异或。

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

std::bitset<750> e[750],sour[750];

int main(){

    register char c;
    register int i,j,res=0;
    int n=read();
    for(i=0;i<n;++i){
        for(j=i+1;j<n;++j){
            loop:c=getchar();
            if(c!='0'&&c!='1') goto loop;
            sour[i][j]=e[i][j]=c-'0';
        }
    }

    for(i=n-1;~i;--i)
        for(j=i+1;j<n;++j)
            if(e[i][j]){
                ++res;
                e[i]=e[i]^sour[j];
            }

    print(res);

    return 0;
}
```

## Problem 2. Minimum Longest Trip

> 题意：
> 
> 给定 $n$ 个点 $m$ 条边的的带边权 DAG，问原图从每个点出发的最长路径上，由边权依次组成的字符串字典序最小的路径，求出这个路径长度和边权和。注意路径长度是不带权路径，即只计算路径条数。
> 
> $n\leq 2\cdot 10^5,m\leq 4\cdot10^5,l_i\leq 10^9\min$ 其中 $l_i$ 是边权。

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

## Problem 3. Haybale Distribution

> 题意：
> 
> 给定一条数轴上面有 $n$ 个点，分别在 $x_i$ 的位置。定义数轴上两个点 $x,y$（这里是坐标，不是下标）之间运输成本 $W_{x,y}$ 为。
> 
> $$
> W_{x,y}=
> \begin{cases}
> a\cdot\left(y-x\right), & x\leq y,\\
> b\cdot\left(x-y\right), & x\gt y
> \end{cases}

> $$
> 
> 其中 $a,b$ 为给定常数。现在有 $q$ 次询问每次询问给定一组 $a,b$ 询问互相独立，你要求一个点 $y$（也是坐标，不一定是给定的点上） 最小化 $\sum_{i=1}^{n} W_{y,x_i}$。
> 
> $n\leq 2\cdot 10^5,1\leq a,b \leq 10^6$

固定一组 $a,b$ 时，定义函数 $f\left(y\right)=\sum_{i=1}^{n} W_{y,x_i}$ 发现这个函数具有单峰性，具体来说两边大，中间小，所以可以三分解决。

关于三分的正确性，若三分有平台，即函数连续相同段，有些时候不能三分解决，但是若平台只出现在峰的顶端可以三分解决，其他地方若也有平台则无法三分解决。这道题的函数的平台只会在峰顶出现。

不太会三分，写的二分（别喷

```cpp
#include<bits/stdc++.h>
#define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

long long a,b,presum[1000100],cnt[1000100];
long long check(int pos){
    return (cnt[pos]*pos-presum[pos])*a+(presum[1000100-1]-presum[pos]-(cnt[1000100-1]-cnt[pos])*pos)*b;
}

int main(){
    #ifndef ONLINE_JUDGE
    freopen("name.in", "r", stdin);
    freopen("name.out", "w", stdout);
    #endif

    register int i,l,r,mid,x,q;
    register long long res;
    int n=read();

    for(i=1;i<=n;++i){
        x=read()+20;
        presum[x]+=x,cnt[x]+=1;
    }

    for(i=1;i<1000100;++i) presum[i]+=presum[i-1],cnt[i]+=cnt[i-1];

    q=read();
    while(q--){
        a=read();b=read();
        l=15,r=1000030;
        while(l+2<r){
            mid=(l+r)>>1;
            if(check(mid)>check(mid+1))
                l=mid+1;
            else r=mid;
        }
        for(res=0x3f3f3f3f3f3f3f3fll,i=l-5;i<=l+5;++i) res=std::min(res,check(i));
        print(res),putchar('\n');
    }

    #ifndef ONLINE_JUDGE
    fclose(stdin);
    fclose(stdout);
    #endif
    return 0;
}
```