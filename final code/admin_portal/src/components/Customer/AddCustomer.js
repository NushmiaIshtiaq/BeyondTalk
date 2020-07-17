import React, { Component } from "react";

import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Icon,
  Alert,
  Input,
  message,
} from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";

// Services
import { Register, getCurrentUser } from "../../services/auth.service";
import { sb } from "../../util/chat.init";

class AddCustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "None",
      visible: false,
      userid: null,
      loginButtonLoading: false,
    };
  }

  componentDidMount() {
    const user = getCurrentUser();
    this.setState({
      userid: user.user.id,
    });
  }

  onGoBack = () => {
    this.props.history.push("/customers");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loginButtonLoading: true });
        const data = {
          username: values.username,
          password: values.password,
          email: values.email,
          role: "customer",
        };
        Register(data)
          .then((response) => {
            const companyid = response.data.customerId;
            const adminid = this.state.userid;
            const isOneToOne = true;

            sb.connect(companyid, (user, err) => {
              if (err) {
                console.log(err);
                return;
              } else {
                sb.updateCurrentUserInfo(values.username, null, function (
                  response,
                  error
                ) {
                  if (error) {
                    console.log(error);
                    return;
                  } else {
                    sb.GroupChannel.createChannelWithUserIds(
                      [adminid, companyid],
                      isOneToOne,
                      (conversation, error) => {
                        if (!error) {
                          message.success("Customer Add Successfully");
                          window.location.reload(true);
                        } else {
                          console.log(error);
                        }
                      }
                    );
                  }
                });
              }

              sb.reconnect();
            });
          })
          .catch((e) => {
            this.setState({
              error: e.response.data.err,
              visible: true,
            });
          });
      }
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        <Row style={{ padding: "1%" }}>
          <Col span={1}></Col>
          <Col span={5}>
            <img src="BTLOGO.png" className="main_image"></img>
          </Col>

          <Col span={17}>
            <AdminNavbar {...this.props} activeValue="customers"></AdminNavbar>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card
              title="Add Customer"
              extra={
                <Button
                  type="default"
                  shape="round"
                  icon="arrow-left"
                  size="default"
                  onClick={this.onGoBack}
                >
                  Go Back
                </Button>
              }
            >
              <Row>
                <Col span={8} offset={8} style={{ paddingTop: "2%" }}>
                  <h3 style={{ textAlign: "center", lineHeight: 2 }}>
                    Register New Customer
                  </h3>
                  {this.state.visible ? (
                    <Alert
                      message={this.state.error}
                      type="error"
                      closable
                      afterClose={this.handleClose}
                    />
                  ) : null}
                  {this.state.visible ? (
                    <Alert
                      message={this.state.error}
                      type="error"
                      closable
                      afterClose={this.handleClose}
                    />
                  ) : null}
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                      {getFieldDecorator("username", {
                        rules: [
                          {
                            required: true,
                            message: "Please input Customer username!",
                          },
                        ],
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Username"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("email", {
                        rules: [
                          {
                            required: true,
                            message: "Please input Customer Email!",
                          },
                        ],
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="mail"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          type="email"
                          placeholder="Email"
                        />
                      )}
                    </Form.Item>
                    <Form.Item hasFeedback>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                          {
                            validator: this.validateToNextPassword,
                          },
                        ],
                      })(
                        <Input.Password
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Password"
                        />
                      )}
                    </Form.Item>
                    <Form.Item hasFeedback>
                      {getFieldDecorator("confirm", {
                        rules: [
                          {
                            required: true,
                            message: "Please confirm your password!",
                          },
                          {
                            validator: this.compareToFirstPassword,
                          },
                        ],
                      })(
                        <Input.Password
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Confirm Password"
                          onBlur={this.handleConfirmBlur}
                        />
                      )}
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        loading={this.state.loginButtonLoading}
                      >
                        Register Customer
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const AddCustomer = Form.create({ name: "add_customer_form" })(AddCustomerForm);

export default AddCustomer;
