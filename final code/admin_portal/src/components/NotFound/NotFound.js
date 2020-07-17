import React, { Component } from "react";
import { Button } from "antd";

export default class NotFound extends Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <img alt="..." src={require("../../assests/img/404.png")} />
        <br></br>
        <Button type="primary" icon="retweet" size={"large"} href="/">
          Go To Home Page
        </Button>
      </div>
    );
  }
}
