## 题意

给定平面上 $n$ 个点和 $a$。设 $P(a,0),Q(-a,0)$。要求找出一条直线 $l$ 过至少两个给定点，最小化 $\max\{ |PX-QX|\},X\in l$。

$n\le10^5,a\le 10^4$。

## 题解

### 计算

首先我们来看看，假如确定某两个点 $\max\{ |PX-QX|\},X\in l$ 这个东西是怎么算的，根据将军饮马的知识

![](https://cdn.luogu.com.cn/upload/image_hosting/ly64r0hd.png)

第一种情况 $PQ$ 在 $l$ 同侧，观察 $\Delta PQX$ 可得，$PX-QX\leq PQ$，所以可得，$\max\{ |PX-QX|\}=PQ,X\in l$。

![](https://cdn.luogu.com.cn/upload/image_hosting/2uhfpoca.png)

第二种情况 $PQ$ 在 $l$ 异侧，故做 $P$ 关于 $l$ 的对称点 $P'$，观察 $\Delta P'QX$ 可得，$PX-QX=P'X-QX\leq P'Q$，所以可得，$\max\{ |PX-QX|\}=P'Q,X\in l$。

### 解题

由于答案最大就是 $2a$，所以不需要特别考虑第二种情况。现在只计算第一种情况，最大最小值直接套路用二分答案，若当前二分 $mid$ 这个答案，考虑怎么 check。这样二分的几何意义就是某一个 $P'$ 点在以 $Q$ 为圆心，半径为 $mid$ 圆内，记这个圆为圆 $Q$。进而考虑 $P'$ 怎么转化，就是以 $A$ 为圆心 $AP$ 为半径的圆和以 $B$ 为圆心 $BP$ 为半径的圆的其中一个交点，分别记为圆 $A,B$，那么这样转化的好处是把 $A,B$ 贡献拆分开了，两个圆是独立的。现在记圆 $Q$ 在圆 $A,B$ 内的弧分别为 $\overset{\LARGE{\frown}}{A},\overset{\LARGE{\frown}}{B}$，那么两个圆的交点在 $Q$ 可以转化为 $\overset{\LARGE{\frown}}{A}$ 和 $\overset{\LARGE{\frown}}{B}$ 是有交，但是可能圆 $A,B$ 是包含关系，所以 $\overset{\LARGE{\frown}}{A}$ 和 $\overset{\LARGE{\frown}}{B}$ 不能是包含关系。这个很好判和括号序差不多，求出圆 $A,B$ 和圆 $Q$ 的交点和圆心到交点的向量幅角，用栈判断就可以了。这个过程不好理解可以看我[画的 GeoGebra](https://www.geogebra.org/m/pcsmpk8k)。

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
inline __attribute((always_inline)) INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){if(x<0)x=-x,putchar('-');if(x>9)print(x/10);putchar(x%10^48);return;}

struct point{
	double x,y;
	point operator + (const point &o) const {return {x+o.x,y+o.y};}
	point operator - (const point &o) const {return {x-o.x,y-o.y};}
	point operator * (const double &o) const {return {x*o,y*o};}
};

struct circle{
	point o;
	double r;
}a[100010];

double moo(point a){return std::sqrt(a.x*a.x+a.y*a.y);}
double dist(point a,point b){return moo(a-b);}
point unit(point a){return a*(1.0/moo(a));}
double polarAngle(point a){return atan2(a.y,a.x);}

auto intersect(circle a,circle b){
	double d=dist(a.o,b.o);
	double x=(a.r*a.r+d*d-b.r*b.r)/(d*2);
	double z=std::sqrt(a.r*a.r-x*x);
	point u=unit(b.o-a.o);
	point mid=a.o+u*x;
	std::swap(u.x,u.y),u.x*=-1;
	return std::make_pair(mid+u*z,mid-u*z);
}

point p,q;
int n;

bool check(double mid){
	register int i;
	register double d;
	std::vector<std::pair<double,int>> vec;
	std::stack<int> S;
	circle o={p,mid};
	for(i=0;i<n;++i){
		d=dist(o.o,a[i].o);
		if(o.r+a[i].r>d&&fabs(o.r-a[i].r)<d){
			auto tmp=intersect(o,a[i]);
			vec.push_back({polarAngle(tmp.first-o.o),i});
			vec.push_back({polarAngle(tmp.second-o.o),i});
		}
	}
	std::sort(vec.begin(),vec.end());
	for(auto val:vec)
		if(S.empty()||S.top()!=val.second) S.push(val.second);
		else S.pop();
	return !S.empty();
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

	register int i;
	register double l,r,mid;
	n=read();
	int aa=read();

	p.x=aa,q.x=-aa;

	for(i=0;i<n;++i) a[i].o.x=read(),a[i].o.y=read(),a[i].r=dist(a[i].o,q);
	l=0,r=dist(p,q);
	for(i=0;i<50;++i){
		mid=(l+r)/2;
		if(check(mid)) r=mid;
		else l=mid;
	}

	printf("%.10lf",l);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```