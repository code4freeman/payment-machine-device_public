import React from "react";
import "./index.less";

import { Button } from "antd-mobile";

export default class Test extends React.Component {
    render () {
        return (
            <div>
                <a href="../">back</a>
                <h1>Test</h1>
                <Button>Hello World</Button>
            </div>
        )
    }
}