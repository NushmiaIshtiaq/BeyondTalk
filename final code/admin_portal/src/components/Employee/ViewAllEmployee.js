import React, { Component } from "react";

import {
  Row,
  Col,
  Card,
  Table,
  Divider,
  Tag,
  Button,
  Icon,
  Spin,
  Drawer,
  message,
  Popconfirm,
} from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";
import { DescriptionItem, pStyle } from "../Helper/helper";

// Services
import { ViewEmployees } from "../../services/employee.service";
import config from "../../util/config.json";

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

export default class ViewAllEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: null,
      loading: false,
      rowData: null,
      viewProfileInfo: null,
      visible: false,
      selectedImage: null,
    };
  }

  componentDidMount() {
    ViewEmployees()
      .then((response) => {
        let tableRowData = [];
        response.data.employees.map((employee) => {
          tableRowData.push({
            key: employee.userId,
            name: employee.name,
            contactNo: employee.contactNo,
            address: employee.mailingAddress,
            designation: employee.designation,
          });
        });

        this.setState({
          employees: response.data.employees,
          rowData: tableRowData,
          loading: true,
        });
      })

      .catch((err) => {
        console.log("Some Error Occur");
      });
  }

  onViewProfileInformation = (employeeId) => {
    const filterEmployee = this.state.employees.filter((employee) => {
      return employee.userId == employeeId;
    });

    this.setState({
      viewProfileInfo: filterEmployee[0],
      selectedImage: `${config.STORAGE_LINK}/${config.BUCKET_NAME}/${filterEmployee[0].imageUrl}`,
      visible: true,
    });
  };

  onDeleteEmployee = (employeeId) => {
    console.log("Employee deleted sccuessfully");
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onAddEmployee = () => {
    this.props.history.push("/addemployee");
  };
  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Contact No",
        dataIndex: "contactNo",
        key: "contactNo",
      },
      {
        title: "Mailing Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Designation",
        key: "designation",
        dataIndex: "designation",
        render: (text) => <Tag color={"geekblue"}>{text.toUpperCase()}</Tag>,
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.onViewProfileInformation(record.key);
              }}
            >
              View Profile
            </a>
            <Divider type="vertical" />

            <Popconfirm
              title="Are you sure delete this Employee?"
              onConfirm={() => {
                this.onDeleteEmployee(record.key);
              }}
              okText="Yes"
              cancelText="No"
            >
              <a href="">
                <Icon type="delete" style={{ color: "red" }} />
              </a>
            </Popconfirm>
          </span>
        ),
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
            <AdminNavbar {...this.props} activeValue="employee"></AdminNavbar>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card
              title="All Employees"
              extra={
                <Button
                  type="primary"
                  shape="round"
                  icon="user-add"
                  size="default"
                  onClick={this.onAddEmployee}
                >
                  Add Employee
                </Button>
              }
            >
              {this.state.loading ? (
                <Table columns={columns} dataSource={this.state.rowData} />
              ) : (
                <Row style={{ textAlign: "center" }}>
                  <Spin indicator={antIcon} size={"large"} />
                </Row>
              )}
            </Card>
          </Col>
        </Row>

        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {this.state.visible ? (
            <React.Fragment>
              <p style={{ ...pStyle, marginBottom: 24 }}>
                <b>
                  {this.state.viewProfileInfo.name.toUpperCase()} |{" "}
                  <Tag color={"geekblue"}>
                    {this.state.viewProfileInfo.designation.toUpperCase()}
                  </Tag>
                </b>
              </p>

              <Divider />
              <Row>
                <Col span={8} offset={6}>
                  <img
                    src={this.state.selectedImage}
                    className="img-thumbnail pic-box"
                    alt="Profile Picture"
                    style={{ height: "20rem", width: "15rem" }}
                  />
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="Age - Gender"
                    content={
                      this.state.viewProfileInfo.age +
                      " - " +
                      this.state.viewProfileInfo.gender
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="Mailing Address"
                    content={this.state.viewProfileInfo.mailingAddress}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="Permenant Address"
                    content={this.state.viewProfileInfo.permenantAddress}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="About"
                    content={this.state.viewProfileInfo.about}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="Contact No"
                    content={this.state.viewProfileInfo.contactNo}
                  />
                </Col>
              </Row>
              {this.state.viewProfileInfo.testReport != undefined ? (
                <React.Fragment>
                  <Divider></Divider>
                  <h3>Personality Test Report:</h3>
                  <Row>
                    <Col span={24}>
                      <DescriptionItem
                        title="Title"
                        content={
                          this.state.viewProfileInfo.testReport.personType.title
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <DescriptionItem
                        title="Attributes"
                        content={
                          this.state.viewProfileInfo.testReport.personType
                            .description
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <DescriptionItem
                        title="Precentage"
                        content={
                          this.state.viewProfileInfo.testReport.personType
                            .percentage
                        }
                      />
                    </Col>
                  </Row>
                  <Divider></Divider>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                        title="Extrovert"
                        content={
                          this.state.viewProfileInfo.testReport.extrovert + "%"
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                        title="Perceiving"
                        content={
                          this.state.viewProfileInfo.testReport.perceiving + "%"
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                        title="Introvert"
                        content={
                          this.state.viewProfileInfo.testReport.introvert + "%"
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                        title="Sensing"
                        content={
                          this.state.viewProfileInfo.testReport.sensing + "%"
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                        title="Intuition"
                        content={
                          this.state.viewProfileInfo.testReport.intuition + "%"
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                        title="Thinking"
                        content={
                          this.state.viewProfileInfo.testReport.thinking + "%"
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <DescriptionItem
                        title="Feeling"
                        content={
                          this.state.viewProfileInfo.testReport.feeling + "%"
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem
                        title="Judging"
                        content={
                          this.state.viewProfileInfo.testReport.judging + "%"
                        }
                      />
                    </Col>
                  </Row>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : (
            <Row style={{ textAlign: "center" }}>
              <Spin indicator={antIcon} size={"large"} />
            </Row>
          )}
        </Drawer>
      </React.Fragment>
    );
  }
}
