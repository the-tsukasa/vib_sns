# 🎨 VIB CSS Architecture

## 📂 目录结构

```
src/css/
├── main.css                    # 主入口文件（引入所有模块）
│
├── core/                       # 核心基础层
│   ├── variables.css          # CSS变量（色彩、间距、字体等）
│   ├── reset.css              # 重置和全局样式
│   └── animations.css         # 关键帧动画
│
├── layout/                     # 布局层
│   ├── content.css            # 主内容区域布局
│   ├── sidebar.css            # 侧边栏
│   ├── hamburger.css          # 汉堡菜单
│   └── overlay.css            # 遮罩层
│
├── components/                 # 组件层
│   ├── buttons.css            # 按钮组件
│   ├── cards.css              # 卡片组件
│   └── scrollbar.css          # 自定义滚动条
│
├── sections/                   # 页面区块层
│   ├── section-base.css       # 通用section样式
│   ├── hero.css               # Hero区域
│   ├── about.css              # About区域
│   ├── features.css           # Features区域
│   ├── plans.css              # Plans区域
│   ├── vision.css             # Vision区域
│   ├── news.css               # News区域
│   ├── faq.css                # FAQ区域
│   └── contact.css            # Contact区域
│
└── footer.css                  # Footer样式

# 旧文件（可保留作为参考）
base.css                        # 已拆分为 core/variables.css 和 core/reset.css
header.css                      # 已拆分为 layout/sidebar.css 和 layout/hamburger.css
sections.css                    # 已拆分为 sections/ 目录下的各个文件
```

## 🎯 设计原则

### 1. **ITCSS方法论**
按照从通用到特定的顺序组织CSS：
- Core（核心） → Layout（布局） → Components（组件） → Sections（区块）

### 2. **单一职责**
每个文件只负责一个功能模块，便于维护和协作。

### 3. **可重用性**
组件设计独立，可以轻松在其他项目中复用。

### 4. **响应式优先**
每个模块都包含相应的响应式样式。

## 📝 命名规范

### BEM方法论
```css
/* Block（块） */
.card { }

/* Element（元素） */
.card__title { }
.card__content { }

/* Modifier（修饰符） */
.card--featured { }
.card__title--large { }
```

### CSS变量
```css
/* 使用语义化命名 */
--yellow           /* 主色 */
--shadow-md        /* 中等阴影 */
--radius-lg        /* 大圆角 */
--transition-base  /* 标准过渡 */
```

## 🔧 使用指南

### 修改颜色
➡️ 编辑 `core/variables.css`

### 修改按钮样式
➡️ 编辑 `components/buttons.css`

### 修改Hero区域
➡️ 编辑 `sections/hero.css`

### 添加新组件
➡️ 在 `components/` 创建新文件
➡️ 在 `main.css` 中引入

### 添加新的section
➡️ 在 `sections/` 创建新文件
➡️ 在 `main.css` 中引入

## 📊 文件大小对比

| 模块 | 拆分前 | 拆分后 | 改进 |
|------|--------|--------|------|
| **sections** | 804行 | 9个文件，每个60-100行 | ✅ 提升可维护性 |
| **header** | 271行 | 4个文件，每个50-80行 | ✅ 职责更清晰 |
| **base** | 110行 | 3个文件，每个30-80行 | ✅ 更好的组织 |

## ⚡ 性能优化

### 1. CSS变量
使用CSS变量统一管理设计系统，修改更高效。

### 2. 模块化加载
可以按需加载特定模块（使用构建工具）。

### 3. 更好的缓存
独立文件便于浏览器缓存，修改一个文件不影响其他。

## 🎨 设计系统

### 颜色系统
```css
--yellow        #ffcc00  /* 主黄色 */
--yellow-2      #ffd633  /* 亮黄色 */
--yellow-light  #fff4cc  /* 浅黄色 */
--yellow-dark   #e6b800  /* 深黄色 */
```

### 阴影系统
```css
--shadow-sm   小阴影
--shadow-md   中等阴影
--shadow-lg   大阴影
--shadow-xl   超大阴影
```

### 间距系统
```css
--space-xs    4px
--space-sm    8px
--space-md    16px
--space-lg    24px
--space-xl    32px
```

### 圆角系统
```css
--radius-sm   8px
--radius-md   12px
--radius-lg   16px
--radius-xl   24px
```

## 🔄 迁移指南

如果需要回退到旧版本：
1. 在 `index.html` 中引用旧的CSS文件
2. 保留的旧文件：`base.css`, `header.css`, `sections.css`

如果需要清理旧文件：
1. 确认新架构运行正常
2. 删除 `base.css`, `header.css`, `sections.css`
3. 清理不需要的备份文件

## 🚀 最佳实践

### 1. 修改顺序
1. 修改 CSS 文件
2. 测试浏览器显示
3. 检查响应式表现
4. 验证不同设备

### 2. 新增功能
1. 确定属于哪一层（core/layout/components/sections）
2. 创建对应的 CSS 文件
3. 在 `main.css` 中引入
4. 遵循 BEM 命名规范

### 3. 协作开发
- 各开发者负责不同的模块文件
- 减少 Git 冲突
- 代码审查更容易

## 📚 参考资料

- [ITCSS方法论](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [BEM命名规范](http://getbem.com/)
- [CSS变量指南](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## ✅ 验证清单

- [x] 所有CSS变量集中管理
- [x] 每个文件职责单一
- [x] 响应式样式完整
- [x] 命名规范统一
- [x] 无Linter错误
- [x] 浏览器兼容性良好

---

**版本**: v2.0  
**更新日期**: 2025-11-02  
**作者**: 曹 小帥（SOU）

