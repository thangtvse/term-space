// @flow

import { createStore, applyMiddleware } from "redux";
import app from "./reducers";
import logger from "redux-logger";
import thunk from "redux-thunk";

const configureStore = () => {
    const middlewares = [thunk];
    if (process.env.NODE_ENV !== "production") {
        middlewares.push(logger);
    }

    return createStore(app, applyMiddleware(...middlewares));
};

export default configureStore;
