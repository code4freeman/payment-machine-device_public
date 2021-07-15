import React from "react";
import routes from "./routes";
import { HashRouter, Route, Switch } from "react-router-dom";

export default class Router extends React.Component {
    buildRoute (routes = []) {
        return (
            <HashRouter>
                <Switch>
                    {routes.map(item => (
                        <Route key={item.path}  exact path={item.path} component={item.component}></Route>
                    ))}
                </Switch>
            </HashRouter>
        )
    }
    render () {
        return this.buildRoute(routes);
    }
}