# 🔍 小红书违禁词检测工具 (XHS Content Checker)

> 智能识别小红书文案违禁词与敏感表达，提供实时健康分评级、风险预警与原文精准标红，守护创作者内容安全，避免笔记被限流或降权。

[![Deploy static content to Pages](https://github.com/wensenlab/xhs-content-checker/actions/workflows/deploy.yml/badge.svg)](https://github.com/wensenlab/xhs-content-checker/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WenSenLab](https://img.shields.io/badge/WenSenLab-Brand-red.svg)](https://github.com/wensenlab)

---

## 🌐 在线体验

- **GitHub Pages 演示地址**：[https://wensenlab.github.io/xhs-content-checker/](https://wensenlab.github.io/xhs-content-checker/)

---

## ✨ 核心特性

- 🎯 **7 大违禁词库全面覆盖**：
  - **极限用语**：国家级、顶级、第一、全网首发、独家、销量冠军、NO1 等；
  - **权威性背书**：国家领导人推荐、国家机关专供、质量免检、驰名商标等；
  - **诱导点击**：恭喜获奖、全民免单、点击有惊喜、一键三连等；
  - **刺激消费**：秒杀、抢爆、再不抢就没了、万人疯抢等；
  - **医疗/药效用语**：治疗、消炎、抗敏、排毒、防癌、调节内分泌、生发等；
  - **迷信用语**：招财进宝、转运、逢凶化吉、旺人旺财、辟邪护身等；
  - **化妆品虚假宣传**：特效、全效、速白、周期见效、溶脂、消除皱纹等。
- 📊 **动态健康分与风险评级**：采用 100 分制动态扣分模型，实时给出「低风险（90+）」、「中风险（70-89）」、「高风险（50-69）」与「极高风险（<50）」四档预警。
- 🖍️ **原文精准高亮标红**：检测出的违禁词在文案段落中原位标红显示，直观查阅前后语境，改稿更高效。
- 🗂️ **敏感词分类聚类汇总**：自动按违规类别归纳已命中词汇，方便针对性排查。
- 🔒 **本地安全，零隐私泄漏**：纯前端浏览器端完成匹配，文案不上传任何远程服务器，创作素材绝对安全。
- ⚡ **双模交付形态**：既提供单文件开箱即用的 Web 单页（`index.html`），也提供可直接复用的 React 原生组件（`XiaohongshuChecker.jsx`）。

---

## 🚀 部署与运行指南

本项目为静态 Web 应用，无需配置复杂后端与数据库，支持多种部署与运行方式：

### 方案一：GitHub Pages 自动部署（仓库现成支持，推荐）

仓库已内置 GitHub Actions 工作流（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)），每次向 `main` 分支推送代码即可自动触发部署。

**首次启用配置步骤：**
1. 进入 GitHub 仓库主页，点击 **Settings** 选项卡；
2. 在左侧菜单栏中点击 **Pages**；
3. 在 **Build and deployment** > **Source** 下拉菜单中，选择 **GitHub Actions**；
4. 提交或推送任意代码到 `main` 分支（或在 **Actions** 标签页手动点击 **Run workflow**）；
5. 待 Actions 运行完毕后，即可通过 `https://<用户名或组织名>.github.io/<仓库名>/` 访问（例如：`https://wensenlab.github.io/xhs-content-checker/`）。

---

### 方案二：Vercel 一键部署（全球 CDN 加速）

1. 访问 [Vercel 控制台](https://vercel.com) 并登录；
2. 点击 **Add New...** -> **Project**，导入 `wensenlab/xhs-content-checker` 仓库；
3. 配置项保持默认：
   - **Framework Preset**：`Other`
   - **Root Directory**：`./`
   - **Build & Output Settings**：无需构建命令，输出目录留空
4. 点击 **Deploy**，30 秒内完成部署，自动获得专属域名与免费 SSL 证书。

---

### 方案三：Cloudflare Pages / Netlify 部署

#### Cloudflare Pages
1. 登录 Cloudflare Dashboard，进入 **Workers & Pages** -> **Create application** -> **Pages**；
2. 连接 GitHub 仓库并选择 `xhs-content-checker`；
3. **Build settings**：
   - Framework preset：None
   - Build command：（留空）
   - Build output directory：`/`
4. 点击 **Save and Deploy** 即可。

#### Netlify
1. 登录 Netlify，点击 **Add new site** -> **Import an existing project**；
2. 选择本仓库，**Publish directory** 填写 `.` 或 `/`；
3. 点击 **Deploy xhs-content-checker** 即可上线。

---

### 方案四：本地直接运行（离线/免安装）

#### 方式 A：双击打开
克隆或下载本仓库至本地后，直接用现代浏览器（Chrome、Safari、Edge 等）双击打开 [`index.html`](index.html) 文件即可正常使用。

#### 方式 B：启动本地静态服务
```bash
# 1. 克隆代码仓库
git clone https://github.com/wensenlab/xhs-content-checker.git
cd xhs-content-checker

# 2. 使用 Python 快速启动静态服务器
python3 -m http.server 8000

# 或使用 Node.js / npx
# npx serve .
```
启动后在浏览器访问 `http://localhost:8000` 即可。

---

### 方案五：集成到已有 React / Vite / Next.js 项目

如果你希望将检测组件嵌入自己的 Web 平台或内部系统：

1. 将仓库中的 [`XiaohongshuChecker.jsx`](XiaohongshuChecker.jsx) 拷贝至项目的组件目录（如 `src/components/XiaohongshuChecker.jsx`）；
2. 安装图标依赖：
   ```bash
   npm install lucide-react
   # 或
   pnpm add lucide-react
   # 或
   yarn add lucide-react
   ```
3. 在需要展示的页面中直接引入使用：
   ```jsx
   import React from 'react';
   import XiaohongshuChecker from './components/XiaohongshuChecker';

   export default function Page() {
     return (
       <main className="min-h-screen bg-gray-50 py-8">
         <XiaohongshuChecker />
       </main>
     );
   }
   ```
   > **注意**：项目需已配置 Tailwind CSS 基础样式类。

---

## 📁 目录结构

```text
xhs-content-checker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Pages 自动部署流程
├── XiaohongshuChecker.jsx      # React 原生组件源码（支持集成进工程化项目）
├── index.html                  # 单文件单页应用（CDN 加载 React/Tailwind，开箱即用）
├── LICENSE                     # MIT 开源授权协议
└── README.md                   # 项目介绍、使用说明与部署文档
```

---

## ⚠️ 免责声明

1. 本工具整理的违禁词库参考了小红书平台公开发布的内容审核规范、《中华人民共和国广告法》通用限制用语及创作者社群经验总结，仅供发布前自查参考；
2. 各垂直行业（如美妆护肤、医疗健康、金融理财等）存在特定行业的补充规范，且平台算法规则存在阶段性动态调整，请以小红书平台实际审核判定与官方通知为准；
3. 使用本工具不代表 100% 豁免平台风控审核。

---

## 📄 授权协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

<p align="center">
  <b>WenSenLab_ ©文森策</b>
</p>
