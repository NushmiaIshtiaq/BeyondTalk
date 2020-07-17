import React, { Component } from "react";

// Components
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./util/route.config";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routing {...this.props} />
      </Router>
    );
  }
}
