

# Vue 3 + TypeScript + Vite + Element Plus



## 启动方式
首先安装依赖：

```sh
pnpm install
```

项目根目录执行:

```sh
pnpm run dev
```

## 目录结构说明

```text
├── dist                                               # 构建产物
├── public                                             # 前端资源
│   ├── logo.ico                                       # 网站图标
├── src                                                # 源码目录
│   ├── assets                                         # 静态资源
│   │   ├── css                                        # css文件
│   │   └── fonts                                      # 字体文件
│   │   └── img                                        # 图片文件
│   │   └── svg                                        # svg文件,菜单图标等
│   ├── components                                     # 全局组件
│   ├── constants                                      # 全局常量
│   ├── directives                                     # 全局自定义指令
│   ├── router                                         # 路由
│   ├── service                                        # 接口服务
│   ├── types                                          # 数据结构类型
│   ├── utils                                          # 工具类
│   ├── views                                          # 页面
│   │   └── PageName                                   # 具体页面，驼峰拼写方式
│   │       ├── components                             # 页面组件
│   │       ├── PageName.vue                           # 页面代码
│   │   └── index.vue                                  # 首页
│   │   └── Home.vue                                   # 全局Layout
│   ├── App.vue                                        # 应用组件
│   └── main.ts                                        # 应用入口
├── README.md                                          # 项目说明
├── package.json
├── vite.config.js                                     # 统一 vite 工具配置
└── pnpm-lock.yaml
```
