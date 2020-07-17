import React, { Component } from "react";

import { Row, Col, Card, Table, Divider, Tag, Button } from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";

export default class ViewAllCustomers extends Component {
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
        render: text => <a>{text}</a>
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        sorter: (a, b) => a.age - b.age,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a>Update {record.name}</a>
            <Divider type="vertical" />
            <a>Delete</a>
          </span>
        )
      }
    ];

    const data = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"]
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"]
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"]
      }
    ];
    return (
      <React.Fragment>
        <Row style={{ padding: "2%" }}>
          <Col span={6}>
            <h1>Beyond Talk</h1>
          </Col>
          <Col span={18}>
            <AdminNavbar {...this.props} activeValue="customers"></AdminNavbar>
          </Col>
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
              <Table columns={columns} dataSource={data} />
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
