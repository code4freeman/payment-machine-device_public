module.exports = {

    // 测试用
    "GET /test": {
        name: "lilin",
        age: 28,
        "list|0-10": ["xxxx"]
    },

    // 查询指定id商品的库存, 没有参数则data为null
    "GET /getProductStock": {
        success: true,
        message: "",
        data: Math.random() > 0.3 ? {
            "id|0-100": 1,
            img: "@image(200x200)",
            "title|5-10": "",
            "amount|50-100": 0,
            "left|0-10": 0
        } : null
    },

    // 创建订单
    "POST /createOrder": {
        success: true,
        message: "",
        data: {
            // 订单号码
            "orderNumber|100000-222222": 0
        }
    },
    
    // 获取订单详情（根据订单编号）
    "GET /getOrder": {
        success: true,
        message: "",
        data: {
            // 订单号码
            "orderNumber|100000-222222": 0,
            // 支付金额
            "payAmount|50-1000": 0,
            // 商品集合
            "products|5-10": [
                // 商品数据
                {
                    "id|0-100": 1,
                    img: "@image(200x200)",
                    "title|5-10": "",
                    "amount|50-100": 0,
                    "left|0-10": 0
                }
            ]
        }
    }

}