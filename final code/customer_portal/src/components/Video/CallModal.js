import React from "react";
import classnames from "classnames";
import { Button, Tooltip } from "antd";
function CallModal({ status, callFrom, startCall, rejectCall }) {
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };
  const size = "large";
  return (
    <React.Fragment>
      {status ? (
        <div className={classnames("call-modal ant-card", status)}>
          <h3>
            <span className="caller">{`${
              callFrom.split(",")[1]
            }  is calling... `}</span>
          </h3>

          <Tooltip title="Accept Video Call">
            <Button
              type="primary"
              shape="circle"
              icon="video-camera"
              style={{ marginRight: "5px" }}
              onClick={acceptWithVideo(true)}
              size={size}
            />
          </Tooltip>

          <Tooltip title="Accpet Voice Call">
            <Button
              type="primary"
              shape="circle"
              icon="phone"
              style={{ marginRight: "5px" }}
              onClick={acceptWithVideo(false)}
              size={size}
            />
          </Tooltip>

          <Tooltip title="End Call">
            <Button
              type="danger"
              shape="circle"
              icon="close"
              style={{ marginRight: "5px" }}
              onClick={rejectCall}
              size={size}
            />
          </Tooltip>
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default CallModal;
