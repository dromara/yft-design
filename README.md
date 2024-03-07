# yft-design
1，一款美观且功能强大的在线设计工具，具备海报设计和图片编辑功能，基于Canvas的开源版【稿定设计】。适用于多种场景，如海报生成、电商产品图制作、文章长图设计、视频/公众号封面编辑等。  
2，适配稿定设计导出pdf还原，支持导入psd还原  
3，可导出图片，svg，pdf  
<b>体验Demo：[https://yft.design](https://yft.design)</b>  
<b>体验Demo：[https://dromara.org/yft-design](https://dromara.org/yft-design)</b>


![image](/docs/example.png)

# 🎉 pdf解析

![psd-parse](/docs/pdf-parse.gif)

# 🎉 psd解析

![psd-parse](/docs/psd-parse.gif)

# 📋 色彩演示

![background](/docs/background.gif)

# 🚀 项目运行
```
node >= 16+
npm install
npm run dev
npm run build
```

# 📖 项目结构
```
├── app                           // 静态资源
│   ├── fabricCanvas              // FabricCanvas
│   ├── fabricControls            // 选择器
│   ├── fabricRuler               // 标尺
│   ├── fabricTool                // 拖动
│   ├── guideLines                // 辅助线
│   ├── hoverBorders              // 预选择
│   └── wheelScroll               // 缩放
├── assets                        // 静态资源
│   ├── fonts                     // 在线字体文件
│   └── styles                    // 样式
├── components                    // 与业务逻辑无关的通用组件
├── configs                       // 配置文件，如：颜色，字体。
├── hooks                         // 供多个组件（模块）使用的 hooks 方法
├── extension                     // 自定义fabirc对象
│   ├── controls                  // 裁剪图片controls
│   ├── mixins                    // 裁剪图片mixins
│   └── object                    // 自定义元素对象
├── mocks                         // mocks 数据
├── plugins                       // 自定义的 Vue 插件
├── types                         // 类型定义文件
├── store                         // Pinia store，参考：https://pinia.vuejs.org/
├── utils                         // 通用的工具方法
├── views                         // 业务组件目录。
│    ├── Canvas                   // 编辑器对象
│    └── Editor                   // 编辑器模块
└── worker                        // web worker
```

# 🧾 API接口文档
### 使用fabric.js的编辑器文件解析器可以查看如下 [接口文档](/docs/api.md)
  - 支持pdf
  - 支持psd
  - 支持ai(pdf结构)
  - 抠图功能
  - cdr解析测试中  
### 如果有需要可以联系作者 15972699417@163.com

# 📚 功能列表
### 基础功能
- 历史记录（撤销、重做）
- 快捷键
- 右键菜单
- 导入PDF(完美还原格式，不支持图片裁切导入)
- 导入PSD(完美还原格式，支持部分特效还原，亮度，对比度，颜色覆盖)
- 导入SVG(不支持tspan字体)
- 导出本地文件（SVG、图片、PDF）
### 页面编辑
- 页面添加、删除
- 页面顺序调整
- 页面复制粘贴(TODO)
- 背景设置（纯色、渐变、图片）
- 设置画布尺寸
- 网格线(TODO)
- 标尺
- 画布缩放、移动
- 页面模板
- 选择面板（隐藏元素、层级排序、元素命名）(TODO)
### 元素编辑
- 元素添加、删除
- 元素复制粘贴
- 元素拖拽移动
- 元素旋转
- 元素缩放
- 元素多选（框选、点选）
- 多元素组合
- 多元素批量编辑(TODO)
- 元素锁定(TODO)
- 元素吸附对齐（移动和缩放）
- 元素层级调整
- 元素对齐到画布
- 元素坐标、尺寸和旋转角度设置
#### 文字
- 文本编辑（颜色、高亮、字体、字号、加粗、斜体、下划线、删除线、对齐方式、项目符号、缩进、清除格式）
- 行高
- 字间距
- 段间距
- 填充色
- 阴影
- 透明度
#### 图片
- 滤镜
- 着色（蒙版）
- 翻转
- 边框
- 阴影
- 裁切
#### 形状
- 填充色
- 边框
- 阴影
- 透明度
- 翻转
- 编辑文字
#### 线条
- 颜色
- 宽度
- 样式

## 联系作者
wechat: 15972699417  
email:  15972699417@163.com

## License

Licensed under the MIT License.
