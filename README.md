# yft-design
1，一款美观且功能强大的在线设计工具，具备海报设计和图片编辑功能，基于Canvas的开源版【稿定设计】。适用于多种场景，如海报生成、电商产品图制作、文章长图设计、视频/公众号封面编辑等。  
2，适配稿定设计pdf还原，支持导入psd还原  
3，可导出图片，svg，pdf  
<b>Demo：[https://yft.design](https://yft.design)</b>  
<b>Demo：[https://pro.yft.design](https://pro.yft.design)</b>  
[介绍文章](https://juejin.cn/post/7238804998276087868)  
[介绍视频](https://www.bilibili.com/video/BV1Zb421H7fT/?buvid=XY3B1253C1118CEF7B4DE80267E1AD86732A0&from_spmid=main.space.0.0&is_story_h5=false&mid=TIDtF8b2h0f7OVMypYFAZQ%3D%3D&p=1&plat_id=116&share_from=ugc&share_medium=android&share_plat=android&share_session_id=56bc8446-776d-4fd6-a742-132ac702b09b&share_source=WEIXIN&share_tag=s_i&spmid=united.player-video-detail.0.0&timestamp=1719707202&unique_k=Z8LQOMT&up_id=149041192)

## 管理员[June](https://github.com/Qiu-Jun)广佛找工作中, 有岗位请联系 1601745371@qq.com。与[yft作者](https://github.com/more-strive)支持各种软件定制开发， 欢迎联系。
<br />

![image](https://github.com/dromara/yft-design/assets/113762408/9df19ced-4058-4966-989a-9c8e3d848d4b)

<table rules="none" align="center">
   <tr>
      <td>
         <center>
            <img src="https://github.com/dromara/yft-design/assets/113762408/ce9d2c5b-0249-4fb3-8327-a533513e5619" width="100%"/>
            <br/>
            <font color="AAAAAA">psd解析</font>
         </center>
      </td>
      <td>
         <center>
            <img src="https://github.com/dromara/yft-design/assets/113762408/8bd89208-cc9e-4b77-b976-1bce078e73bb" width="100%"/>
            <br/>
            <font color="AAAAAA">pdf解析</font>
         </center>
      </td>
   </tr>
</table>

<table rules="none" align="center">
   <tr>
      <td>
         <center>
            <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d443519bc05f4dfbb98bbcf7df7e6bef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1907&h=997&s=639936&e=jpg&b=f8f0ee" width="100%" />
            <br/>
            <font color="AAAAAA">psd解析</font>
         </center>
      </td>
      <td>
         <center>
            <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59e36b4a389246a1873372e80a94e7cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1917&h=993&s=655084&e=png&b=fcfbfb" width="100%" />
            <br/>
            <font color="AAAAAA">pdf解析</font>
         </center>
      </td>
   </tr>
</table>

# 🚀 项目运行
```
node >= 16+
pnpm install
pnpm run dev
pnpm run build
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
### 使用后端文件解析器可以查看如下
  - 支持pdf
  - 支持psd
  - 支持ai(pdf结构)
  - 支持抠图
  - cdr解析开发中  
### 如果有需要可以联系作者 yft.design@163.com

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
email:  yft.design@163.com


## License
Licensed under the MIT License.

## 管理员
<!-- readme: collaborators -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Qiu-Jun">
            <img src="https://avatars.githubusercontent.com/u/24954362?v=4" width="80;" alt="Qiu-Jun"/>
            <br />
            <sub><b>Qiu-Jun</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/zjc2233">
            <img src="https://avatars.githubusercontent.com/u/43945226?v=4" width="80;" alt="zjc2233"/>
            <br />
            <sub><b>zjc2233</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/more-strive">
            <img src="https://avatars.githubusercontent.com/u/113762408?v=4" width="80;" alt="more-strive"/>
            <br />
            <sub><b>more-strive</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators -end -->

## 贡献者
<!-- readme: collaborators,contributors -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Qiu-Jun">
            <img src="https://avatars.githubusercontent.com/u/24954362?v=4" width="80;" alt="Qiu-Jun"/>
            <br />
            <sub><b>Qiu-Jun</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/zjc2233">
            <img src="https://avatars.githubusercontent.com/u/43945226?v=4" width="80;" alt="zjc2233"/>
            <br />
            <sub><b>zjc2233</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/more-strive">
            <img src="https://avatars.githubusercontent.com/u/113762408?v=4" width="80;" alt="more-strive"/>
            <br />
            <sub><b>more-strive</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/wohuweixiya">
            <img src="https://avatars.githubusercontent.com/u/86701050?v=4" width="80;" alt="wohuweixiya"/>
            <br />
            <sub><b>wohuweixiya</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/zdw1011781461">
            <img src="https://avatars.githubusercontent.com/u/42407561?v=4" width="80;" alt="zdw1011781461"/>
            <br />
            <sub><b>zdw1011781461</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/mjhcc365">
            <img src="https://avatars.githubusercontent.com/u/44367932?v=4" width="80;" alt="mjhcc365"/>
            <br />
            <sub><b>mjhcc365</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/ieleg">
            <img src="https://avatars.githubusercontent.com/u/52823905?v=4" width="80;" alt="ieleg"/>
            <br />
            <sub><b>ieleg</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/qq404388339">
            <img src="https://avatars.githubusercontent.com/u/34053528?v=4" width="80;" alt="qq404388339"/>
            <br />
            <sub><b>qq404388339</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/sledgehuang">
            <img src="https://avatars.githubusercontent.com/u/95006723?v=4" width="80;" alt="sledgehuang"/>
            <br />
            <sub><b>sledgehuang</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators,contributors -end -->
