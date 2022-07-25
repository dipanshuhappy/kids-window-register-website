import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import BrowserRouter from "react-router-dom/BrowserRouter";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from 'react-alert-template-basic'
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout:4000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};
ReactDOM.render(
  <BrowserRouter>
  <AlertProvider  template={AlertTemplate} {...options}>
    <App />
    </AlertProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
if (undefined /*[snowpack] import.meta.hot */) {
  undefined /*[snowpack] import.meta.hot */
    .accept();
}
