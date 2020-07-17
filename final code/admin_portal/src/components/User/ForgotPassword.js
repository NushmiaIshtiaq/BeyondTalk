import React, { Component } from "react";
import {
  Row,
  Form,
  Icon,
  Input,
  Button,
  Col,
  message,
  Alert,
  Avatar,
} from "antd";

// Components
import AuthNavBar from "../NavBar/AuthNavBar";
import { Link } from "react-router-dom";
import { ForgotPassword as ForgotPasswordService } from "../../services/auth.service";

class ForgotPasswordForm extends Component {
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
        const { email } = values;
        ForgotPasswordService(email)
          .then((response) => {
            message.success("Email Send Succesfully ");
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
    return (
      <React.Fragment>
        <AuthNavBar></AuthNavBar>

        <Row>
          <Avatar
            style={{
              backgroundColor: "rgb(184, 158, 186,0.8)",
              width: "3cm",
              height: "3cm",
              marginLeft: "68%",
            }}
          ></Avatar>
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
                marginLeft: "20%",
                marginTop: "140px",
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
              style={{ marginTop: "-50%" }}
              onSubmit={this.handleSubmit}
              className="login-form"
            >
              <div className="d1">
                <img className="img1" src="BTLOGO.png"></img>
                <Form.Item>
                  {getFieldDecorator("email", {
                    rules: [
                      { required: true, message: "Please input your Email!" },
                    ],
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="mail"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="Email"
                      type="email"
                      onMouseOver={changeBorder}
                      onMouseOut={changeBorder1}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    //className="login-form-button"
                    className="bt1-fp"
                  >
                    Forgot Password
                  </Button>
                  <br></br>
                  <Link
                    className="links"
                    to="/login"
                    style={{
                      marginLeft: "40%",
                    }}
                  >
                    <u>
                      <strong>
                        Login
                        <Icon type="login" />
                      </strong>
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

const ForgotPassword = Form.create({ name: "forgotpassword_form" })(
  ForgotPasswordForm
);

export default ForgotPassword;
