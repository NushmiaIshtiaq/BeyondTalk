import React, { Component } from "react";
import { Row, Col, Card } from "antd";
import AdminNavbar from "../NavBar/AdminNavbar";

import socket from "../../util/socket";
import { getCurrentUser } from "../../services/auth.service";

export default class Dashboard extends Component {
  componentDidMount() {
    const userId = getCurrentUser().user.id;
    socket
      .on("init", ({ id: clientId }) => {
        console.log("Socket Created Successfully", clientId);
      })
      .emit("init", { my: userId });
  }
  render() {
    return (
      <React.Fragment>
        <Row style={{ padding: "1%" }}>
          <Col span={1}></Col>
          <Col span={5}>
            <img src="BTLOGO.png" className="main_image"></img>
          </Col>
          <Col span={3}></Col>
          <Col span={14}>
            <AdminNavbar {...this.props} activeValue="home"></AdminNavbar>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card title="Home">
              <h3>Welcome To Customer Portal !!</h3>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
