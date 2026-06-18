# Sonic Topography Wallpaper

> A music-reactive chessboard wave live wallpaper — built on [sonic-topography](https://github.com/yin-yizhen/sonic-topography) with performance improvements and bug fixes.

[![Demo Video](https://img.youtube.com/vi/j3sxFjM2w9k/maxresdefault.jpg)](https://youtu.be/j3sxFjM2w9k)

🎵 **[▶ Watch Demo on YouTube](https://youtu.be/j3sxFjM2w9k)** &nbsp;|&nbsp; 🌐 **[Live Web Demo](https://hgbhh258-spec.github.io/Sonic-Topography-Wallpaper)** &nbsp;|&nbsp; 🇨🇳 **[中文说明](#中文说明)**

---

## About

Sonic Topography Wallpaper is a web-native real-time 3D audio visualizer that transforms music into a dynamic chessboard wave landscape. Built with React, Three.js (React Three Fiber), and the Web Audio API, it maps bass, mid, treble, and overall energy into live terrain deformation and color shifts.

> ⚠️ **Native wallpaper engine integration is not yet supported.** To use it as a desktop wallpaper, import it via **[Octos](https://github.com/underpig1/octos)** — a free HTML dynamic desktop engine available on the Microsoft Store.

---

## Features

- **3D Chessboard Wave Terrain** — 160×160 mesh with custom GLSL shaders, height and color driven by real-time audio frequency data
- **Music-Reactive Effects** — meteor shower and shockwave ripple effects triggered by audio beats
- **3D Scene Interaction** — right-click drag to rotate, scroll to zoom, left-click for dynamic water ripples
- **Drag & Drop Audio Import** — supports `.mp3`, `.wav`, `.flac`, `.ogg` and more
- **LRC Lyrics Support** — drag in `.lrc` files or auto-extract embedded lyrics from audio metadata
- **Collapsible Play Queue** — manage and switch tracks inline
- **3D Scrolling Lyrics** — depth-blurred vertical lyric timeline synced to playback
- **Real-time Audio Monitor** — live Bass / Mid / Treble / Energy waveform display
- **4 Preset Themes**
  - 🌑 Nocturnal — deep blue-purple with neon green ripples
  - 🌆 Neon Tokyo — hot pink and dark purple cyberpunk
  - 🌿 Cyber Forest — emerald green and lemon yellow
  - ⬜ Minimal Monochrome — silver-gray minimal grayscale

---

## Using as a Desktop Wallpaper (via Octos)

[Octos](https://github.com/underpig1/octos) is a free, open-source HTML dynamic desktop engine for Windows that renders web pages as live wallpapers with full mouse interactivity and multi-monitor support.

1. Download and install **[Octos](https://apps.microsoft.com/detail/9NC4C8N74G02)** from the Microsoft Store
2. Open Octos → add a new wallpaper
3. Paste the online demo URL:
   ```
   https://hgbhh258-spec.github.io/Sonic-Topography-Wallpaper
   ```
4. Set it as your desktop wallpaper and enjoy 🎵

> **Requirements:** Windows 10 or later, DirectX 11, Microsoft WebView2 Runtime

---

## Project Structure

```
sonic-topography/
├── public/
│   ├── Demo Subtitles.lrc
│   └── SoundHelix-Song-1.mp3
├── src/
│   ├── components/
│   │   ├── AudioVisualizer/
│   │   │   ├── CustomShaderMaterial.ts
│   │   │   └── MapScene.tsx
│   │   └── UI/
│   │       ├── LyricsDisplay.tsx
│   │       └── UI.tsx
│   ├── lib/
│   │   ├── AudioEngine.ts
│   │   ├── lyrics.ts
│   │   ├── metadata.ts
│   │   └── themes.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

Requires [Node.js](https://nodejs.org/).

```bash
# Install dependencies
npm install

# Start dev server
npm run dev -- --port=3001

# Production build
npm run build
```

Open `http://localhost:3001` in your browser.

---

## Credits

Based on [sonic-topography](https://github.com/yin-yizhen/sonic-topography) by [@yin-yizhen](https://github.com/yin-yizhen).  
This fork focuses on desktop wallpaper use, with performance improvements and bug fixes.

---

---

## 中文说明

> 一款随音乐实时律动的棋盘式海浪动态壁纸，基于 [sonic-topography](https://github.com/yin-yizhen/sonic-topography) 改造，优化了性能并修复了若干 bug。

🎵 **[▶ 观看演示视频](https://youtu.be/j3sxFjM2w9k)** &nbsp;|&nbsp; 🌐 **[在线演示页面](https://hgbhh258-spec.github.io/Sonic-Topography-Wallpaper)**

---

### 简介

Sonic Topography Wallpaper 是一款网页端实时三维音频可视化应用，能将音乐转化为动态棋盘式海浪地形。基于 React、Three.js (React Three Fiber) 与 Web Audio API 构建，将低音、中音、高音及整体能量实时映射为三维地形的起伏、收缩与色彩变化。

> ⚠️ **目前暂不支持原生壁纸引擎集成。** 如需将其用作桌面壁纸，请通过 **[Octos](https://github.com/underpig1/octos)** 导入——一款免费的 HTML 动态桌面引擎，可在微软商店下载。

---

### 功能特性

- **三维棋盘海浪地形** — 160×160 网格，自定义 GLSL 着色器，高度与色彩随实时音频频率数据变化
- **音乐触发视觉效果** — 流星雨与冲击波纹随节拍动态触发
- **三维场景交互** — 右键拖拽旋转视角，滚轮缩放，左键点击产生水波纹
- **拖拽导入音频** — 支持 `.mp3`、`.wav`、`.flac`、`.ogg` 等常见格式
- **LRC 歌词支持** — 拖入 `.lrc` 文件，或自动提取音频内嵌歌词
- **可折叠播放队列** — 内联管理与切换曲目
- **三维滚动歌词** — 带景深模糊渐变的垂直歌词时间轴，精确同步播放进度
- **实时音频监控** — 低音 / 中音 / 高音 / 能量实时波形显示
- **4 套预设主题**
  - 🌑 暗夜森林 — 深邃蓝紫色调，荧光绿波纹
  - 🌆 霓虹东京 — 热粉与深紫朋克都市风
  - 🌿 赛博丛林 — 翡翠绿与柠檬黄自然科技风
  - ⬜ 极简黑白 — 银灰色高对比极简风格

---

### 通过 Octos 用作桌面壁纸

[Octos](https://github.com/underpig1/octos) 是一款免费开源的 Windows HTML 动态桌面引擎，可将网页渲染为带完整鼠标交互的实时动态壁纸，支持多显示器。

1. 从微软商店下载安装 **[Octos](https://apps.microsoft.com/detail/9NC4C8N74G02)**
2. 打开 Octos → 添加新壁纸
3. 粘贴在线演示地址：
   ```
   https://hgbhh258-spec.github.io/Sonic-Topography-Wallpaper
   ```
4. 设置为桌面壁纸，享受音乐律动 🎵

> **系统要求：** Windows 10 及以上，DirectX 11，Microsoft WebView2 Runtime

---

### 快速启动

需要安装 [Node.js](https://nodejs.org/)。

```bash
# 安装依赖
npm install

# 启动本地开发服务
npm run dev -- --port=3001

# 生产环境构建
npm run build
```

启动后在浏览器打开 `http://localhost:3001` 即可预览。

---

### 致谢

基于 [@yin-yizhen](https://github.com/yin-yizhen) 的 [sonic-topography](https://github.com/yin-yizhen/sonic-topography) 改造。  
本 fork 专注于桌面壁纸场景，优化了性能并修复了若干 bug。
