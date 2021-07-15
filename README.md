# 收银机硬件端ui

使用Electron、React、Redux、React-Router 实现。   
前期使用nwjs开发，因nwjs arm版本的一些硬核问题不好解决，最后运行在硬件上使用了electron。  

## 目录结构
```
payment-machine-device_public
├── .gitignore
├── build
│   ├── production.js
│   ├── development.js
│   └── base.js
├── env // 配置文件目录
│   ├── production.env
│   ├── mock.env
│   ├── development.env
│   └── base.env
├── mock // 接口数据模拟，可以穿过mock直达服务，起到监看传参。
│   ├── testServer.js
│   ├── index.js
│   └── api
├── package-lock.json
├── package.json
├── README.md
├── scripts // 一些构建相关脚本
│   ├── util.js
│   ├── start-electron.js
│   └── run-electron.js
└── src
    ├── store
    ├── router
    ├── pages
    ├── lib
    ├── index.js
    ├── index.html
    ├── asstes
    └── api
```
## 开发启动
!!! 注意，该项目一直在armv7板子上进行测试开发，若运行在mac、windows、linuxX86 等平台可能会报很多错误（因为里边硬件相关操作库会报错，您也可以把这些硬件相关代码剔除就可以了）。   

老规矩，`npm install `安装全部依赖。   
然后根据目的执行以下命令：   
* 开发：`npm run dev`
* 开发（启动mock服务）`npm run dev-mock`
* 打包 `npm run build`

## 配置
配置都在env文件夹里边。   
