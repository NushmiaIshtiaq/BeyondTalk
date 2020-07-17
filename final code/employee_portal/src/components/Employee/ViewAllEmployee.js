import React, { Component } from "react";

import {
  Row,
  Col,
  Card,
  Table,
  Divider,
  Tag,
  Icon,
  Spin,
  Drawer,
  message
} from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";
import { DescriptionItem, pStyle } from "../Profile/helper";

// Services
import { ViewEmployees, AddEmployee } from "../../services/employee.service";
import config from "../../util/config.json";
import { sb } from "../../util/chat.init";
import { getCurrentUser } from "../../services/auth.service";

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

export default class ViewAllEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: null,
      contact: null,
      loading: false,
      rowData: null,
      viewProfileInfo: null,
      visible: false,
      selectedImage: null
    };
  }

  componentDidMount() {
    ViewEmployees()
      .then(response => {
        let tableRowData = [];
        response.data.employees.map(employee => {
          tableRowData.push({
            key: employee.userId,
            name: employee.name,
            contactNo: employee.contactNo,
            address: employee.mailingAddress,
            designation: employee.designation
          });
        });

        this.setState({
          employees: response.data.employees,
          rowData: tableRowData,
          contact: response.data.employeeContacts,
          loading: true
        });
      })

      .catch(err => {
        console.log("Some Error Occur");
      });
  }

  onViewProfileInformation = employeeId => {
    const filterEmployee = this.state.employees.filter(employee => {
      return employee.userId == employeeId;
    });

    this.setState({
      viewProfileInfo: filterEmployee[0],
      selectedImage: `${config.STORAGE_LINK}/${config.BUCKET_NAME}/${filterEmployee[0].imageUrl}`,
      visible: true
    });
  };

  onAddToContact = employeeId => {
    AddEmployee(employeeId)
      .then(response => {
        const current_employee = getCurrentUser().user.id;
        const isOneToOne = true;

        let newContact = this.state.contact;
        newContact.push(employeeId);
        this.setState({
          contact: newContact
        });
        sb.connect(current_employee, (user, err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            sb.GroupChannel.createChannelWithUserIds(
              [current_employee, employeeId],
              isOneToOne,
              (conversation, error) => {
                if (!error) {
                  message.success("Contact Add Successfully");
                } else {
                  console.log(error);
                }
              }
            );
          }

          sb.reconnect();
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
        render: text => <a>{text}</a>
      },
      {
        title: "Contact No",
        dataIndex: "contactNo",
        key: "contactNo"
      },
      {
        title: "Mailing Address",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Designation",
        key: "designation",
        dataIndex: "designation",
        render: text => <Tag color={"geekblue"}>{text.toUpperCase()}</Tag>
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
            {this.state.contact.includes(record.key) ? (
              <Icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
              />
            ) : (
              <a
                onClick={() => {
                  this.onAddToContact(record.key);
                }}
              >
                <Icon type="user-add" />
              </a>
            )}
          </span>
        )
      }
    ];

    return (
      <React.Fragment>
        <Row style={{ padding: "2%" }}>
          <Col span={6}>
            <h1>Beyond Talk</h1>
          </Col>
          <Col span={18}>
            <AdminNavbar {...this.props} activeValue="employee"></AdminNavbar>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card title="All Employees">
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
