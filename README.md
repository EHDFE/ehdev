# EHDEV
---

[![npm](https://img.shields.io/npm/v/ehdev.svg)]()
[![npm](https://img.shields.io/npm/dt/ehdev.svg)]()

易货滴前端开发脚手架

### 设计

![desgin](https://raw.githubusercontent.com/macisi/ehdev/master/desgin.png)

### 如何使用
---

1. 全局安装 `ehdev`

```sh
npm i -g ehdev
```

2. 切换到工程目录，初始化脚手架环境

```sh
ehdev init
```

3. 启动调试环境

```sh
ehdev server
```

### 配置文件说明
```js
// abc.json
{
  // 项目类型
  "type": "standard",
  // 公共库
  "libiary": {
    "commonLib": [ "./lib/common.js" ]
  },
  // 直接引用的外部资源，不构建
  "externals": {
    "lodash": {
      "path": "node_modules/lodash/lodash.min.js",
      "alias": "_"
    }
  },
  // 接口代理转发
  "proxy": {
    "/someApiPath": "http://some.host/someApiPath"
  },
  // 兼容浏览器范围，同时影响 css 和 js
  // 规则：https://github.com/ai/browserslist
  "browser_support": {
    "DEVELOPMENT": [ "last 2 versions" ],
    "PRODUCTION": [ "last 2 versions" ]
  },
  // 发布地址，只在生产环境生效
  "publicPath": "http://your.publishserver.address/"
}
```

