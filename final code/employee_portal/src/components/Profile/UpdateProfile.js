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
  InputNumber,
  DatePicker,
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

import moment from "moment";

const dateFormat = "YYYY/MM/DD";
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
      editAge: null,
      editDesignation: null,
      editGender: null,
      editPermenantAddress: null,
      editDate: null,
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
        editAge: profileInformation.age,
        editDesignation: profileInformation.designation,
        editGender: profileInformation.gender,
        editPermenantAddress: profileInformation.permenantAddress,
        editDate: profileInformation.joiningDate,

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
          chatImageURl = `${config.STORAGE_LINK}/${config.BUCKET_NAME}/public/employee/${values.name}/profile.${this.state.image_meta.extension}`;
        } else {
          chatImageURl = this.state.selectedImage;
        }

        const profileData = {
          ...this.state,
          name: values.name,
          contactNo: values.contactNo,
          permenantAddress: values.permenantAddress,
          mailingAddress: values.mailingAddress,
          about: values.about,
          gender: values.gender,
          age: values.age,
          joiningDate: values.date._d,
          designation: values.designation,
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <React.Fragment>
        <Row style={{ padding: "1%" }}>
          <Col span={1}></Col>
          <Col span={5}>
            <img src="BTLOGO.png" className="main_image"></img>
          </Col>
          <Col span={1}></Col>
          <Col span={16}>
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
                  <Col span={10} offset={2} style={{ paddingTop: "2%" }}>
                    {/* <h3>Update Profile</h3> */}
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
                    <Form onSubmit={this.handleSubmit} {...formItemLayout}>
                      <Form.Item label="Name">
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

                      <Form.Item label="Contact Number">
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

                      <Form.Item label="Mailing Address">
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

                      <Form.Item label="Permenant Address">
                        {getFieldDecorator("permenantAddress", {
                          initialValue: this.state.editPermenantAddress,
                          rules: [
                            {
                              required: true,
                              message: "Please input Your Permenant Address!",
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
                            placeholder="Permenant Address"
                          />
                        )}
                      </Form.Item>

                      <Form.Item label="Designation ">
                        {getFieldDecorator("designation", {
                          initialValue: this.state.editDesignation,
                          rules: [
                            {
                              required: true,
                              message: "Please input Your Designation !",
                            },
                          ],
                        })(<Input placeholder="Designation" />)}
                      </Form.Item>

                      <Form.Item label="Age">
                        {getFieldDecorator("age", {
                          initialValue: this.state.editAge,
                          rules: [
                            {
                              required: true,
                              message:
                                "Please input Your Age Greater than 20 and less than 60!",
                            },
                          ],
                        })(
                          <InputNumber
                            min={20}
                            max={60}
                            size={"large"}
                            placeholder="Age"
                          />
                        )}
                      </Form.Item>

                      <Form.Item label="Joining Date">
                        {getFieldDecorator("date", {
                          initialValue: moment(this.state.editDate, dateFormat),
                          rules: [
                            {
                              type: "object",
                              required: true,
                              message: "Please select Joining Date!",
                            },
                          ],
                        })(<DatePicker format={dateFormat} />)}
                      </Form.Item>

                      <Form.Item label="Gender ">
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

                      <Form.Item label="About">
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

                      <Form.Item label="Upload Image">
                        <input
                          type="file"
                          name="picture"
                          onChange={this.handleFileChange}
                        ></input>
                      </Form.Item>

                      <Form.Item style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          htmlType="submit"
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
                          style={{ width: "20rem" }}
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
