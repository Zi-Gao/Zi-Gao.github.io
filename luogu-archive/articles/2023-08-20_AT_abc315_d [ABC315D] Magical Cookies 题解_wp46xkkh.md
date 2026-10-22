## 前言

这个题是我第一次在比赛上切这么高评分的题，感觉不难但是似乎很多人现场没切出来。

## 正文

### 0x00 题目分析

下文默认行和列为 $n m$,并且同阶。

这道题简洁明了啊，假如直接按照题意模拟。分析时间复杂度，每次执行程序最多减少一行和一列，那么最劣需要循环 $\mathcal{O}\left(n\right)$ 次，进而考虑循环内部如何实现，检查每一行每一列是否符合条件需要 $\mathcal{O}\left(n^2\right)$；标记时间复杂度需要 $\mathcal{O}\left(n\right)$ 到 $\mathcal{O}\left(n^2\right)$，此时时间复杂度已经到了 $\mathcal{O}\left(n^3\right)$。显然过不了。

考虑进行优化，可以发现实际上标记的时间复杂度并不是$\mathcal{O}\left(n^3\right)$ 的，均摊下来只有 $\mathcal{O}\left(n^2\right)$。进而考虑优化寻找符合条件的行和列，这个过程实际上再说这个行/列的元素中种类是否只有一个元素，并且元素个数大于 $2$，动态维护带删除，实际上可以考虑把每一行和每一列开一个桶，记录这一行这一列出现的 $26$ 个字母有哪些即可，这样遍历行和列只需要 $\mathcal{O}\left(26\right)$ 即可。最终时间复杂度 $\mathcal{O}\left(n^2\right)$。

### 0x01 代码实现

行列分开讨论十分啰嗦，可以考虑和在一起，就是开桶的时候前面放行的桶，后面放列的桶即可，这样一个循环即可。

AC CODE

```cpp
#include<bits/stdc++.h>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

std::bitset<2010> mark[2010];
std::vector<int> mk;
int cnt[4010][26];
char map[2010][2010];

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register char c;
    register int i,j,flag=0,flag2=0,res=0;
    int n=read();
    int m=read();

    for(i=0;i<n;++i)
        for(j=0;j<m;++j){
            loop:c=getchar();
            if(c<'a'||'z'<c) goto loop;
            map[i][j]=c-'a';
            ++cnt[i][map[i][j]];//把行和列记录在一起
            ++cnt[n+j][map[i][j]];
        }

    while(1){
        mk.clear();
        for(i=0;i<n+m;++i){
            flag=flag2=0;//flag:有多少个种类 flag2:有多少个元素
            for(j=0;j<26;++j)
                flag+=(cnt[i][j]?1:0),flag2+=cnt[i][j];
            if(flag==1&&flag2>=2)
                mk.push_back(i);//将要标记的
        }
        if(mk.empty()) break;
        for(auto i:mk)
            if(i>=n){//列的情况
                i-=n;
                for(j=0;j<n;++j)
                    if(!mark[j][i]){
                        mark[j][i]=1;
                        res-=1;
                        --cnt[j][map[j][i]];
                        --cnt[n+i][map[j][i]];
                    }
            }else//行的情况
                for(j=0;j<m;++j)
                    if(!mark[i][j]){
                        mark[i][j]=1;
                        res-=1;
                        --cnt[i][map[i][j]];
                        --cnt[n+j][map[i][j]];
                    }
    }

    print(n*m+res);

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
```