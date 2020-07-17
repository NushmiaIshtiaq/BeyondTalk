import SendBird from "sendbird";

const sendbirdAppID = "EC4056A4-96C9-4EF0-963A-F9FFC1E9204D";

const sendBirdtoken = "8a3eab667598f1ac8c00414597ab0aee595027a5";

const sb = new SendBird({ appId: sendbirdAppID });

export { sb, sendbirdAppID, sendBirdtoken };
