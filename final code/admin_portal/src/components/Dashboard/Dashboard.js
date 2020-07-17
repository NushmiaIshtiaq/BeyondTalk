import React, { Component } from "react";
import { Row, Col, Card } from "antd";
import AdminNavbar from "../NavBar/AdminNavbar";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Row style={{ padding: "1%" }}>
          <Col span={1}></Col>
          <Col span={5}>
            <img src="BTLOGO.png" className="main_image"></img>
          </Col>

          <Col span={17}>
            <AdminNavbar {...this.props} activeValue="home"></AdminNavbar>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card title="Home"></Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
