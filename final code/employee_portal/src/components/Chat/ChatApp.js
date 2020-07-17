import React, { Component } from "react";

import { Row, Col, Card } from "antd";
import moment from "moment";

// Components
import AdminNavbar from "../NavBar/AdminNavbar";
import MyChat from "./Chat";

// Services
import { getCurrentUser } from "../../services/auth.service";
import {
  AddConversationLog,
  FetchAllUserGender,
} from "../../services/chat.service";
import { sb } from "../../util/chat.init";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.globalAdminChatChild = React.createRef();
  }

  async componentDidMount() {
    await this.fetchDataFromSendBird.then((alldata) => {
      AddConversationLog(alldata).then((res) => {
        console.log(res);
      });
    });
  }

  fetchDataFromSendBird = new Promise((resolve, reject) => {
    let alldata = [];

    FetchAllUserGender().then((repsonse) => {
      const genderArray = repsonse.data.userGenderArray;

      const u = getCurrentUser().user;
      sb.connect(u.id, (us, err) => {
        if (err) {
          console.log(err);
          return;
        }
        let channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
        channelListQuery.includeEmpty = false;
        if (channelListQuery.hasNext) {
          channelListQuery.next(function (channelList, error) {
            if (error) {
              return;
            }
            for (let i = 0; i < channelList.length; i++) {
              const url = channelList[i].url;
              let allMessages = [];
              const userIdOne = channelList[i].members[0].userId;
              const anotherUserId = channelList[i].members[1].userId;

              sb.GroupChannel.getChannel(url, (channel, err) => {
                if (err) {
                  console.log(err);
                } else {
                  channel.markAsRead();
                  let prevMessageListQuery = channel.createPreviousMessageListQuery();
                  const LIMIT = 30;
                  const isReverse = false;
                  if (prevMessageListQuery.hasMore) {
                    prevMessageListQuery.load(
                      LIMIT,
                      isReverse,
                      (messages, error) => {
                        if (error) {
                          console.log(
                            "Error while fetching conversations: ",
                            error
                          );
                          return;
                        } else {
                          for (let j = 0; j < messages.length; j++) {
                            const date = moment(messages[j].createdAt).format(
                              "DD MMM YYYY hh:mm a"
                            );

                            let gender = "Male";
                            for (
                              let index = 0;
                              index < genderArray.length;
                              index++
                            ) {
                              if (
                                genderArray[index].userId ==
                                messages[j]._sender.userId
                              ) {
                                gender = genderArray[index].gender;
                              }
                            }

                            const obj = {
                              message: messages[j].message,
                              datetime: date,

                              sender: {
                                userId: messages[j]._sender.userId,
                                name: messages[j]._sender.nickname,
                                gender: gender,
                              },
                            };
                            allMessages.push(obj);
                          }
                        }
                      }
                    );
                  }
                }
              });

              const final_obj = {
                userIdOne: userIdOne,
                anotherUserId: anotherUserId,
                conversation: allMessages,
              };

              alldata.push(final_obj);
            }
          });
        }
      });

      setTimeout(() => {
        resolve(alldata);
      }, 5000);
    });
  });

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
          <Col span={1}></Col>
          <Col span={16}>
            <AdminNavbar {...this.props} activeValue="chat"></AdminNavbar>
          </Col>
        </Row>
        <Row>
          <Col offset={1} span={22}>
            <Card title="Chat Application">
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
