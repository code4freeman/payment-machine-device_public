import React from "react";
import "./index.less";
import { Button, Toast, Modal } from "antd-mobile";
import { getProductStock, createOrder } from "@api/index";
import { connect } from "react-redux";
import { say } from "@util";
import Big from "big.js";

class Row {
    static fields = {
        id: 1,
        img: "商品图片",
        title: "商品标题",
        amount: "0.00",
        count: 1,
        code: "",
    };
    constructor (options = {}) {
        Reflect.ownKeys(Row.fields).forEach(k => this[k] = options[k] || Row.fields[k]);
    }
}

class ScanList extends React.Component {
    timer = 0;
    isScan = true;
    state = {
        HOST: ENV.REQUEST.baseURL + "/static",
        list: [
            // new Row()
        ],
        isDev: ENV.WEBPACK_MODE  === "development"
    }

    constructor (props) {
        super(props);
    }

    async componentDidMount () {
        // 加载传入的code商品（如果有）
        const code = this.props.match.params.code;
        if (code) {
            this.isScan = false;
            setTimeout(() => {
                this.isScan = true;
            }, 800); // 经调试800ms最佳
            await this.appendProduct(code);
        }
        // 监听扫描器
        this.props.scanner.on("data", async code => {
             if (!/^\d+$/.test(code)) return;
            if (this.isScan) {
                this.isScan = false;
                this.props.scanner.beep(1);
                await this.appendProduct(code);
                setTimeout(() => {
                    this.isScan = true;
                }, 800); // 经调试800ms最佳
            }
        });
    }

    componentWillUnmount () {
        this.props.scanner && this.props.scanner.removeAllListeners && this.props.scanner.removeAllListeners("data");
    }

    async appendProduct (code) {
        try {
            var { data } = await getProductStock({ code });
        } catch (err) {}
        if (!data) {
            return this.noneProduct();
        }
        if (data.stock == 0) {
            return this.noneStock(data.title);
        }
        const row = this.state.list.find(i => i.code === code);
        if (row) {
            if (row.count + 1 > data.stock) {
                return this.noneStock(row.title);
            }
            row.count++;
        } else {
            this.state.list.push(new Row(data));
        }
        this.setState({});
    }

    onBack () {
        this.props.history.goBack();
    }

    onRemove (index) {
        const row = this.state.list[index] || [];
        Modal.alert('提示', `确定要删除 "${row.title}" 吗？`, [
            { text: '取消' },
            { text: '确定', onPress: del.bind(this) }
        ]);
        function del () {
            this.state.list.splice(index, 1);
            this.setState({ list: this.state.list });
        }
    }

    onSub (index) {
        const row = this.state.list[index] || [];
        if (row.count === 1) {
            Modal.alert('提示', `确定要删除 "${row.title}" 吗？`, [
                { text: '取消' },
                { text: '确定', onPress: del.bind(this) }
            ]);
        } else {
            del.call(this);
        }
        function del () {
            if (row.count > 1) {
                row.count--;
                this.setState({});
            } else {
                this.state.list.splice(index, 1);
                this.setState({ list: this.state.list });
            }
        }
    }

    noneStock (title) {
        say(ENV.TTS.text_stock);
        Modal.alert("提示", `商品 "${title}" 没有更多库存了！`, [
            { text: "我知道了" }
        ]);
    }

    noneProduct () {
        say(ENV.TTS.text_none);
        Toast.fail("暂无该商品");
    }

    // 增加商品（费扫码）需要询问库存是否有货
    async onAdd (index) {
        const 
        row = this.state.list[index] || {},
        { data } = (await getProductStock({ code: row.code })) || {};
        if (data) {
            if (data.stock < 1) {
                this.noneStock(row.title);
            } else {
                row.count++;
                this.setState({});
            }
        } else {    
            this.noneProduct();
        }
    }

    onCancelOrder () {
        if (this.state.list.length > 0) {
            Modal.alert("提示", "确定要退出结账吗?", [
                {text: "不退出"},
                {text: "退出", onPress: () => this.onBack() }
            ]);
        } else {
            this.onBack();
        }
    }

    // 创建订单，去结账
    async onCreateOrder () {
        if (this.state.list.length === 0) return Toast.fail("还没扫描任何商品");
        const products = this.state.list.slice().reduce((t, c) => {
            t.push({ id: c.id, count: c.count });
            return t;
        }, []);
        const { data: {orderNumber} } = await createOrder({ products });
        this.props.history.push("/buy/" + orderNumber);   
    }

    // 模拟扫码增加商品，真机请忽略
    async onMockAddProduct () {
        const id = (Math.random() * 10000) | 0;
        this.appendProduct(id);
    }

    productCount () {
        return this.state.list.reduce((t, c) => {
            t = Big(t).plus(c.count).toNumber();
            return t;
        }, 0);
    }

    totalAmount () {
        return this.state.list.reduce((t, c) => {
            t = Big(t).plus(Big(c.amount).times(c.count)).toNumber();
            return t;
        }, 0).toFixed(2);
    }

    render () {
        const state = this.state;
        return (
            <div className="scan-list">
                <div className="cards">
                    {state.list.map((item, index) => (
                        <div className="card" key={index}>
                            <img src={state.HOST + "/" + item.img} alt="商品图片"/>
                            <div className="right-content">
                                <div className="flex-row">
                                    <h1>{item.title}</h1>
                                    <Button type="warning" size="small" icon="cross-circle-o" onClick={this.onRemove.bind(this, index)}>移除</Button>
                                </div>
                                <div className="flex-row">
                                    <span className="price">￥{item.amount}</span>
                                    <div className="flex-row">
                                        <Button size="small" type="primary" onClick={this.onSub.bind(this, index)}>-</Button>
                                        <span className="count">{item.count}</span>
                                        <Button size="small" type="primary" onClick={this.onAdd.bind(this, index)}>+</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!state.list.length && (
                        <p className="none-tips">暂无商品，请扫描商品</p>
                    )}

                    {/* 模拟扫码器增加商品，开发模式才有 */}
                    {state.isDev && <Button onClick={this.onMockAddProduct.bind(this)}>点击模拟扫码</Button>}
                </div>
                <div className="info">
                    <div className="flex-row">
                        <span className="total-text">总计 {this.productCount()} 件商品</span>
                        <span className="total-price">￥{this.totalAmount()}</span>
                    </div>
                    <div className="flex-row btn-group">
                        <Button inline onClick={this.onCancelOrder.bind(this)}>取消交易</Button>
                        <div style={{width: "50px"}}></div>
                        <Button inline type="primary" onClick={this.onCreateOrder.bind(this)}> 去结账</Button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        scanner: state.machine.scanner
    }
}

function mapDispatchToProps (dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanList);