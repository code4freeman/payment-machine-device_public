import React from "react";
import "./index.less";

export default class Error404 extends React.Component {
    render () {
        return (
            <div className="error404">
                <a href="../">back</a>
                <h1>404</h1>
            </div>
        )
    }
}