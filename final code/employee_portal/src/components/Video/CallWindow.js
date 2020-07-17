import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { Modal, Button, Tooltip } from "antd";
const getButtonClass = (icon, enabled) =>
  classnames(`btn-action fa ${icon}`, { disable: !enabled });

function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  status,
  endCall,
  callFrom,
  callerName,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === "video") {
      setVideo(!video);

      mediaDevice.toggle("Video");
    }
    if (deviceType === "audio") {
      setAudio(!audio);
      mediaDevice.toggle("Audio");
    }
  };

  return (
    <Modal
      visible={true}
      title={
        callFrom
          ? `You are in call with ${callFrom.split(",")[1]}   `
          : `You are in call with ${callerName.split(",")[1]}   `
      }
      footer={null}
      width="60%"
      closable={false}
    >
      <div className={classnames("call-window", status)}>
        <video id="peerVideo" class="ant-card" ref={peerVideo} autoPlay />
        <video
          id="localVideo"
          class="ant-card"
          ref={localVideo}
          autoPlay
          muted
        />

        <div className="video-control">
          <Tooltip title={video ? "Video Off" : "Video On"}>
            <Button
              key="btnVideo"
              type={video ? "primary" : "danger"}
              shape="circle"
              icon="video-camera"
              style={{ marginRight: "5px" }}
              className={getButtonClass("fa-video-camera", video)}
              onClick={() => toggleMediaDevice("video")}
              size="large"
            />
          </Tooltip>

          <Tooltip title={audio ? "Audio Off" : "Audio On"}>
            <Button
              key="btnAudio"
              type={audio ? "primary" : "danger"}
              shape="circle"
              icon="phone"
              style={{ marginRight: "5px" }}
              size="large"
              className={getButtonClass("fa-microphone", audio)}
              onClick={() => toggleMediaDevice("audio")}
            />
          </Tooltip>

          <Tooltip title="End Call">
            <Button
              key="btnEnd"
              type="danger"
              shape="circle"
              icon="close"
              style={{ marginRight: "5px" }}
              size="large"
              onClick={() => endCall(true)}
            />
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
}

export default CallWindow;
