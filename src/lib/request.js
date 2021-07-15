import axios from "axios";
import { Toast } from "antd-mobile";

const { REQUEST } = ENV;

const request = axios.create({
    baseURL: REQUEST.baseURL + "/machine",
    timeout: REQUEST.timeout,
    headers: { withCredentials: true }
});
request.interceptors.request.use(
    config => {
        Toast.loading(ENV.REQUEST.msg_loading, 0);
        config.headers["Authorization"] = ENV.AUTHORIZATION;
        return config;
    }, 
    error => {
        Toast.fail(ENV.REQUEST.msg_neterr);
        return Promise.reject(error);
    }
);
request.interceptors.response.use(
    ({ data }) => {
        Toast.hide();
        console.log("1");
        console.log(data);
        if (!data.success) return Toast.fail(data.message || ENV.REQUEST.msg_syserr);
        return data;
    }, 
    error => {
        Toast.fail(ENV.REQUEST.msg_neterr);
        return Promise.reject(error);
    }
);

const requestNoneToast = axios.create({
    baseURL: REQUEST.baseURL + "/machine",
    timeout: REQUEST.timeout,
    headers: { withCredentials: true }
});
requestNoneToast.interceptors.request.use(
    config => {
        Toast.loading(ENV.REQUEST.msg_loading, 0);
        config.headers["Authorization"] = ENV.AUTHORIZATION;
        return config;
    }, 
    error => {
        Toast.fail(ENV.REQUEST.msg_neterr);
        return Promise.reject(error);
    }
);
requestNoneToast.interceptors.response.use(
    ({ data }) => {
        Toast.hide();
        console.log("2");
        console.log(data);
        return data;
    }, 
    error => {
        Toast.fail(ENV.REQUEST.msg_neterr);
        return Promise.reject(error);
    }
);

export { request as default, requestNoneToast };