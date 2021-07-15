import React from "react";
import "./index.less";
import { connect } from "react-redux";
import { INIT_DEVICE } from "@actions/machine";
import { Button, Icon } from "antd-mobile";
import { say } from "@util";

class Home extends React.Component {

    constructor (props) {
        super(props);
    }

    state = {
        isNet: false,
        isDev: ENV.WEBPACK_MODE === "development"
    }

    async testSay () {
        await say(ENV.TTS.text_showcode);
        console.log("play done");
    }

    async componentDidMount () {
        this.props.scanner.on("data", code => {
            if (!/^\d+$/.test(code)) return;
            this.props.scanner.beep(1);
            this.onToScanList(code);
        });
    }

    componentWillUnmount () {
         this.props.scanner.removeAllListeners("data");
    }

    onToScanList (code = "00001") {
        this.props.history.push("/scan-list/" + code);
    }

    onToWifiSetting () {
        this.props.history.push("/wifi-setting");
    }

    render () {
        const state = this.state, props = this.props;
        return (
            <div className="home">
                {props.isNet && <div className="in">
                    <div className="header">
                        <div className="inner-box">
                            <h3>欢迎使用</h3>
                            <h1>某某自助收银系统</h1>
                            <h4>这是一个前端技术栈实现的收银机原型</h4>
                        </div>
                    </div>
                    <div className="content">
                        <h3>扫描您商品开始自助结账</h3>
                        <div className="logo iconfont icon-saoma"></div>
                    </div>

                    {/* 开发环境点击测试用, 开发环境才有 */}
                    {state.isDev && <div>
                            <a onClick={this.onToScanList.bind(this)}>扫描列表页面</a> 
                            <span style={{ width: "10px", display: "inline-block", textAlign: "center" }}>|</span>
                            <a onClick={this.onToWifiSetting.bind(this)}>wifi设置</a>
                            <span style={{ width: "10px", display: "inline-block", textAlign: "center" }}>|</span>
                            <a onClick={this.testSay.bind(this)}>say测试</a>
                        </div>
                    }

                    <div className="copyright">https://github.com/lilindog/nwjs-project</div>
                </div>}

                {/* 无网络连接显示 */}
                <div className="in">
                    <div className="none-net">
                        <Icon className="icon" size="lg" type="cross-circle-o"/>
                        <p>暂无网络连接，请先设置网络连接</p>
                        <Button type="primary" onClick={this.onToWifiSetting.bind(this)}>去配置网络连接</Button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        printer: state.machine.printer,
        scanner: state.machine.scanner,
        isNet: state.machine.isNet
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);