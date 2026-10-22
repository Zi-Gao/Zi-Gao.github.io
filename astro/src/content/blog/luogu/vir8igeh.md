---
title: "LMCC"
slug: "vir8igeh"
description: "简介 官网：LMCC认证管理系统 CCF推出的，大模型能力认证，Large Model Competence Certification，简称LMCC。 CCF LMCC认证设青少年组LMCC-T（T…"
date: "2025-11-21T07:23:37.000Z"
category: "笔记"
tags: ["note"]
cover: "/images/type-rhythm.svg"
coverAlt: "笔记文章的简约插画封面"
featured: false
draft: false
sourceUrl: "https://www.luogu.com.cn/article/vir8igeh"
sourceCategory: "个人记录"
sourceSha256: "4f45857ce7567b8c35a5fd635af15ff3c6c1d28318adb2f74550f0cfe956d096"
---
## 简介

官网：[LMCC认证管理系统](https://lmcc.ccf.org.cn/)

CCF推出的，大模型能力认证，Large Model Competence Certification，简称LMCC。

CCF LMCC认证设青少年组LMCC-T（Teenager）和成人组LMCC-A（Adult）。青少年组LMCC-T主要考核大模型基本素养和概念类知识；成人组LMCC-A着重考核大模型应用、训练和微调等实践技能；两组都是上机认证。

## 考试形式

和csp j/s差不多，今年规则，分为两轮：

1. 第一轮：类似csp j/s初赛，2h，笔试，只不过上机答题，不允许使用其他程序。总共100分，60分晋级，占总分 50%。
2. 第二类：类似csp j/s复赛，3h，完成两个题目，每个题50分，总共100分。占总分50%。

## 考试范围

青少年组，偏向考察大模型能力相关认知，需要了解大模型训练、使用的基本知识，但是不太深入到底层代码范围。

### 第一轮

做这部分你需要大概知道：

1. 一个模型从0到发布的过程，每个部分具体干了什么。
2. 一个模型如何使用。
3. 不同模型的优劣。

## 第二类

青少年组这个部分应该会考察两个模型落地使用的项目，比如今年两道题分别是：

1. 格式化古诗词题库。
2. 调用知识库回答古诗词题目。

这部分需要知道：

1. 如何使用一个极小的模型去做这些语言类任务。
2. 如何调试模型采样参数。
3. 如何做模型外挂的知识库调用，知识库搜索。
4. 如何设计提示词引导模型完成任务。

## 如何训练

其实我觉得不能叫做训练，应该作为一个爱好，如果你对这方面完全不感兴趣，不是很建议花费时间参加这个比赛，因为这个比赛还在初期阶段，首先不了解这个比赛对升学、找工作等等有无实质性帮助，其次想要达到较好的分数也需要足够的时间。

以我举例，我没有在赛前专门训练过，只看了两个样题，我都是用的在平时课余时间解除的知识。

具体来说你可以：

1. 搜点教程和视频学习神经网络的数学原理，推荐3blue1brown。
2. 手写一次MNIST的完整训练过程。可以参考我的实现：https://github.com/Zi-Gao/CPP-Neural-Network
3. 学习pytorch如何书写。
4. 在[Kaggle](https://www.kaggle.com/)上找项目做，这里面很多比赛都有奖金。

这里可以让你了解训练过程。

然后你可以找一些落地使用的项目，看看模型如何落地使用，比如：

1. QQ聊天机器人。
2. 知识图谱，知识库是如何实现的。
3. ai agent是怎么样的。
4. 如何过滤有害言论，等等。

你也可以做一些项目用于方便自己，比如：

1. [原题机](https://yuantiji.ac/zh/)是如何实现的，怎么自己做一个。
2. 如何实现一个自动扫描题目，翻译的程序。

## 关于训练平台

如果你有一台强劲的电脑，你可以在自己电脑上跑这些项目，如果没有，可以尝试使用云算力平台，比如

1. [Google Colab](https://colab.research.google.com/)
2. [Kaggle](https://www.kaggle.com/)
3. [阿里云天池](https://tianchi.aliyun.com/)
4. 等等算力平台。