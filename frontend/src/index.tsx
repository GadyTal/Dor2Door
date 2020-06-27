import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import './setupErrorTracking';
import { HashRouter } from "react-router-dom";
import './i18n';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
