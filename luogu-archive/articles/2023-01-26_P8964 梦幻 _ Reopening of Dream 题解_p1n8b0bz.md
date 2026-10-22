我的理解就是：对于每一个人有一个“`//freopen(` 开头，以 `);` 结尾”就是见祖宗人；每一个都完全一样就是正常的；剩下的都是乐子人。代码很好写

```cpp
#include<cstdio>
#include<cstring>
#include<sstream>
// #define ONLINE_JUDGE
#define INPUT_DATA_TYPE int
#define OUTPUT_DATA_TYPE int
INPUT_DATA_TYPE read(){register INPUT_DATA_TYPE x=0;register char f=0,c=getchar();while(c<'0'||'9'<c)f=(c=='-'),c=getchar();while('0'<=c&&c<='9')x=(x<<3)+(x<<1)+(c&15),c=getchar();return f?-x:x;}void print(OUTPUT_DATA_TYPE x){register char s[20];register int i=0;if(x<0){x=-x;putchar('-');}if(x==0){putchar('0');return;}while(x){s[i++]=x%10;x/=10;}while(i){putchar(s[--i]+'0');}return;}

char chk[11]="//freopen(";

int getType(char *std1,char *std2,char *f1,char *f2,int len1,int len2){
    register int i;
    if((!std::strcmp(std1,f1))&&(!std::strcmp(std2,f2))) return 0;
    register char res1=1,res2=1;
    for(i=0;i<10;++i)
        res1&=(chk[i]==f1[i]);
    for(i=0;i<10;++i)
        res2&=(chk[i]==f2[i]);
    if(len1>1)
        res1&=(';'==f1[len1-1]);
    else
        res1=0;
    
    if(len2>1)
        res2&=(';'==f2[len2-1]);
    else
        res2=0;
    
    if(len1>2)
        res1&=(')'==f1[len1-2]);
    else
        res1=0;
    
    if(len2>2)
        res2&=(')'==f2[len2-2]);
    else
        res2=0;
    if(res1||res2) return 1;
    else return 2;
}

int main(){
	#ifndef ONLINE_JUDGE
	freopen("name.in", "r", stdin);
	freopen("name.out", "w", stdout);
	#endif

    register int i,j,watch;

    int T=read();

    int n=read();
    int m=read();

    char test[4][20];

    for(i=0;i<m;++i) scanf("%s",test[i]);

    for(i=0;i<n;++i){
        char flag[3]={0};
        for(j=0;j<m;++j){
            char freopens[2][110]={0},std[2][110]={0};
            std::stringstream ss[2];
            ss[0]<<"freopen(\""<<test[j]<<".in\",\"r\",stdin);";
            ss[1]<<"freopen(\""<<test[j]<<".out\",\"w\",stdout);";
            ss[0]>>std[0];
            ss[1]>>std[1];
            scanf("%s%s",freopens[0],freopens[1]);
            int len0=strlen(freopens[0]),len1=strlen(freopens[1]);
            flag[getType(std[0],std[1],freopens[0],freopens[1],len0,len1)]=1;
        }
        if(flag[1]) puts("Wrong file operation takes you to your ancestors along with your 3 years' efforts on OI.");
        else if(flag[2]) puts("Good luck and have fun.");
        else puts("PION2202 RP++.");
    }

	#ifndef ONLINE_JUDGE
	fclose(stdin);
	fclose(stdout);
	#endif
    return 0;
}
``