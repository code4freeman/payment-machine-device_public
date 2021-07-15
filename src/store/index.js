import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import machine from "./reducers/machine";

export default createStore(
    combineReducers({
        machine
    }),
    applyMiddleware(thunk)
);