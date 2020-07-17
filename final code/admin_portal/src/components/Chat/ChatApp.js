import React, { Component } from "react";

import { Row, Col, Card, Button } from "antd";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";
import MyChat from "./Chat";

// Services
import { FetchAllConversation } from "../../services/chat.services";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: null,
      mylink: null,
      loading: false,
    };
    this.globalAdminChatChild = React.createRef();
  }

  downloadConversation = () => {
    this.setState({
      loading: true,
    });
    FetchAllConversation().then((res) => {
      const { conversations } = res.data;
      let allMyData = [];
      conversations.map((c) => {
        c.conversation.map((convo) => {
          let message_content = convo.message;

          const removeCommaMessage = message_content.replace(",", " ");
          const removelineSpaceMessage = removeCommaMessage.replace(
            /(\r\n|\n|\r)/gm,
            " "
          );
          const obj = {
            userIdOne: c.userIdOne,

            anotherUserId: c.anotherUserId,
            message: removelineSpaceMessage,
            senderUserId: convo.sender.userId,
            name: convo.sender.name,

            gender: convo.sender.gender,

            dateTime: convo.datetime,
          };
          allMyData.push(obj);
        });
      });

      const csv = this.parseJSONToCSVStr(allMyData);

      let dataUri = "data:text/csv;charset=utf-8," + csv;

      this.setState({
        allData: allMyData,
        mylink: dataUri,
        loading: false,
      });
    });
  };

  parseJSONToCSVStr(jsonData) {
    if (jsonData.length == 0) {
      return "";
    }

    let keys = Object.keys(jsonData[0]);

    let columnDelimiter = ",";
    let lineDelimiter = "\n";

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.map((data) => {
      csvStr += data.userIdOne;
      csvStr += columnDelimiter;
      csvStr += data.anotherUserId;
      csvStr += columnDelimiter;
      csvStr += data.message;
      csvStr += columnDelimiter;
      csvStr += data.senderUserId;
      csvStr += columnDelimiter;
      csvStr += data.name;
      csvStr += columnDelimiter;
      csvStr += data.gender;
      csvStr += columnDelimiter;
      csvStr += data.dateTime;
      csvStr += lineDelimiter;
    });

    console.log(csvStr);
    return encodeURIComponent(csvStr);
  }

  callHandler = (isCaller, friendID, config, friendName) => {
    this.globalAdminChatChild.current.startCall(
      isCaller,
      friendID,
      config,
      friendName
    );
  };

  render() {
    return (
      <React.Fragment>
        <Row style={{ padding: "1%" }}>
          <Col span={1}></Col>
          <Col span={5}>
            <img src="BTLOGO.png" className="main_image"></img>
          </Col>

          <Col span={17}>
            <AdminNavbar
              ref={this.globalAdminChatChild}
              {...this.props}
              activeValue="chat"
            ></AdminNavbar>
          </Col>
          <Col span={1}></Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card
              title="Chat Application"
              extra={
                !this.state.loading ? (
                  <Button
                    type="primary"
                    shape="round"
                    icon="cloud-download"
                    size="default"
                    onClick={this.downloadConversation}
                  >
                    <a
                      href={this.state.mylink}
                      target="_blank"
                      download="data.csv"
                      style={{ paddingLeft: "5px", color: "white" }}
                    >
                      <b style={{ color: "white" }}>Export All Conversation</b>
                    </a>
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    shape="round"
                    icon="loading"
                    size="default"
                    disabled
                  >
                    Export All Conversation
                  </Button>
                )
              }
            >
              <MyChat
                globalstartcall={this.callHandler}
                {...this.props}
              ></MyChat>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
