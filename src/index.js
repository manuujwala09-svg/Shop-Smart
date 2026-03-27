import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
// In src/index.js or src/setupAxios.js
import axios from "axios";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
