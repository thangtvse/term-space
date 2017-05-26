// @flow

import { Provider } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from "./App";

import "xterm/dist/xterm.css";
import "font-awesome-webpack";

/**
 * 
 * @param {*} param0 
 */
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);

Root.propTypes = {
    store: PropTypes.any
};

export default Root;
