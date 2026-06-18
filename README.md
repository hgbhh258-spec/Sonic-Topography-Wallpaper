# Sonic Topography (3D 音频地形可视化器)

Sonic Topography 是一款基于网页端（Web-Native）的实时三维音乐频谱地形图可视化应用。它使用 React、Three.js (React Three Fiber) 与 Web Audio API 构建，能够将音频的不同频段（低音 Bass、中音 Mid、高音 Treble 以及整体能量 Energy）实时转化为三维波浪地形的跳动、收缩与色彩变换。

---

## 🌟 核心功能

1. **三维频谱地形网格 (3D Terrain Visualizer)**
   - 使用自定义着色器（Shader）构建的 `160 x 160` 立方体三维网格。
   - 地形高度、凹凸程度与色彩变化完美同步当前播放音乐的实时音频频率数据。
   - 支持流星雨效果（Meteors）与冲击波纹（Ripples）等动态音频触发视觉特效。

2. **交互式三维控制 (3D Interactions)**
   - **旋转与缩放**：按住鼠标右键拖拽可旋转视角，使用鼠标滚轮可缩放视野。
   - **鼠标脉冲反馈**：鼠标左键点击 3D 场景可以产生动态的水波纹波，点击力度随按压时长自动增强。

3. **网页端原生文件导入 & 拖拽播放 (Native File Import & Drag-Drop)**
   - **音乐导入**：点击播放面板的 **"Add Music"** 或将音频文件（支持 `.mp3`, `.wav`, `.flac`, `.ogg` 等常用格式）拖拽到浏览器窗口中，可自动追加到播放队列并播放。
   - **歌词导入**：支持手动点击 **"Add Lyrics"** 上传独立歌词文件（`.lrc` 格式），也支持拖放歌词文件。同时，应用能通过 `music-metadata-browser` 直接提取部分音频文件内嵌的歌词。

4. **折叠式播放队列 (Collapsible Play Queue)**
   - 播放面板右上角支持一键展开/折叠当前播放列表。
   - 可在列表中直接查看所有已载入的歌曲并进行切歌或从队列中移除。

5. **3D 歌词滚动投影 (3D Scrolling Lyrics)**
   - 带有 3D 纵深与模糊渐变效果的垂直歌词时间轴投影。
   - 歌词与当前音乐播放时间精确同步滚动，当没有加载歌词时，支持一键点击上传 `.lrc` 关联。

6. **实时音频频段监控 (Real-time Audio Monitor)**
   - 左下角带有实时可视化监控看板，显示低音（Bass）、中音（Mid）、高音（Treble）和能量（Energy）的实时振幅强度与变化波形。

7. **多预设主题 (Curated Color Themes)**
   - 支持一键切换多套艺术色彩主题：
     - **Nocturnal (暗夜森林)**：深邃的蓝紫调，带有明亮的荧光绿波纹。
     - **Neon Tokyo (霓虹东京)**：明亮粉红与深紫的朋克都市调性。
     - **Cyber Forest (赛博丛林)**：以明艳翡翠绿和柠檬黄为主的自然科技风。
     - **Minimal Monochrome (极简黑白)**：高质感的银灰色与黑白灰阶极简调性。

---

## 📂 项目结构

```text
sonic-topography (1)(1)/
├── public/                     # 静态资源文件夹
│   ├── Demo Subtitles.lrc      # 默认演示歌词文件
│   └── SoundHelix-Song-1.mp3   # 默认演示音频文件
├── src/                        # 核心源代码
│   ├── components/             # React 组件目录
│   │   ├── AudioVisualizer/    # 三维视觉相关组件
│   │   │   ├── CustomShaderMaterial.ts # 自定义地形材质着色器
│   │   │   └── MapScene.tsx    # 3D 场景与网格渲染
│   │   └── UI/                 # UI 控制面板组件
│   │       ├── LyricsDisplay.tsx # 三维歌词投影渲染
│   │       └── UI.tsx          # 播放器面板与文件导入逻辑
│   ├── lib/                    # 底层工具库与数据定义
│   │   ├── AudioEngine.ts      # Web Audio API 音频解析器与触发控制
│   │   ├── lyrics.ts           # LRC 歌词解析脚本
│   │   ├── metadata.ts         # 本地音频元数据读取器 (Lyrics 提取)
│   │   └── themes.ts           # 预设主题色彩定义
│   ├── App.tsx                 # 应用根组件 (组合 3D 场景与 UI)
│   ├── main.tsx                # 应用启动入口
│   ├── types.ts                # TypeScript 公共类型定义
│   └── index.css               # 全局 Tailwind CSS 样式
├── index.html                  # 单页面应用 HTML 模板
├── package.json                # 项目依赖与运行脚本
├── tsconfig.json               # TypeScript 配置文件
└── vite.config.ts              # Vite 构建与开发服务器配置
```

---

## 🛠️ 快速启动与构建

运行本项目需要安装 [Node.js](https://nodejs.org/) 环境。

### 1. 安装项目依赖
在项目根目录下，运行以下命令安装运行所需的包：
```bash
npm install
```

### 2. 启动本地开发服务 (绑定 3001 端口)
启动 Vite 开发服务器并指定绑定到 3001 端口：
```bash
npm run dev -- --port=3001
# 或者直接运行:
npx vite --port=3001 --host=0.0.0.0
```
启动后在浏览器中打开：[http://localhost:3001/](http://localhost:3001/) 即可预览效果。

### 3. 项目打包编译 (生产环境)
生成高度优化的静态分发文件（输出至 `dist/` 文件夹）：
```bash
npm run build
```
