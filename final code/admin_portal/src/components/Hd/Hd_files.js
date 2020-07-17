import React, { Component, useEffect } from "react";
import { Row, Col, Card, Button, Table, Tag } from "antd";
import { GenerateReport } from "../../services/reporting.service";
import AdminNavbar from "../NavBar/AdminNavbar";
import Axios from "axios";
import config from "../../util/config.json";

export default class hd_files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true,
      allData: null,
      mylink: null,
      errors: null,
      rowData: null,
    };
  }
  componentDidMount() {
    this.getresult();
  }

  downloadReport = () => {
    GenerateReport()
      .then((response) => {
        let allMyData = [];
        response.data.map((users) => {
          const obj = {
            id: `${users.id} `,
            username: `${users.name}`,
            message: `${users.message} `,
            gender: `${users.gender}`,
            date: `${users.date} `,
          };
          allMyData.push(obj);
        });
        const csv = this.parseJSONToCSVStr(allMyData);

        let dataUri = "data:text/csv;charset=utf-8," + csv;
        this.setState({
          allData: allMyData,
          mylink: dataUri,
          isLoading: false,
        });
      })

      .catch((error) => this.setState({ error, isLoading: false }));
  };
  parseJSONToCSVStr(jsonData) {
    if (jsonData.length == 0) {
      return "";
    }

    let keys = Object.keys(jsonData[0]);

    let columnDelimiter = ",";
    let lineDelimiter = "\n";

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.map((data) => {
      csvStr += data.id;
      csvStr += columnDelimiter;
      csvStr += data.username;
      csvStr += columnDelimiter;
      csvStr += data.message;
      csvStr += columnDelimiter;
      csvStr += data.gender;
      csvStr += columnDelimiter;
      csvStr += data.date;
      csvStr += lineDelimiter;
    });

    console.log(csvStr);
    return encodeURIComponent(csvStr);
  }
  getresult() {
    Axios.get(`${config.PREDICTION_URI}/index_get_data`)

      .then((response) => {
        let tableRowData = [];
        response.data.map((users) => {
          tableRowData.push({
            id: `${users.id} `,
            username: `${users.name}`,
            message: `${users.message} `,
            gender: `${users.gender}`,
            date: `${users.date} `,
          });
        });
        this.setState({
          rowData: tableRowData,
          users: response.data,
          isLoading: false,
        });
      })

      .catch((error) => this.setState({ error, isLoading: false }));
  }

  render() {
    const { isLoading, users } = this.state;
    const columns = [
      {
        title: "Name",
        dataIndex: "username",
        key: "username",
        sorter: (a, b) => a.username.length - b.username.length,
        sortDirections: ["descend", "ascend"],
        render: (text) => <a>{text}</a>,
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Message",
        dataIndex: "message",
        key: "message",
      },
      {
        title: "Gender",
        key: "gender",
        dataIndex: "gender",
        render: (text) => <Tag color={"geekblue"}>{text.toUpperCase()}</Tag>,
      },
      {
        title: "Date/Time",
        key: "date",
        dataIndex: "date",
        render: (text) => <Tag color={"geekblue"}>{text.toUpperCase()}</Tag>,
      },
    ];

    return (
      <React.Fragment>
        <Row style={{ padding: "1%" }}>
          <Col span={1}></Col>
          <Col span={5}>
            <img src="BTLOGO.png" className="main_image"></img>
          </Col>

          <Col span={17}>
            <AdminNavbar {...this.props} activeValue="hd_files"></AdminNavbar>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Button
              type="primary"
              className="login-form-button"
              size="default"
              onClick={this.downloadReport}
            >
              <a
                href={this.state.mylink}
                target="_blank"
                download="Report.csv"
                style={{ paddingLeft: "5px", color: "white" }}
              >
                <b style={{ color: "white" }}>Download Report</b>
              </a>
            </Button>

            {!isLoading ? (
              <Table columns={columns} dataSource={this.state.rowData} />
            ) : (
              <Row style={{ textAlign: "center" }}>hjjhg</Row>
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
