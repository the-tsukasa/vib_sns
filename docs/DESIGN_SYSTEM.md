# 🎨 VIB 设计系统快速参考

## 📐 色彩系统

### 主色调
```css
--yellow: #ffcc00        /* 主黄色 - 用于按钮、强调 */
--yellow-2: #ffd633      /* 亮黄色 - 用于悬停、渐变 */
--yellow-light: #fff4cc  /* 浅黄色 - 用于背景、标签 */
--yellow-dark: #e6b800   /* 深黄色 - 用于边框、图标 */
```

### 中性色
```css
--ink: #0b0b0b          /* 深黑色 - 标题 */
--ink-light: #1b1b1b    /* 浅黑色 - 正文 */
--gray: #666666         /* 灰色 - 次要文本 */
--gray-light: #999999   /* 浅灰色 - 辅助文本 */
--bg: #fafaf7           /* 背景色 */
--bg-white: #ffffff     /* 纯白背景 */
--line: #e9e9e9         /* 分隔线 */
```

---

## 🎭 阴影系统

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06)      /* 小阴影 */
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1)      /* 中等阴影 */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12)     /* 大阴影 */
--shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.15)    /* 超大阴影 */
--shadow-yellow: 0 8px 24px rgba(255, 204, 0, 0.3)  /* 黄色发光 */
```

**使用场景**:
- `shadow-sm` → 列表项、小卡片
- `shadow-md` → 普通卡片、按钮
- `shadow-lg` → 重要卡片、弹窗
- `shadow-xl` → Hero图片、重要CTA
- `shadow-yellow` → 主要按钮、强调元素

---

## 📏 圆角系统

```css
--radius-sm: 8px        /* 小圆角 - 标签、徽章 */
--radius-md: 12px       /* 中圆角 - 按钮、卡片 */
--radius-lg: 16px       /* 大圆角 - 大卡片、图片 */
--radius-xl: 24px       /* 超大圆角 - Hero图片、特殊容器 */
```

---

## ⏱️ 过渡时长

```css
--transition-fast: 0.2s ease    /* 快速 - 悬停效果 */
--transition-base: 0.3s ease    /* 标准 - 常规过渡 */
--transition-slow: 0.6s ease    /* 缓慢 - 复杂动画 */
```

---

## 🎯 间距系统

### 推荐间距
- **8px** - 最小间距
- **12px** - 小间距
- **16px** - 默认间距
- **24px** - 中间距
- **32px** - 大间距
- **48px** - 超大间距
- **64px** - 区块间距

---

## 🔤 排版系统

### 字体家族
```css
font-family: "Inter", "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
```

### 字体大小
```css
/* 标题 */
h1: 2.8rem (Hero)
h2: 2.5rem (Section标题)
h3: 1.5rem (小标题)

/* 正文 */
body: 1rem (默认)
.lead: 1.2rem (引导文本)
.small: 0.9rem (辅助文本)
```

### 字重
```css
400 - Regular (正文)
600 - Semibold (次要标题)
700 - Bold (按钮、强调)
900 - Black (主标题)
```

### 行高
```css
标题: 1.3-1.4
正文: 1.6-1.8
按钮: 1
```

---

## 🎨 渐变模板

### 背景渐变
```css
/* Hero背景 */
background: linear-gradient(135deg, #fffef5 0%, #fff8d1 50%, #fffaeb 100%);

/* 按钮渐变 */
background: linear-gradient(135deg, var(--yellow) 0%, var(--yellow-2) 100%);

/* 卡片背景 */
background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
```

### 装饰渐变
```css
/* 标题下划线 */
background: linear-gradient(90deg, var(--yellow) 0%, var(--yellow-2) 100%);

/* 半透明装饰圆 */
background: radial-gradient(circle, rgba(255, 204, 0, 0.15) 0%, transparent 70%);
```

---

## 🎬 动画库

### 淡入上升
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 脉冲
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

### 浮动
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### 闪烁
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 🔘 按钮样式

### 主按钮
```css
.btn--primary {
  background: linear-gradient(135deg, var(--yellow) 0%, var(--yellow-2) 100%);
  padding: 14px 32px;
  border-radius: var(--radius-md);
  font-weight: 700;
  box-shadow: var(--shadow-yellow);
}

.btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(255, 204, 0, 0.4);
}
```

### 边框按钮
```css
.btn--outline {
  background: transparent;
  border: 2.5px solid var(--yellow);
  padding: 14px 32px;
  border-radius: var(--radius-md);
  font-weight: 700;
}

.btn--outline:hover {
  background: var(--yellow);
  transform: translateY(-3px);
}
```

---

## 🃏 卡片样式

### 基础卡片
```css
.card {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 24px;
  transition: all var(--transition-base);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
```

### 列表卡片
```css
.list-item {
  padding: 20px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--yellow);
  box-shadow: var(--shadow-sm);
}

.list-item:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-md);
}
```

---

## 📱 响应式断点

### 断点定义
```css
/* 平板 */
@media (max-width: 900px) { ... }

/* 手机 */
@media (max-width: 600px) { ... }

/* 桌面 */
@media (min-width: 901px) { ... }
```

### 移动端调整
```css
/* 900px以下 */
- Section padding: 120px → 80px
- H2 font-size: 2.5rem → 2rem
- 垂直堆叠布局
- 按钮全宽

/* 600px以下 */
- Section padding: 80px → 60px
- H2 font-size: 2rem → 1.75rem
- 按钮字体: 1rem → 0.95rem
- 进一步简化交互
```

---

## 🎯 使用示例

### 创建新的Section
```css
.my-section {
  padding: 120px 8vw;
  background: var(--bg-white);
  position: relative;
  overflow: hidden;
}

.my-section h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--ink);
  margin-bottom: 1.5rem;
}

.my-section h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--yellow) 0%, var(--yellow-2) 100%);
}
```

### 创建悬停效果
```css
.hover-element {
  transition: all var(--transition-base);
}

.hover-element:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### 创建装饰元素
```css
.decoration {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 204, 0, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 6s ease-in-out infinite;
}
```

---

## ✅ 设计检查清单

在创建新组件时，确保：

- [ ] 使用CSS变量而非硬编码颜色
- [ ] 应用适当的阴影层级
- [ ] 添加过渡动画
- [ ] 实现悬停状态
- [ ] 考虑焦点状态
- [ ] 添加响应式样式
- [ ] 保持视觉一致性
- [ ] 测试多设备显示

---

## 🚀 快速开始

### 1. 创建按钮
```html
<a href="#" class="btn btn--primary">主要按钮</a>
<a href="#" class="btn btn--outline">次要按钮</a>
```

### 2. 创建卡片
```html
<div class="card">
  <img src="..." class="card__img">
  <h3>标题</h3>
  <p>内容</p>
</div>
```

### 3. 创建列表项
```html
<ul class="feature-list">
  <li><strong>标题：</strong> 描述文本</li>
</ul>
```

---

**维护提示**: 本设计系统应作为所有新增样式的参考基准，保持整站的视觉一致性。

**版本**: v2.0  
**更新日期**: 2025-11-02

