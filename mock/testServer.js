"use strict";

// 代理target测试服务器

const app = require("express")();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

app.use((req, res) => {
    console.log(req.query);
    console.log(req.body);
    res.send(req.method + "  " + req.path); 
});

app.listen(9999);