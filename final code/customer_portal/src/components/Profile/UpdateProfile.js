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
  Spin,
  Select,
} from "antd";

import * as Mime from "mime-types";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";

// Services
import {
  ViewProfile,
  UpdateProfile as UpdateUserInfo,
} from "../../services/profile.service";
import config from "../../util/config.json";
import TextArea from "antd/lib/input/TextArea";
import { getCurrentUser } from "../../services/auth.service";
import { sb } from "../../util/chat.init";

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

const { Option } = Select;

class UpdateProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editName: null,
      editContactNo: null,
      editMailingAddress: null,
      editAbout: null,
      editGender: null,
      error: "None",
      visible: false,
      image: null,
      selectedImage: null,
      image_meta: null,
      loading: false,
      updateButtonLoading: false,
    };
  }

  componentWillMount() {
    ViewProfile().then((response) => {
      const profileInformation = response.data.userData;
      this.setState({
        editName: profileInformation.name,
        editContactNo: profileInformation.contactNo,
        editMailingAddress: profileInformation.mailingAddress,
        editAbout: profileInformation.about,
        editGender: profileInformation.gender,

        selectedImage: `${config.STORAGE_LINK}/${config.BUCKET_NAME}/${profileInformation.imageUrl}`,

        loading: true,
      });
    });
  }

  onGoBack = () => {
    this.props.history.push("/profile");
  };

  // Image Upload Handler
  handleFileChange = (e) => {
    console.log("Upload event:", e);
    if (e.target.files.length < 1) {
      this.setState({
        ...this.state,
        image: null,
        selectedImage: null,
        image_meta: null,
      });
      return;
    }
    const image = e.target.files[0];
    const extension = Mime.extension(image.type) || "jpg";
    const meta = {
      size: image.size,
      name: image.name,
      contentType: image.type,
      extension: extension,
    };
    this.setState({
      image: image,
      selectedImage: URL.createObjectURL(image),
      image_meta: meta,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ updateButtonLoading: true });
        let chatImageURl = null;
        if (this.state.image_meta !== null) {
          chatImageURl = `${config.STORAGE_LINK}/${config.BUCKET_NAME}/public/customer/${values.name}/profile.${this.state.image_meta.extension}`;
        } else {
          chatImageURl = this.state.selectedImage;
        }
        const profileData = {
          ...this.state,
          name: values.name,
          contactNo: values.contactNo,
          mailingAddress: values.mailingAddress,
          about: values.about,
          gender: values.gender,
        };

        const data = {
          image: this.state.image,
          profileData,
        };

        UpdateUserInfo(data)
          .then((response) => {
            const USER_ID = getCurrentUser().user.id;
            sb.connect(USER_ID);
            sb.updateCurrentUserInfo(values.name, chatImageURl, function (
              response,
              error
            ) {
              if (error) {
                console.log(error);
                return;
              }
              message.success("Profile Updated Successfully");
              window.location.reload(true);
            });
          })
          .catch((e) => {
            if (e) {
              this.setState({
                error: "Something Wrong!!",
                visible: true,
              });
            }
          });
      }
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
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
          <Col span={3}></Col>
          <Col span={14}>
            <AdminNavbar {...this.props} activeValue="profile"></AdminNavbar>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card
              title="Update Profile Information"
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
              {this.state.loading ? (
                <Row>
                  <Col span={8} offset={4} style={{ paddingTop: "2%" }}>
                    <h3>Update Profile</h3>
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
                        {getFieldDecorator("name", {
                          initialValue: this.state.editName,
                          rules: [
                            {
                              required: true,
                              message: "Please input Your Full Name!",
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
                            placeholder="Full Name"
                          />
                        )}
                      </Form.Item>

                      <Form.Item>
                        {getFieldDecorator("contactNo", {
                          initialValue: this.state.editContactNo,

                          rules: [
                            {
                              required: true,
                              message: "Please input Your Contact No!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="phone"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            placeholder="Contact No"
                          />
                        )}
                      </Form.Item>

                      <Form.Item>
                        {getFieldDecorator("mailingAddress", {
                          initialValue: this.state.editMailingAddress,

                          rules: [
                            {
                              required: true,
                              message: "Please input Your Mailing Address!",
                            },
                          ],
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="home"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            placeholder="Mailing Address"
                          />
                        )}
                      </Form.Item>

                      <Form.Item>
                        {getFieldDecorator("gender", {
                          initialValue: this.state.editGender,
                          rules: [
                            {
                              required: true,
                              message: "Please input Your Gender",
                            },
                          ],
                        })(
                          <Select>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                          </Select>
                        )}
                      </Form.Item>

                      <Form.Item>
                        {getFieldDecorator("about", {
                          initialValue: this.state.editAbout,
                          rules: [
                            {
                              required: true,
                              message: "Please input Your Mailing Address!",
                            },
                          ],
                        })(
                          <TextArea
                            prefix={
                              <Icon
                                type="profile"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            placeholder="About"
                          />
                        )}
                      </Form.Item>

                      <Form.Item>
                        <input
                          type="file"
                          name="picture"
                          onChange={this.handleFileChange}
                        ></input>
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          loading={this.state.updateButtonLoading}
                        >
                          Update Profile
                        </Button>
                      </Form.Item>
                    </Form>
                  </Col>

                  <Col span={3} offset={2} style={{ paddingTop: "2%" }}>
                    {this.state.selectedImage !== null ? (
                      <React.Fragment>
                        <h4>Image Preview</h4>
                        <img
                          src={this.state.selectedImage}
                          className="img-thumbnail"
                          alt="Preview Profile"
                          style={{ width: "10rem" }}
                        />
                      </React.Fragment>
                    ) : null}
                  </Col>
                </Row>
              ) : (
                <React.Fragment>
                  <Row style={{ textAlign: "center" }}>
                    <Spin indicator={antIcon} size={"large"} />
                  </Row>
                </React.Fragment>
              )}
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const UpdateProfile = Form.create({ name: "add_employee_form" })(
  UpdateProfileForm
);

export default UpdateProfile;
