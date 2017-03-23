# EHDEV
---

[![npm](https://img.shields.io/npm/v/ehdev.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/macisi/ehdev/total.svg)]()
[![npm](https://img.shields.io/npm/dt/ehdev.svg)]()

易货滴前端开发脚手架


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
```json
{
  // 模块配置
  "workspace": {
    // 项目子模块名
    // 不在这里列出的模块，会默认去拉线上代码
    "scms": {
      // 子模块 svn 分支
      "branch": "trunk",
      // 是否启用该模块的本地调试，false 则使用线上资源
      "active": true
    },
    "basicConfigWeb": {
      "branch": "trunk",
      "active": true
    },
    "center": {
      "branch": "trunk",
      "active": true,
      // 子模块内部的目录结构，如果又嵌套，需要在此配置
      "relativePath": "center"
    }
  },
  // 代理配置
  "proxy": {
    // 全局的代理，如果不存在对应文件，会拿该域名请求资源
    "/": {
      "proxy_pass": "http://managementtest.ehuodi.com"
    },
    // api 代理配置
    "/ehuodiBedrockApi": {
      "proxy_pass": "http://managementtest.ehuodi.com"
    },
    "/ehuodiCrmApi": {
      "proxy_pass": "http://10.7.13.58"
    },
    "/goodstaxiAdmin": {
      "proxy_pass": "http://myportaltest.tf56.com"
    }
  }
}
```

