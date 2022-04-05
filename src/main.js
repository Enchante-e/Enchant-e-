import {io} from "socket.io-client";
const socket = io('http://localhost:3000')
import {GameApp} from "./app/app";

const myGame = new GameApp(document.body,  window.innerWidth, window.innerHeight);
