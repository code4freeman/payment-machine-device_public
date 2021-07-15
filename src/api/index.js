import { default as request, requestNoneToast } from "../lib/request";

// 测试
export function test () {
    return request({
        url: "/test",
        query: {
            a: 111,
            b: 222,
            c: 333
        }
    });
}

// 根据条码差商品信息
export function getProductStock (params = { code: "0" }) {
    return request({
        url: "/getProductByCode",
        params
    });
}

// 创建订单
export function createOrder (data = {
   products: [
       {
           id: "0", count: 0
       }
   ]     
}) {
    return request({
        url: "/createOrder",
        method: "POST",
        data
    });
}

// 获取订单详情
export function getOrder (params = { orderNumber }) {
    return request({
        url: "/getOrder",
        params
    });
}

// 发起支付
export function pay (data = { orderNumber: "", code }) {
    return requestNoneToast({
        url: "/pay",
        method: "POST",
        data
    });
}