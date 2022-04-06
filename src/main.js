import {io} from "socket.io-client";
const socket = io('http://localhost:3000')
import {GameApp} from "./app/app";
import {Parallax} from "./app/app";

// const myGame = new GameApp(document.body,  window.innerWidth, window.innerHeight);


socket.on('init', function(id) {
    let p = document.createElement('p')
    p.innerHTML = "Nouvel invité " + id;
    document.getElementById("users").appendChild(p)
});


