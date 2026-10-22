---
title: "CF1396C Monster Invaders 题解"
slug: "9orpcvjn"
description: "首先需要正确理解题面： 1. 手枪、激光枪、AWP 分别有 r1,r2,r3 的冷却时间，但是这个冷却实际上是蓄力前摇，不能同时冷却。 2. 这些枪都不不能打其他关卡的怪。 首先分析下三个武器： 1.…"
date: "2024-09-03T02:49:17.000Z"
category: "题解"
tags: ["solution"]
cover: "/images/digital-home.svg"
coverAlt: "题解文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/9orpcvjn"
sourceCategory: "题解"
sourceSha256: "6acb2dcb12685626c9bbc15cc285c887879dda0fbcebf63af540326c8761d77e"
---
首先需要正确理解题面：

1. 手枪、激光枪、AWP 分别有 $r1,r2,r3$ 的冷却时间，但是这个冷却实际上是**蓄力前摇**，**不能**同时冷却。

2. 这些枪都不**不能**打其他关卡的怪。

首先分析下三个武器：

1. 手枪：相当于每次杀死一个小怪。打 boss 时会先打一枪，然后被送走，后来后再打一枪。

2. 激光枪：相当于杀死关卡中所有小怪，打掉 boss 一滴血，然后被送走。显然一关最多在开头使用一次激光枪。

3. AWP：直接杀死一个怪。

分析一下打过某一关的方式：

1. 开头使用一次激光枪，然后被送走，回来用一次手枪打死 boss。

2. 使用手枪打完小怪，打 boss 一枪，然后被送走，后来后再打一次手枪。

3. 使用手枪打完小怪，然后使用 AWP 杀死 boss。

考虑前两个方式，我们称为打法一，第三个方式称为打法二，对于打法一的连续段：

1. 连续段在中间，那么连续段中相邻两关的路程会贡献 3 次。

2. 连续段在最后：那么最后一关使用打法二，然后回依次向前被送走，打完每个 boss。

于是设计一个 dp 状态：

1. $dp_{i,0}$ 表示前 $i$ 关 boss 打完了的最小时间花费。

2. $dp_{i,1}$ 表示前 $i-1$ 关 boss 打完了，并且第 $i-1$ 关需要回去打一次的最小时间花费，注意回去打一次手枪的时间已经 $dp_{i,1}$ 计算了。

3. $dp_{i,2}$ 表示，接下来是方式二的连续段，并且直到最后一关。

分类讨论一下转移即可，特别的当 $dp_{n,2}$ 的代价是直接击杀 boss 的代价。看代码就能看懂这个分类讨论了。

```cpp
#include<bits/stdc++.h>

int read(){
	int x;
	scanf("%d",&x);
	return x;
}

void print(long long x){
	printf("%lld",x);
	return;
}

long long arr[1000010],dp[1000010][3];

int main(){
	register int i;
	long long r1,r2,r3,d,val1,val2;
	int n=read();
	r1=read();
	r2=read();
	r3=read();
	d=read();

	dp[0][0]=-d;
	
	for(i=1;i<=n;++i){
		arr[i]=read();
		val1=r1*arr[i]+r3;
		val2=std::min(r1*arr[i]+r1,r2)+r1;
		
		dp[i][0]=std::min({
			dp[i-1][0]+val1+d,
			dp[i-1][1]+val1+d+d*2,
			dp[i-1][0]+val2+d+d*2,
			dp[i-1][1]+val2+d+d*2,
		});
		dp[i][1]=std::min({
			dp[i-1][0]+val1+d,
			dp[i-1][1]+val1+d+d*2,
			dp[i-1][0]+val2+d,
			dp[i-1][1]+val2+d+d*2,
		});
		if(i==n) val2=std::min(val2+d*2,val1);
		dp[i][2]=std::min({
			dp[i-1][2]+val2+d+d,
			dp[i-1][0]+val2+d,
			dp[i-1][1]+val2+d+d*2,
		}); 
		
	}
	
	print(std::min(dp[n][0],dp[n][2])); 
	
	return 0;
}


```