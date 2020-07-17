import React, { Component } from "react";
import { Row, Form, Icon, Input, Button, Col, Alert, Avatar } from "antd";
import { Link } from "react-router-dom";

// Components
import AuthNavBar from "../NavBar/AuthNavBar";

// Services
import { Login as LoginUser, SaveUser } from "../../services/auth.service";
import { sb } from "../../util/chat.init";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "None",
      visible: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { username, password } = values;
        LoginUser(username, password)
          .then((response) => {
            const USER_ID = response.data.user.id;
            SaveUser(response.data);

            sb.connect(USER_ID, (user, err) => {
              if (err) {
                console.log(err);
                return;
              }
              this.props.history.push("/dashboard");
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

  render() {
    const { getFieldDecorator } = this.props.form;
    function changeBorder(e) {
      e.target.style.borderColor = "#b89eba";
    }
    function changeBorder1(e) {
      e.target.style.borderColor = "#3df5ec";
    }
    function sizechange(e) {
      e.target.style.width = "20px";
    }
    return (
      <React.Fragment>
        <AuthNavBar></AuthNavBar>
        <Avatar
          style={{
            backgroundColor: "rgb(184, 158, 186,0.8)",
            width: "3cm",
            height: "3cm",
            marginLeft: "68%",
          }}
        ></Avatar>
        <Row>
          <Col span={8} offset={8}>
            <Avatar
              style={{
                backgroundColor: "rgb(184, 158, 186,0.7)",
                width: ".5cm",
                height: ".5cm",
                marginLeft: "160%",
              }}
            ></Avatar>
            <Avatar
              style={{
                backgroundColor: "rgb(61, 245, 236,0.7) ",
                width: "3cm",
                height: "3cm",
                marginLeft: "-47%",
                marginBottom: "20px",
              }}
            ></Avatar>
            <Avatar
              style={{
                backgroundColor: "rgb(61, 245, 236,0.7) ",
                width: ".5cm",
                height: ".5cm",
                marginLeft: "10%",
                marginTop: "60%",
              }}
            ></Avatar>
            {this.state.visible ? (
              <Alert
                message={this.state.error}
                type="error"
                closable
                afterClose={this.handleClose}
              />
            ) : null}

            <Form
              onSubmit={this.handleSubmit}
              className="login-form"
              style={{ marginTop: "-70%" }}
            >
              <div className="d1">
                <img src="BTLOGO.png" className="img1"></img>
                <Form.Item>
                  {getFieldDecorator("username", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ],
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,0.25)" }}
                        />
                      }
                      placeholder="Username"
                      onMouseOver={changeBorder}
                      onMouseOut={changeBorder1}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ],
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,0.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                      onMouseOver={changeBorder}
                      onMouseOut={changeBorder1}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ marginLeft: "32%" }}
                    type="primary"
                    htmlType="submit"
                    className="bt1-login"
                    //className="login-form-button"
                  >
                    <strong>Log in</strong>
                  </Button>
                  <br></br>
                </Form.Item>
                <Form.Item
                  style={{
                    paddingLeft: "24%",

                    marginTop: "-10%",
                  }}
                >
                  <Link to="/forgotpassword">
                    <u>
                      <p>
                        Forgot password? <strong>Reset</strong>
                      </p>
                    </u>
                  </Link>
                </Form.Item>
              </div>
            </Form>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const Login = Form.create({ name: "login_form" })(LoginForm);

export default Login;
