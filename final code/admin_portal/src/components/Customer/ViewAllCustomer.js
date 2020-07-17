import React, { Component } from "react";

import {
  Row,
  Col,
  Card,
  Table,
  Divider,
  Button,
  Drawer,
  Spin,
  Icon,
  Popconfirm,
} from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";
import { DescriptionItem, pStyle } from "../Helper/helper";

// Services
import { ViewCustomers } from "../../services/customer.service";
import config from "../../util/config.json";

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

export default class ViewAllCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: null,
      loading: false,
      rowData: null,
      viewProfileInfo: null,
      visible: false,
      selectedImage: null,
    };
  }

  componentDidMount() {
    ViewCustomers()
      .then((response) => {
        let tableRowData = [];
        response.data.customers.map((customer) => {
          tableRowData.push({
            key: customer.userId,
            name: customer.name,
            contactNo: customer.contactNo,
            address: customer.mailingAddress,
          });
        });

        this.setState({
          customers: response.data.customers,
          rowData: tableRowData,
          loading: true,
        });
      })

      .catch((err) => {
        console.log("Some Error Occur");
      });
  }

  onViewProfileInformation = (customerId) => {
    const filterCustomer = this.state.customers.filter((customer) => {
      return customer.userId == customerId;
    });

    this.setState({
      viewProfileInfo: filterCustomer[0],
      selectedImage: `${config.STORAGE_LINK}/${config.BUCKET_NAME}/${filterCustomer[0].imageUrl}`,
      visible: true,
    });
  };

  onDeleteCustomer = (customerId) => {
    console.log("delete sccuessfully");
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onAddCustomer = () => {
    this.props.history.push("/addcustomer");
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
              title="Are you sure delete this Customer?"
              onConfirm={() => {
                this.onDeleteCustomer(record.key);
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
            <AdminNavbar {...this.props} activeValue="customer"></AdminNavbar>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card
              title="All Customers"
              extra={
                <Button
                  type="primary"
                  shape="round"
                  icon="user-add"
                  size="default"
                  onClick={this.onAddCustomer}
                >
                  Add Customer
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
                <b>{this.state.viewProfileInfo.name.toUpperCase()} </b>
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
                    title="Gender"
                    content={this.state.viewProfileInfo.gender}
                  />
                </Col>
              </Row>
              <br></br>

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
