import React, { Component } from "react";
import "./index.less";
import { Button } from "antd-mobile";
import { getOrder } from "@api/index";
import { say } from "@util";
import { connect } from "react-redux";
const { Command } = window.require("escpos-printer");

class PayDone extends Component {
    constructor (props) {
        super(props);
        this.state.orderNumber = this.props.match.params.orderNumber;
    }

    state = {
        orderNumber: "",
        canToHome: false,
    }

    componentDidMount () {
        this.loadOrder();
    }

    async loadOrder () {
        const res = await getOrder({ orderNumber: this.state.orderNumber });
        if (res) {
            say(ENV.TTS.text_print);
            await this.printer(res);
            this.setState({ canToHome: true });
        }
    }

    async printer ({ data }) {
        let cmd = new Command({ printeWidth: "58mm" });

        cmd.fontSize(1).textCenter("收银小票", "-")
        .newLine(4)
        .fontSize()
        .textRow(["商品", "数量", "小计"])
        .text("_".repeat(32))
        .newLine(2);
        data.products.forEach(p => {
            cmd.textRow([p.title, "x" + p.count, "￥" + p.pay_amount]); 
        });
        cmd.newLine(1)
        .text("_".repeat(32))
        .newLine(2)
        .text("总计：" + data.pay_amount + "元")
        .newLine()
        .text("实收：" + data.pay_amount + "元")
        .newLine(2)
        .fontSize(1)
        .textCenter("欢迎再来", " ")
        .fontSize()
        .newLine(5)
        //二维码
        .textCenter("关注我的github", " ")
        .textCenter("https://github.com/lilindog", " ")
        .newLine();
        await cmd.qrcode("https://github.com/lilindog");
        cmd.newLine(2);
        await this.props.printer.write(cmd.export());
    }

    render () {
        const state = this.state;
        return (
            <div className="pay-done">
                <div className="done">
                    <div className="iconfont icon-wancheng"></div>
                    <div className="text">支付完成</div>
                </div>

                <div className="btn-group">
                    <Button disabled={!state.canToHome} className="home-btn" type="primary" onClick={() => this.props.history.replace("/")}>完成</Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        printer: state.machine.printer
    }
}

function mapDispatchToProps (dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PayDone);