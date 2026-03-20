import { io } from "socket.io-client";

const URL = "http://192.168.100.3:3000";
const socket = io(URL, { autoConnect: false });

export default socket;