const 
    Scanner = window.require("vguang-scanner"),
    { Printer } = window.require("escpos-printer"),
    { wifi } = window.require("raspi-helper");

import { Toast } from "antd-mobile";

/**
 * 初始化设备
 */
export function INIT_DEVICE () {
    return function (dispatch, getState) {
        let scanner, printer, isNet;
        Toast.loading("初始化设备...", 0);
        try {
            const { ssid, ip_address } = wifi.status();
            if (ssid && ip_address) {
                isNet = true;
            }
        } catch(err) {
            console.error(err);
            Toast.fail("初始化网络出错");
        }
        try {
            if(!getState().machine.scanner) {
                scanner = new Scanner({ mode: "tx200" });
            }
        } catch(err) {
            Toast.fail("初始化scanner出错");
            console.error(err);
        }
        try {
            printer = new Printer();
        } catch(err) {
            Toast.fail("初始化printer出错");
            console.error(err);
        }
        Toast.hide();
        dispatch({
            type: "INIT_DEVICE",
            data: {
                scanner, 
                printer,
                isNet
            }
        });
    }
}