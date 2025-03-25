# 情绪控制（Emotion Control）

这是一个简单而有趣的HTML5游戏，背景设定为"一个情绪不佳的上班族利用坐电梯的时间调整自己的情绪，以满足正常工作要求"。

![游戏截图](screenshot.png)

## 游戏说明

在这个游戏中，你需要控制上班族的情绪，使其工作状态值达到90%以上。游戏开始时，上班族的工作状态值为50%。

## 玩法机制

1. **思想气泡**：画面中会不断冒出想法气泡，包含对工作有利的积极想法和对工作不利的消极想法。
2. **工作状态值**：积极想法会持续提升上班族的"工作状态值"，消极想法则效果相反。
3. **点击气泡**：通过点击气泡来消除它，从而控制积极与消极想法对工作状态的影响。
4. **策略性选择**：你需要战略性地选择要消除哪些想法，保留积极想法，消除消极想法，以提高工作状态值。
5. **难度递增**：随着游戏时间增长，气泡产生速度会逐渐加快，增加游戏难度。
6. **胜利条件**：当"工作状态值"达到90%时，你成功调整好了角色的情绪，游戏胜利。
7. **失败条件**：当"工作状态值"降至0%时，游戏失败。

## 技术实现

### 主要技术

- 纯前端实现：HTML5 + CSS3 + JavaScript
- 无需任何额外框架或库
- 响应式设计，适配手机竖屏设备

### 文件结构

- `index.html` - 游戏的HTML结构
- `style.css` - 游戏的样式表
- `script.js` - 游戏的JavaScript代码
- `artRes/` - 游戏美术资源目录
  - `bg.png` - 电梯背景图
  - `body_male.png` - 上班族人物图片
  - 其他表情图片等素材

### 核心功能

1. **思想气泡系统**：
   - 随机生成积极/消极想法
   - 气泡随机移动并在碰撞边缘时反弹
   - 点击事件处理和气泡消除

2. **情绪状态管理**：
   - 基于场上积极/消极想法数量实时计算工作状态值
   - 状态值可视化显示（进度条）

3. **游戏流程控制**：
   - 开始/重新开始游戏功能
   - 胜利/失败判定和反馈

## 如何运行

1. 克隆或下载本仓库
2. 在浏览器中打开`index.html`文件
3. 点击"开始游戏"按钮
4. 开始玩游戏！

## 浏览器兼容性

游戏适用于现代浏览器，包括：
- Chrome（推荐）
- Firefox
- Safari
- Edge

## 开发者

本游戏基于原创创意开发，主要面向手机用户，帮助现代人在短暂的电梯时间里放松心情，调整工作状态。

## 许可

[MIT许可证](LICENSE) 