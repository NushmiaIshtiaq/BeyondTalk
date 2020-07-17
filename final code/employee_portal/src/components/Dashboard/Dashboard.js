import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  message,
  Icon,
  Button,
  Input,
  Radio,
  Spin,
  Divider,
} from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";

// Services
import { AddTestReport } from "../../services/test.services";
import { ViewProfile } from "../../services/profile.service";
import MyColumn from "./Chart";
import { getCurrentUser } from "../../services/auth.service";
import { sb } from "../../util/chat.init";
import { AddConversationLog } from "../../services/chat.service";

// Global Variables
let types = {
  ISTJ: {
    title: "The Traditionalist",
    percentage: "13.7%",
    description: "Dutiful, Practical, Logical, Methodical",
  },
  ISFJ: {
    title: "The Protector",
    percentage: "12.7%",
    description: "Dutiful, Practical, Supportive, Meticulous",
  },
  INFJ: {
    title: "The Guide",
    percentage: "1.7%",
    description: "Devoted, Innovative, Idealistic, Compassionate",
  },
  INTJ: {
    title: "The Visionary",
    percentage: "1.4%",
    description: "Independent, Innovative, Analytical, Purposeful",
  },
  ISTP: {
    title: "The Problem-Solver",
    percentage: "6.4%",
    description: "Expedient, Practical, Objective, Adaptable",
  },
  ISFP: {
    title: "The Harmonizer",
    percentage: "6.1%",
    description: "Tolerant, Realistic, Harmonious, Adaptable",
  },
  INFP: {
    title: "The Humanist",
    percentage: "3.2%",
    description: "Insightful, Innovative, Idealistic, Adaptable",
  },
  INTP: {
    title: "The Conceptualizer",
    percentage: "2.4%",
    description: "Questioning, Innovative, Objective, Abstract",
  },
  ESTP: {
    title: "The Activist",
    percentage: "5.8%",
    description: "Energetic, Practical, Pragmatic, Spontaneous",
  },
  ESFP: {
    title: "The Fun-Lover",
    percentage: "8.7%",
    description: "Spontaneous, Practical, Friendly, Harmonious",
  },
  ENFP: {
    title: "The Enthusiast",
    percentage: "6.3%",
    description: "Optimistic, Innovative, Compassionate, Versatile",
  },
  ENTP: {
    title: "The Entrepreneur",
    percentage: "2.8%",
    description: "Risk-Taking, Innovative, Outgoing, Adaptable",
  },
  ESTJ: {
    title: "The Coordinator",
    percentage: "10.4%",
    description: "Organized, Practical, Logical, Outgoing",
  },
  ESFJ: {
    title: "The Supporter",
    percentage: "12.6%",
    description: "Friendly, Practical, Loyal, Organized",
  },
  ENFJ: {
    title: "The Developer",
    percentage: "2.8%",
    description: "Friendly, Innovative, Supportive, Idealistic",
  },
  ENTJ: {
    title: "The Reformer",
    percentage: "2.9%",
    description: "Determined, Innovative, Strategic, Outgoing",
  },
};
const questionLength = 5;

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

class DashboardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "None",
      visible: false,
      answers: [],
      testGiven: false,
      testResult: null,
      employeePersonType: null,
      loading: false,
    };
  }

  componentDidMount() {
    ViewProfile().then((res) => {
      if (res.data.userData.testReport) {
        const report = res.data.userData.testReport;
        const data = [
          report.extrovert,
          report.introvert,
          report.sensing,
          report.intuition,
          report.thinking,
          report.feeling,
          report.judging,
          report.perceiving,
        ];
        this.setState({
          testGiven: res.data.userData.testReport.testGiven,
          testResult: data,
          employeePersonType: res.data.userData.testReport.personType,
          loading: true,
        });
      } else {
        this.setState({
          loading: true,
        });
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const myanswers = this.state.answers;

    if (myanswers.length < questionLength) {
      message.error("Please Must Fill " + questionLength + " Question");
    } else {
      let extrovert = 0,
        introvert = 0,
        sensing = 0,
        intuition = 0,
        thinking = 0,
        feeling = 0,
        judging = 0,
        perceiving = 0;
      let type = "";

      myanswers.map((answer) => {
        switch (answer.ans) {
          case "e":
            extrovert++;
            break;
          case "i":
            introvert++;
            break;
          case "s":
            sensing++;
            break;
          case "n":
            intuition++;
            break;
          case "t":
            thinking++;
            break;
          case "f":
            feeling++;
            break;
          case "j":
            judging++;
            break;
          case "p":
            perceiving++;
            break;
        }
      });

      const e = Math.floor((extrovert / 10) * 100);
      const i = Math.floor((introvert / 10) * 100);
      const s = Math.floor((sensing / 20) * 100);
      const n = Math.floor((intuition / 20) * 100);
      const t = Math.floor((thinking / 20) * 100);
      const f = Math.floor((feeling / 20) * 100);
      const j = Math.floor((judging / 20) * 100);
      const p = Math.floor((perceiving / 20) * 100);

      type += e >= i ? "E" : "I";
      type += s >= n ? "S" : "N";
      type += t >= f ? "T" : "F";
      type += j >= p ? "J" : "P";

      let saving_obj = {
        extrovert: e,
        introvert: i,
        sensing: s,
        intuition: n,
        thinking: t,
        feeling: f,
        judging: j,
        perceiving: p,
        personType: types[type],
        testGiven: true,
      };

      AddTestReport(saving_obj)
        .then((res) => {
          const data = [
            saving_obj.extrovert,
            saving_obj.introvert,
            saving_obj.sensing,
            saving_obj.intuition,
            saving_obj.thinking,
            saving_obj.feeling,
            saving_obj.judging,
            saving_obj.perceiving,
          ];

          this.setState({
            testGiven: true,
            testResult: data,
            employeePersonType: saving_obj.personType,
          });
          message.success("Test Report Added Sucessfully");
        })
        .catch((err) => {
          message.error("Something Bad Happpend");
        });
    }
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  onChange = (e) => {
    const { name, value } = e.target;
    const obj = { name: name, ans: value };
    const old_answers = this.state.answers;

    if (old_answers.length > 0) {
      let new_answers = old_answers.filter((item) => item.name != name);
      new_answers.push(obj);
      this.setState({
        answers: new_answers,
      });
    } else {
      let one_answers = [];
      one_answers.push(obj);
      this.setState({
        answers: one_answers,
      });
    }
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
          <Col span={1}></Col>
          <Col span={16}>
            <AdminNavbar {...this.props} activeValue="home"></AdminNavbar>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card title="Home">
              {this.state.loading ? (
                <React.Fragment>
                  {!this.state.testGiven ? (
                    <React.Fragment>
                      <Form onSubmit={this.handleSubmit} className="login-form">
                        <h1 className="white-text">MBTI Test</h1>
                        <div className="mbticlass">
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>At a party do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q1")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q1"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e" key="e">
                                        Interact with many, including strangers
                                      </Radio>
                                      <br></br>
                                      <Radio value="i" key="i">
                                        Interact with a few, known to you
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are you more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q2")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q2"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        Realistic than speculative
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">
                                        Speculative than realistic
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Is it worse to:</strong>
                              <Form.Item>
                                {getFieldDecorator("q3")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q3"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        Have your head in the clouds
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        Be in a rut
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are you more impressed by:</strong>
                              <Form.Item>
                                {getFieldDecorator("q4")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q4"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">Principles</Radio>
                                      <br></br>
                                      <Radio value="f">Emotions</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are more drawn toward the:</strong>
                              <Form.Item>
                                {getFieldDecorator("q5")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q5"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        Convincinfg
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        Touching
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you prefer to work:</strong>
                              <Form.Item>
                                {getFieldDecorator("q6")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q6"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">To deadlines</Radio>
                                      <br></br>
                                      <Radio value="p">Just whenever</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Do you tend to choose:</strong>
                              <Form.Item>
                                {getFieldDecorator("q7")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q7"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        Rather carefull
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        Somewhat impulsively
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>At parties do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q8")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q8"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e">
                                        Stay late, with increasing energy
                                      </Radio>
                                      <br></br>
                                      <Radio value="i">
                                        Leave early with decreased energy
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more attracted to:</strong>
                              <Form.Item>
                                {getFieldDecorator("q9")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q9"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        Sensible people
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        Imaginative peopl
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are you more interested in::</strong>
                              <Form.Item>
                                {getFieldDecorator("q10")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q10"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">What is actual</Radio>
                                      <br></br>
                                      <Radio value="n">What is possible</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                In judging others are you more swayed by:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q11")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q11"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        Laws than circumstances
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        Circumstances than laws
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                In approaching others is your inclination to be
                                somewhat:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q12")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q12"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">Objective</Radio>
                                      <br></br>
                                      <Radio value="f">Personal</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q13")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q13"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        Punctual
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        Leisurely
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                Does it bother you more having things:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q14")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q14"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">Incomplete</Radio>
                                      <br></br>
                                      <Radio value="p">Completed</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>In your social groups do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q15")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q15"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e" key="e">
                                        Keep abreast of other's happenings
                                      </Radio>
                                      <br></br>
                                      <Radio value="i" key="i">
                                        Get behind on the news
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                In doing ordinary things are you more likely to:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q16")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q16"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        Do it the usual way
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">
                                        Do it your own way
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Writers should:</strong>
                              <Form.Item>
                                {getFieldDecorator("q17")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q17"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        Say what they mean and mean what they
                                        say
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        Express things more by use of analogy
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Which appeals to you more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q18")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q18"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">
                                        Consistency of thought
                                      </Radio>
                                      <br></br>
                                      <Radio value="f">
                                        Harmonious human relationships
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Are you more comfortable in making:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q19")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q19"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        Logical judgments
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        Value judgments
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you want things:</strong>
                              <Form.Item>
                                {getFieldDecorator("q20")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q20"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">
                                        Settled and decided
                                      </Radio>
                                      <br></br>
                                      <Radio value="p">
                                        Unsettled and undecided
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Would you say you are more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q21")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q21"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        Serious and determined
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        Easy-going
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>In phoning do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q22")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q22"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e">
                                        Rarely question that it will all be said
                                      </Radio>
                                      <br></br>
                                      <Radio value="i">
                                        Rehearse what you will say
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Facts:</strong>
                              <Form.Item>
                                {getFieldDecorator("q23")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q23"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        Speak for themselves
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        Illustrate principles
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are visionaries:</strong>

                              <Form.Item>
                                {getFieldDecorator("q24")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q24"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">somewhat annoyin</Radio>
                                      <br></br>
                                      <Radio value="n">rather fascinatin</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more often:</strong>
                              <Form.Item>
                                {getFieldDecorator("q25")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q25"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="f" key="f">
                                        a cool-headed person
                                      </Radio>
                                      <br></br>
                                      <Radio value="t" key="t">
                                        a warm-hearted person
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Is it worse to be</strong>
                              <Form.Item>
                                {getFieldDecorator("q26")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q26"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">Unjust</Radio>
                                      <br></br>
                                      <Radio value="f">merciless</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Should one usually let events occur:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q27")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q27"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        by careful selection and choice
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        randomly and by chance
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you feel better about:</strong>
                              <Form.Item>
                                {getFieldDecorator("q28")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q28"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">having purchased</Radio>
                                      <br></br>
                                      <Radio value="p">
                                        having the option to buy
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>In company do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q29")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q29"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e" key="e">
                                        initiate conversation
                                      </Radio>
                                      <br></br>
                                      <Radio value="i" key="i">
                                        wait to be approached
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Common sense is:</strong>
                              <Form.Item>
                                {getFieldDecorator("q30")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q30"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        rarely questionable
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">
                                        frequently questionable
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Children often do not:</strong>
                              <Form.Item>
                                {getFieldDecorator("q31")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q31"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        make themselves useful enough
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        exercise their fantasy enough
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                In making decisions do you feel more comfortable
                                with:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q32")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q32"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">standards</Radio>
                                      <br></br>
                                      <Radio value="f">feelings</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more</strong>
                              <Form.Item>
                                {getFieldDecorator("q33")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q33"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        firm than gentle
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        gentle than firm
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Which is more admirable:</strong>
                              <Form.Item>
                                {getFieldDecorator("q34")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q34"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">
                                        the ability to organize and be
                                        methodical
                                      </Radio>
                                      <br></br>
                                      <Radio value="p">
                                        the ability to adapt and make do
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Do you put more value on:</strong>
                              <Form.Item>
                                {getFieldDecorator("q35")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q35"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        Infinite
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        Open-minded
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                Does new and non-routine interaction:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q36")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q36"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e">
                                        stimulate and energize you
                                      </Radio>
                                      <br></br>
                                      <Radio value="i">tax your reserves</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more frequently:</strong>
                              <Form.Item>
                                {getFieldDecorator("q37")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q37"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        a practical sort of person
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        a fanciful sort of person
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are you more likely to:</strong>
                              <Form.Item>
                                {getFieldDecorator("q38")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q38"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        see how others are useful
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">
                                        see how others are useful
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Which is more satisfying:</strong>
                              <Form.Item>
                                {getFieldDecorator("q39")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q39"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        to discuss an issue thoroughly
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        to arrive at agreement on an issue
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Which rules you more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q40")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q40"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">your head</Radio>
                                      <br></br>
                                      <Radio value="f">your heart</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Are you more comfortable with work that:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q41")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q41"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        contracted
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        done on a casual basis
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you tend to look for:</strong>
                              <Form.Item>
                                {getFieldDecorator("q42")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q42"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">the orderly</Radio>
                                      <br></br>
                                      <Radio value="p">whatever turns up</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Do you prefer:</strong>
                              <Form.Item>
                                {getFieldDecorator("q43")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q43"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e" key="e">
                                        many friends with brief contact
                                      </Radio>
                                      <br></br>
                                      <Radio value="i" key="i">
                                        a few friends with more lengthy contact
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you go more by::</strong>
                              <Form.Item>
                                {getFieldDecorator("q44")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q44"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">facts</Radio>
                                      <br></br>
                                      <Radio value="n">principles</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more interested in</strong>
                              <Form.Item>
                                {getFieldDecorator("q45")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q45"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        production and distribution
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        design and research
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Which is more of a compliment:</strong>
                              <Form.Item>
                                {getFieldDecorator("q46")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q46"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">
                                        There is a very logical person.
                                      </Radio>
                                      <br></br>
                                      <Radio value="f">
                                        There is a very sentimental person.
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Do you value in yourself more that you are:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q47")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q47"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        unwavering
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        devoted
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you more often prefer the:</strong>
                              <Form.Item>
                                {getFieldDecorator("q48")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q48"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">
                                        final and unalterable statement
                                      </Radio>
                                      <br></br>
                                      <Radio value="p">
                                        tentative and preliminary statement
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you more comfortable:</strong>
                              <Form.Item>
                                {getFieldDecorator("q49")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q49"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        after a decision
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        before a decision
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q50")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q50"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e">
                                        speak easily and at length with
                                        strangers
                                      </Radio>
                                      <br></br>
                                      <Radio value="i">
                                        find little to say to strangers
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Are you more likely to trust your:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q51")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q51"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        experience
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        hunch
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you feel:</strong>
                              <Form.Item>
                                {getFieldDecorator("q52")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q52"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        more practical than ingenious
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">
                                        more ingenious than practical
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Which person is more to be complimented one of:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q53")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q53"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        clear reason
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        strong feeling
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are you inclined more to be:</strong>
                              <Form.Item>
                                {getFieldDecorator("q54")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q54"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">fair-minded</Radio>
                                      <br></br>
                                      <Radio value="f">sympathetic</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Is it preferable mostly to:</strong>
                              <Form.Item>
                                {getFieldDecorator("q55")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q55"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        make sure things are arranged
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        just let things happen
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                In relationships should most things be:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q56")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q56"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">re-negotiable</Radio>
                                      <br></br>
                                      <Radio value="p">
                                        random and circumstantial
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>When the phone rings do you:</strong>
                              <Form.Item>
                                {getFieldDecorator("q57")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q57"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e" key="e">
                                        hasten to get to it first
                                      </Radio>
                                      <br></br>
                                      <Radio value="i" key="i">
                                        hope someone else will answer
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you prize more in yourself:</strong>
                              <Form.Item>
                                {getFieldDecorator("q58")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q58"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        a strong sense of reality
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">
                                        a vivid imagination
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you drawn more to:</strong>
                              <Form.Item>
                                {getFieldDecorator("q59")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q59"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        fundamentals
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        overtones
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Which seems the greater error:</strong>
                              <Form.Item>
                                {getFieldDecorator("q60")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q60"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">
                                        to be too passionate
                                      </Radio>
                                      <br></br>
                                      <Radio value="f">
                                        to be too objective
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Do you see yourself as basically:</strong>
                              <Form.Item>
                                {getFieldDecorator("q61")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q61"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        hard-heade
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        soft-hearted
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>
                                Which situation appeals to you more:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q62")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q62"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">
                                        the structured and scheduled
                                      </Radio>
                                      <br></br>
                                      <Radio value="p">
                                        the unstructured and unscheduled
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Are you a person that is more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q63")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q63"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        routinized than whimsical
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        whimsical than routinized
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Are you more inclined to be:</strong>
                              <Form.Item>
                                {getFieldDecorator("q64")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q64"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="e">easy to approach</Radio>
                                      <br></br>
                                      <Radio value="i">somewhat reserved</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>In writings do you prefer:</strong>
                              <Form.Item>
                                {getFieldDecorator("q65")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q65"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s" key="s">
                                        the more literal
                                      </Radio>
                                      <br></br>
                                      <Radio value="n" key="n">
                                        the more figurative
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Is it harder for you to:</strong>
                              <Form.Item>
                                {getFieldDecorator("q66")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q66"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="s">
                                        identify with others
                                      </Radio>
                                      <br></br>
                                      <Radio value="n">utilize others</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>
                                Which do you wish more for yourself:
                              </strong>
                              <Form.Item>
                                {getFieldDecorator("q67")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q67"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t" key="t">
                                        clarity of reason
                                      </Radio>
                                      <br></br>
                                      <Radio value="f" key="f">
                                        strength of compassion
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Which is the greater fault:</strong>
                              <Form.Item>
                                {getFieldDecorator("q68")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q68"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="t">
                                        being indiscriminate
                                      </Radio>
                                      <br></br>
                                      <Radio value="f">being critical</Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                          <Row>
                            <Col span={10} offset={2}>
                              <strong>Do you prefer the:</strong>
                              <Form.Item>
                                {getFieldDecorator("q69")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q69"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j" key="j">
                                        planned event
                                      </Radio>
                                      <br></br>
                                      <Radio value="p" key="p">
                                        unplanned event
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10} offset={2}>
                              <strong>Do you tend to be more:</strong>
                              <Form.Item>
                                {getFieldDecorator("q70")(
                                  <Radio.Group>
                                    <Radio.Group
                                      name="q70"
                                      onChange={this.onChange}
                                    >
                                      <Radio value="j">
                                        deliberate than spontaneous
                                      </Radio>
                                      <br></br>
                                      <Radio value="p">
                                        spontaneous than deliberate
                                      </Radio>
                                    </Radio.Group>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>{" "}
                        </div>
                        <Form.Item style={{ textAlign: "center" }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ color: "white" }}
                          >
                            Submit Test
                          </Button>
                        </Form.Item>
                      </Form>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Row style={{ textAlign: "center" }}>
                        <h1>{this.state.employeePersonType.title}</h1>
                        <h2>{this.state.employeePersonType.description}</h2>
                        <h4>
                          Percentage: {this.state.employeePersonType.percentage}
                        </h4>
                      </Row>
                      <Divider></Divider>
                      <Row>
                        <MyColumn mydata={this.state.testResult}></MyColumn>
                      </Row>
                    </React.Fragment>
                  )}
                </React.Fragment>
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

const Dashboard = Form.create({ name: "dashboard_form" })(DashboardForm);

export default Dashboard;
