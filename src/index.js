import React from "react";
import ReactDOM from "react-dom";
import Router from "./router/index";
import "./asstes/css/main.css";
import "antd-mobile/dist/antd-mobile.css";  
import { Provider } from "react-redux";
import store from "./store/index";
import { INIT_DEVICE } from "./store/actions/machine";

store.dispatch(INIT_DEVICE());

ReactDOM.render(
  <Provider store={store}>
    <Router/>
  </Provider>, 
  document.getElementById("root")
);
if (module.hot) {
  module.hot.accept(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Router/>
      </Provider>, 
      document.getElementById('root')
    );
  });
}