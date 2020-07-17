import React, { Component } from "react";

import { Menu, Icon, message } from "antd";
import moment from "moment";

// Video Call Import-
import _ from "lodash";
import socket from "../../util/socket";
import PeerConnection from "../Video/PeerConnection";
import CallWindow from "../Video/CallWindow";
import CallModal from "../Video/CallModal";

// Services
import { Logout, getCurrentUser } from "../../services/auth.service";
import {
  AddConversationLog,
  FetchAllUserGender,
} from "../../services/chat.services";
import { sb } from "../../util/chat.init";

export default class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "",
      logoutLoading: false,
      clientId: "",
      callWindow: "",
      callModal: "",
      callFrom: "",
      localSrc: null,
      peerSrc: null,
      callerName: "",
    };
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
  }
  componentDidMount() {
    this.setState({
      current: this.props.activeValue,
    });

    const userId = getCurrentUser().user.id;

    sb.connect(userId, (user, err) => {
      if (err) {
        console.log(err);
        return;
      }
      const myid = userId + "," + user.nickname;

      socket
        .on("init", ({ id: clientId }) => {
          console.log("Socket Created Successfully", clientId);
          this.setState({ clientId });
        })
        .on("request", ({ from: callFrom }) => {
          this.setState({ callModal: "active", callFrom });
        })
        .on("call", (data) => {
          if (data.sdp) {
            this.pc.setRemoteDescription(data.sdp);
            if (data.sdp.type === "offer") this.pc.createAnswer();
          } else this.pc.addIceCandidate(data.candidate);
        })
        .on("end", this.endCall.bind(this, false))
        .emit("init", { id: myid });
    });
  }

  handleClick = async (e) => {
    if (e.key === "profile") {
      this.props.history.push("/profile");
    } else if (e.key === "home") {
      this.props.history.push("/dashboard");
    } else if (e.key === "chat") {
      this.props.history.push("/chat");
    } else if (e.key === "employee") {
      this.props.history.push("/employees");
    } else if (e.key === "report") {
      this.props.history.push("/report");
    } else if (e.key === "logout") {
      this.setState({
        logoutLoading: true,
      });
      await this.fetchDataFromSendBird.then((alldata) => {
        AddConversationLog(alldata).then((res) => {
          Logout();
          window.location.reload(true);
        });
      });
    }
  };

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

  startCall(isCaller, friendID, config, friendName) {
    try {
      this.config = config;
      this.pc = new PeerConnection(friendID)
        .on("localStream", (src) => {
          const newState = {
            callWindow: "active",
            localSrc: src,
            callerName: friendID,
          };
          if (!isCaller) newState.callModal = "";
          this.setState(newState);
        })
        .on("peerStream", (src) => {
          console.log("Peer Src", src);
          this.setState({ peerSrc: src });
        })
        .start(isCaller, config);
    } catch (err) {
      message.error("Connection Error! Please press crtl + shift + r");
      window.location.reload(true);
    }
  }

  rejectCall() {
    const { callFrom } = this.state;
    socket.emit("end", { to: callFrom });
    this.setState({ callModal: "" });
  }

  endCall(isStarter) {
    if (_.isFunction(this.pc.stop)) {
      this.pc.stop(isStarter);
    }
    this.pc = {};
    this.config = null;
    this.setState({
      callWindow: "",
      callModal: "",
      localSrc: null,
      peerSrc: null,
    });
  }

  render() {
    const {
      callFrom,
      callModal,
      callWindow,
      localSrc,
      peerSrc,
      callerName,
    } = this.state;
    return (
      <React.Fragment>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="home">
            <Icon type="home" />
            Home
          </Menu.Item>
          <Menu.Item key="profile">
            <Icon type="user" />
            Profile
          </Menu.Item>

          <Menu.Item key="employee">
            <Icon type="team" />
            Employees
          </Menu.Item>

          <Menu.Item key="chat">
            <Icon type="message" />
            Chat Application
          </Menu.Item>

          <Menu.Item key="logout">
            {!this.state.logoutLoading ? (
              <Icon type="logout" />
            ) : (
              <Icon type="loading" />
            )}
            Logoout
          </Menu.Item>
        </Menu>

        <br></br>
        {!_.isEmpty(this.config) && (
          <CallWindow
            status={callWindow}
            localSrc={localSrc}
            peerSrc={peerSrc}
            config={this.config}
            mediaDevice={this.pc.mediaDevice}
            endCall={this.endCallHandler}
            callFrom={callFrom}
            callerName={callerName}
          />
        )}
        <CallModal
          status={callModal}
          startCall={this.startCallHandler}
          rejectCall={this.rejectCallHandler}
          callFrom={callFrom}
        />
      </React.Fragment>
    );
  }
}
