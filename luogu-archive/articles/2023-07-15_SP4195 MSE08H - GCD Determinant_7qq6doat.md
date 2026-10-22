已知 Smith Determinants 结论有：

$$
\begin{vmatrix}
\gcd\left(x_1,x_1\right) & \gcd\left(x_1,x_2\right) &  \cdots & \gcd\left(x_1,x_n\right) \\
\gcd\left(x_2,x_1\right) & \gcd\left(x_2,x_2\right) &  \cdots & \gcd\left(x_2,x_n\right) \\
\vdots & \vdots & \cdots & \vdots &   \\
\gcd\left(x_n,x_1\right) & \gcd\left(x_n,x_2\right) &  \cdots & \gcd\left(x_n,x_n\right) \\
\end{vmatrix} 
$$

$$
= \phi\left(x_1\right) \phi\left(x_2\right) \cdots \phi\left(x_n\right)
$$

此结论参见[此处论文](https://www.fq.math.ca/Scanned/30-2/beslin.pdf)。更加详细的讲解推荐 FFjet 博客 [ GCD 矩阵知多少](https://zhuanlan.zhihu.com/p/53447466)

AC CODE
```cpp
#include<cstdio>
#include<unordered_map>
#include<algorithm>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE long long
#define OUTPUT_DATA_TYPE long long
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

long long w[100010];
std::unordered_map<long long,long long> ump;

long long phi(register long long x){
	if(ump[x]) return ump[x];
	register long long i,res=x;
	register long long cp=x;
	for(i=2;i*i<=x;++i)
		if(x%i==0){
			res/=i;res*=(i-1);
			while(x%i==0) x/=i;
		}
	if(x>1) res/=x,res*=(x-1);
	ump[cp]=res;
	return res;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

	// int T=read();
    register int n,i;
    register long long t,ans;
    register const long long mod=1000000007;

    while(~scanf("%d",&n)){
        ans=1;  
        for(i=0;i<n;++i) t=read(),ans=ans*phi(t)%mod;
        print(ans);putchar('\n');
    }

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```