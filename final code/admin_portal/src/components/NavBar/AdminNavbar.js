import React, { Component } from "react";

import { Menu, Icon, message } from "antd";

// Video Call Import
import _ from "lodash";
import socket from "../../util/socket";
import { getCurrentUser } from "../../services/auth.service";
import PeerConnection from "../Video/PeerConnection";
import CallWindow from "../Video/CallWindow";
import CallModal from "../Video/CallModal";

// Services
import { Logout } from "../../services/auth.service";
import { sb } from "../../util/chat.init";

export default class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "",
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

  handleClick = (e) => {
    if (e.key === "customer") {
      this.props.history.push("/customers");
    } else if (e.key === "home") {
      this.props.history.push("/dashboard");
    } else if (e.key === "employee") {
      this.props.history.push("/employees");
    } else if (e.key === "chat") {
      this.props.history.push("/chat");
    } else if (e.key === "report") {
      this.props.history.push("/hd_files");
    } else if (e.key === "logout") {
      Logout();
      window.location.reload(true);
    }
  };

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
          console.log("Peer Stream src", src);
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

          <Menu.Item key="customer">
            <Icon type="mail" />
            Customers
          </Menu.Item>
          <Menu.Item key="employee">
            <Icon type="team" />
            Employees
          </Menu.Item>
          <Menu.Item key="chat">
            <Icon type="message" />
            Chat Application
          </Menu.Item>
          <Menu.Item key="report">
            <Icon type="profile" />
            Harassment Report
          </Menu.Item>
          <Menu.Item key="logout">
            <Icon type="logout" />
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
