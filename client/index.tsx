import React from "react";
import ReactDOM from "react-dom";
import Harmonizer from "./Harmonizer";
import { register } from "./serviceWorker";

ReactDOM.render(<Harmonizer />, document.getElementById("root"));
register();
