import React from "react";
import "./index.less";
import { NavBar, Button, Icon, List, Toast, Modal } from "antd-mobile";
import { getOrder, pay } from "@api/index";
import { say } from "@util";
import Big from "big.js";
import { connect } from "react-redux";

const { Item } = List;
const { Brief } = Item;

import pay_logo from "@asstes/img/pay-logo.png";

class Buy extends React.Component {
    constructor (props) {
        super(props);
    }

    canScan = true;

    state = {
        HOST: ENV.REQUEST.baseURL + "/static",
        orderNumber: "",
        order: null,
        list: [],
        isDev: ENV.WEBPACK_MODE,
    }

    async componentDidMount () {
        this.state.orderNumber = this.props.match.params.orderNumber;
        if (await this.loadOrder()) {
            say(ENV.TTS.text_showcode);
            this.startScanPayCode();
        }
    }

    async loadOrder () {
        const res = await getOrder({ orderNumber: this.state.orderNumber });
        this.setState({ list: res.data && res.data.products || [], order: res.data });
        if (res) return true;
    }

    startScanPayCode () {
        const scanner = this.props.scanner;
        if (!scanner) return;
        scanner.on("data", async code => {
            if (this.canScan) {
                scanner.beep(1);
                this.canScan = false;
                const res = await pay({ orderNumber: this.state.order.order_number, code });
                if (res && res.success) {
                    this.props.history.replace("/pay-done/" + this.state.order.order_number);
                }
                else {
                    say("支付失败");
                    if (res && res.message) {
                        Modal.alert("提示", res.message, [
                            { 
                                text: "我知道了",
                                onPress: () => {
                                    this.canScan = true;
                                }
                            }
                        ]);
                    } else {
                        Toast.fail(ENV.REQUEST.msg_syserr);
                        this.canScan = true;
                    }
                }
            }
        });
    }

    componentWillUnmount () {
        this.props.scanner && this.props.scanner.removeAllListeners("data");
    }

    onBack () {
        Modal.alert('提示', `确定要退出结算吗？`, [
            { text: '取消' },
            { 
                text: '确定', 
                onPress: async () => {
                    await say("退出结算");
                    this.props.history.replace("/");
                }
            }
        ]);
    }

    productCount () {
        return this.state.list.reduce((t, c) => {
            t = Big(t).plus(c.count).toNumber();
            return t;
        }, 0);
    }

    render () {
        const state = this.state;
        return (
            <div className="buy">
                <NavBar
                leftContent={<Icon type="left" onClick={this.onBack.bind(this)}/>}
                >
                    结账支付
                </NavBar>
                
                {state.order && <div className="wrap">

                    <List className="list">
                        {state.list.map((item, index) => <Item 
                            className="list-item"
                            key={index} 
                            thumb={<img src={state.HOST + "/" + item.img} className="list-img"/>}
                            extra={<span style={{ color: "red" }}>￥{item.amount}</span>}
                            >
                                {item.title}
                                <Brief>x{item.count} / 小计￥{item.pay_amount}元</Brief>
                            </Item>
                        )}

                        {/* 去往支付完成界面按钮，开发环境才有 */}
                        {state.isDev && <Button onClick={() => this.props.history.push("/pay-done/1234567890")}>去往支付完成页面</Button>} 
                    </List>

                    <div className="bottom">
                        <div className="in">
                            <img src={pay_logo} alt="支付图标"/>
                            <div className="right">
                                <p className="text2">共{this.productCount()}件商品</p>
                                <p className="text1">需支付: <span className="price">￥{state.order.pay_amount}</span></p>
                                <p className="summary">请向扫码器出示<span className="alipay">支付宝</span>付款码</p>
                            </div>
                        </div>
                    </div>

                </div>}
                
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        scanner: state.machine.scanner,
        printer: state.machine.printer
    }
}

function mapDispatchToProps (dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buy);