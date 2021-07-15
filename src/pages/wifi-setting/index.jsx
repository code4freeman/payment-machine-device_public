import React from "react";
import "./index.less";
import Keyboard from "../../lib/keyboard/index";
import { connect } from "react-redux";
import { NavBar, Icon, List, Button, Toast, Modal } from "antd-mobile";
const { Item } = List;

const { wifi } = window.require("raspi-helper");

class WifiSetting extends React.Component {
    state = {
        savedWifiList: [],
        wifiList: [],
        connectWifiToast: {
            show: false,
            ssid: "",
            keyboard: null
        }
    }
    constructor (props) {
        super(props);
    }
    async componentDidMount () {
        this.getCurrentConnectedWifi();
        this.onScanNearbyWifi();
        const { ssid, ip_address } = await wifi.status();
        if (ssid && ip_address) this.props.dispatchInitDevice(true);
    }
    onBack () {
        this.props.history.goBack();
    }

    getCurrentConnectedWifi () {
        const list = wifi.list();
        this.state.savedWifiList = list;
        this.setState({});
    }

    onScanNearbyWifi () {
        Toast.loading("扫描中");
        const savedSsids = this.state.savedWifiList.reduce((t, c) => {
            t.push(c.ssid);
            return t;
        }, []);
        const list = wifi.scan().sort((a, b) => a.signalLevel - b.signalLevel).filter(item => !savedSsids.includes(item.ssid));
        setTimeout(() => {
            Toast.hide();
            this.setState({ wifiList:  list });
            console.log(list);
        }, 500);
    }

    handleFrequencyNum (num) {
        num = String(num);
        return num.startsWith("2") ? "2.4G" : num.startsWith("5") ? "5G" : "-";
    }

    onDisconnectWifi () {
        console.log(this.state.savedWifiList);
        const { id } = this.state.savedWifiList.find(item => item.state === "CURRENT");
        console.log(id);
        if (id !== undefined) {
            wifi.disconnect(id);
            this.getCurrentConnectedWifi();
            this.props.dispatchInitDevice(false);
        }
        else Toast.fail("断开失败");
    }

    async onConnectWifi (id) {
        const { ssid } = this.state.savedWifiList.find(item => item.id == id);
        Toast.loading(`连接${ssid}`, 0);
        try {
            await wifi.connect(id);
        } catch(err) {
            Toast.fail("连接失败，请检查密码");
            wifi.remove(id);
            this.getCurrentConnectedWifi();
            return;
        }
        Toast.success(`已连接${ssid}`);
        this.props.dispatchInitDevice(true);
        this.getCurrentConnectedWifi();
    }

    onDeleteSavaedWifi (id) {
        console.log(typeof id);
        wifi.remove(Number(id));
        this.getCurrentConnectedWifi();
    }

    // 进入链接wifi步骤
    onToConnectWfi (item) {
        console.log(item);
        const _ = this.state.connectWifiToast;
        _.ssid = item.ssid;
        _.show = true;
        this.setState({});
        setTimeout(() => {
            _.keyboard = Keyboard.create([ document.getElementById("passinp1") ])[0];
        }, 300);
    }

    onCloseConnectWifi () {
        const _ = this.state.connectWifiToast;
        _.show = ""
        _.ssid = "";
        _.keyboard.destory();
        _.keyboard = null;
        this.setState({});
    }

    async onConnect () {
        const 
            _ = this.state.connectWifiToast,
            ssid = _.ssid,
            pass = document.getElementById("passinp1").value;
        if (!pass) return Toast.fail("请先输入密码");
        const id = wifi.add(ssid, pass);
        Toast.loading(`连接: ${ssid}`, 0);
        try {
            await wifi.connect(id);
        } catch(err) {
            Toast.fail("链接失败，请检查密码");
            wifi.remove(id);
            this.getCurrentConnectedWifi();
            return;
        }
        Toast.success(`已连接: ${ssid}`);
        this.props.dispatchInitDevice(true);
        this.getCurrentConnectedWifi();
        this.onScanNearbyWifi();
        this.onCloseConnectWifi();
    }

    render () {
        const state = this.state;
        const b = item => (
            <div>
                <Button size="small" inline onClick={this.onConnectWifi.bind(this, item.id)}>连接</Button>
                <Button size="small" inline onClick={this.onDeleteSavaedWifi.bind(this, item.id)}>删除</Button>                
            </div>
        );

        return (
            <div className="wifi-setting">
                <NavBar
                mode="dark"
                leftContent={[
                    <Icon key="0" type="left" style={{ marginRight: '16px' }} onClick={this.onBack.bind(this)}/>
                ]}
                >
                    WIFI 连接设置
                </NavBar>
                <List>
                    {state.savedWifiList.filter(item => item.state === "CURRENT").map(item => <Item extra={<div className="middle-flex"><span style={{ color: "green" }}>已连接</span><Button size="small" inline onClick={this.onDisconnectWifi.bind(this)}>断开连接</Button></div>} key={item.ssid}>{item.ssid}</Item>)}
                    {!state.savedWifiList.find(item => item.state === "CURRENT") && <Item>暂无连接的WIFI</Item>}
                </List>
                <List renderHeader="连接过的wifi">
                    {state.savedWifiList.filter(item => item.state !== "CURRENT").map((item, index) => <Item key={index} extra={b(item)}>{item.ssid}</Item>)}
                    {state.savedWifiList.filter(item => item.state !== "CURRENT").length === 0 && <p className="none-tips">空</p>}
                </List>
                <List renderHeader="周围的wifi">
                    {state.wifiList.map((item, index) => <Item key={index} extra={this.handleFrequencyNum(item.frequency) + " / 信号 -" + item.signalLevel} onClick={this.onToConnectWfi.bind(this, item)}>{item.ssid}</Item>)}
                </List>
                <div style={{padding: "10%"}}>
                    {state.wifiList.length === 0 && <p className="none-tips">空</p>}
                    <Button type="primary" onClick={this.onScanNearbyWifi.bind(this)}>{state.wifiList.length ? "刷新周围的wifi" : "扫描周围的wifi"}</Button>
                </div>

                {/* 链接wifi输入密码弹窗 */}
                <Modal
                popup
                visible={state.connectWifiToast.show}
                title={"连接到WIFI: " + state.connectWifiToast.ssid}
                >   
                    <div style={{ padding: "16px" }}>
                        <input type="text" id="passinp1" placeholder="输入wifi密码" autocomplete="off"/>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button style={{ width: "48%" }} onClick={this.onCloseConnectWifi.bind(this)}>取消</Button>
                            <Button style={{ width: "48%" }} type="primary" onClick={this.onConnect.bind(this)}>连接</Button>                        
                        </div>
                    </div>
                </Modal>

            </div>
        );
    }
}

function mapStateToProps (state) {
    return {}
}

function mapDispatchToProps (dispatch) {
    return {
        dispatchInitDevice (isNet) {
            dispatch({ type: "INIT_DEVICE", data: { isNet } });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WifiSetting);