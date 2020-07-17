/* global SOCKET_HOST */
import io from "socket.io-client";
import config from "./config.json";

const socket = io(`${config.SERVER_URI}`);

export default socket;
