"use strict";

const chalk = require("chalk");
const { MOCK_SRV } = require("parseenv")("env/mock.env");
const fs = require("fs");
const path = require("path");
const app = require("express")();
const bodyParser = require("body-parser");
const { createProxy } = require("http-proxy");
const { Readable } = require("stream");
const Mock = require("mockjs");
const registerRoutes = [
    // { method: "", path: "" }
];
let requestCount = 1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(chalk.green("-".repeat(20) + "> " + requestCount++));
    if (registerRoutes.find(({ method, path }) => req.method.toLowerCase() === method.toLowerCase() && req.path === path)) {
        console.log(chalk.green("[请求走mock]"));
    } else {
        console.log(chalk.red("[请求走代理]"));
    }
    console.log(req.method + " " + req.path);
    if (Reflect.ownKeys(req.query)) {
        console.log(chalk.green("query参数："));
        console.log(JSON.stringify(req.query, null, 4));
    }
    if (Reflect.ownKeys(req.body)) { 
        console.log(chalk.green("urlencode/json参数："));
        console.log(JSON.stringify(req.body, null, 4));
    }
    console.log(chalk.green("-".repeat(20) + "<\n"));
    next();
});

app.listen(MOCK_SRV.port, () => {
    console.log(`mock 服务运行在：${MOCK_SRV.port}...`);
    mountApis();    
    proxy();
});

function mountApis () {
    fs.readdirSync(path.resolve(__dirname, "api")).forEach(file => {
        const obj = require("./api/" + file);
        Reflect.ownKeys(obj).forEach(k => {
            console.log("挂载：" + k);
            const [ method, path ] = k.replace(/\s+/g, " ").trim().split(" ");
            registerRoutes.push({ method, path });
            app[method.toLowerCase()](path, (req, res) => {
                setTimeout(() => {
                    res.json(Mock.mock(obj[k]));
                    // res.json(obj[k]);
                }, Math.random() * 1000);
            });
        });
    });
}

function proxy () {
    app.use((req, res) => {
        const dataArr = (Reflect.ownKeys(req.body).length ? JSON.stringify(req.body) : "").split("");
        const proxy = createProxy({
            headers: {
                "Content-Length": dataArr.length
            },
            target: MOCK_SRV.target,
            changeOrigin: true,
            buffer: new Readable({
                read () {
                    this.push(dataArr.shift() || null);
                }
            })
        });
        proxy.web(req, res);
    });
}