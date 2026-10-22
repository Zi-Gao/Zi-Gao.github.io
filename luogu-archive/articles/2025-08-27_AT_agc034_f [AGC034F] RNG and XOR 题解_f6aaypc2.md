约定下文中：

- $P,F,G,H$ 均表示集合幂级数。
- $P$ 集合是每一项是概率。
- 集合幂级数乘法是异或卷积。
- $S_1\oplus S_2$ 表示集合对称差，也就是异或。

如果 $P^{\prime}_{\emptyset}\not=0$ 会有自己转移到自己的情况，为了方便，钦定：

$$
\begin{equation}
P_S=
\begin{cases}
0& S=\emptyset\\
\frac{P^{\prime}_S}{1-P^{\prime}_{\emptyset}}& S\not=\emptyset
\end{cases}
\end{equation}
$$

每一步选到非空的期望是 $\frac{1}{1-P^{\prime}_{\emptyset}}$，所以答案乘上这个值即可。

设 $F_S$ 表示走到 $S$ 状态期望步数，列出转移：

$$
\begin{equation}
F_S=
\begin{cases}
0& S=\emptyset\\
1+\sum_T F_{S\oplus T}P_T& S\not=\emptyset
\end{cases}
\end{equation}
$$

观察转移中这个求和，考虑把求和消掉，考虑进行一个变换，设：

$$
\begin{equation}
G_S=
\begin{cases}
-1& S=\emptyset\\
P_S& S\not=\emptyset
\end{cases}
\end{equation}
$$

设 $H=F*G$，当 $S=\emptyset$，$F_{\emptyset}=\sum_S F_SP_S$，又观察到：

$$
\begin{align}\\
\sum_SF_S&=\sum_{S\not=\emptyset} \left( 1+\sum_T F_{S\oplus T}P_T \right)\\
\sum_SF_S&=2^n-1+\sum_S\left( F_S \sum_{T\not=S}P_T \right)\\
\sum_SF_S&=2^n-1+\sum_S F_S(1-P_S) \\
\sum_S F_SP_S&=2^n-1 \\
\end{align}
$$

当 $S\not=\emptyset$：

$$
\begin{align}
F_{S}&=-F_{S}+\sum_T F_{S\oplus T}P_T\\
&=-1
\end{align}
$$

整理得：

$$
\begin{equation}
H_S=
\begin{cases}
2^n-1& S=\emptyset\\
-1& S\not=\emptyset
\end{cases}
\end{equation}
$$

进行 FWT 变换，可以求得 $\tilde{G},\tilde{H}$，但由于 $\tilde{H}_{\emptyset}=\sum H_S=0$，所以无法直接求得 $\tilde{F}_{\emptyset}$，但是观察 FWT 过程发现 $2^nF_{\emptyset}=\sum \tilde{H}_S=0$，所以可以算出 $\tilde{F}_{\emptyset}$，逆最后变换就行。

```cpp
int i,j,l;
int n=read();
int maxs=1<<n;
mint sum=0,p0;
for(i=0;i<maxs;++i) sum+=(f[i]=read());
for(sum=sum.inverse(),i=0;i<maxs;++i) f[i]*=sum;
f[0]-=1;

for(l=1;l<maxs;l*=2) for(i=0;i<maxs;i+=l*2) for(j=0;j<l;++j)
    f[i+j]+=f[i+j+l],f[i+j+l]=f[i+j]-f[i+j+l]-f[i+j+l];
for(i=1;i<maxs;++i) f[i]=mint(maxs)/f[i],f[0]-=f[i];
for(l=1;l<maxs;l*=2) for(i=0;i<maxs;i+=l*2) for(j=0;j<l;++j)
    f[i+j]+=f[i+j+l],f[i+j+l]=f[i+j]-f[i+j+l]-f[i+j+l],f[i+j]/=2,f[i+j+l]/=2;

for(i=0;i<maxs;++i) print(f[i].get()),putchar('\n');
```

其实这个题形式和 [P5326 [ZJOI2019] 开关](https://www.luogu.com.cn/problem/P5326)差不多，而[题解 P5326 【[ZJOI2019]开关】 - 洛谷专栏](https://www.luogu.com.cn/article/20uwqk0w)提供的异或卷积做法十分易懂，同样也能用于此题。