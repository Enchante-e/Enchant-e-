import {io} from "socket.io-client";
const socket = io('http://localhost:3000')
import {GameApp} from "./app/app";

const myGame = new GameApp(document.body,  window.innerWidth, window.innerHeight);

let myId = ""
let myName = "" 
let mycoord = []
let usersCursors = []

// [RECEIVED - YOU] Set your local ID and write it 
socket.on('init', function(id) {
    myId = id;
    let p = document.createElement('p')
    p.innerHTML = "Vous êtes " + id;
    p.id = myId
    document.getElementById("users").appendChild(p)
});

// [RECEIVED - ALL] New user joined notification
socket.on('hello-world', function(id) {
    let p = document.createElement('p')
    p.innerHTML = id + "joined the chat";
    p.id = id
    document.getElementById("users").appendChild(p)

    usersCursors.push({id: id, obj : myGame.createCursor()})

    let name = document.createElement('p')
    name.innerHTML = "";
    name.id = id + "name"
    name.classList.add("tag")
    document.body.appendChild(name)
})

// [EMIT] Get mouse position and emit
document.addEventListener('mousemove', function(e) {
    e.preventDefault()
    mycoord = []
    mycoord.push(e.clientX, e.clientY)
    
    if (mycoord) {
      socket.emit('coord', mycoord, myId)
    }
});

// [RECEIVED - YOU] Your Name and coords values changed 
socket.on('userUpdate', function(users) {
    users.map((user) => {
        let userDiv = document.getElementById(user.id)
        if(userDiv) {
            if (user.id == myId) {
                userDiv.innerHTML = "Vous êtes " + user.id + " Name : " + user.name + " coordX :  " + user.coordX + " coordY : " + user.coordY;
            } else {
                let userName = document.getElementById(user.id + "name")
                userName.innerHTML = user.name
                userDiv.innerHTML = "User " + user.id + " Name : " + user.name + " coordX :  " + user.coordX + " coordY : " + user.coordY;
                usersCursors.map((cursor) => {
                    if (user.id == cursor.id) {
                        cursor.obj.transform.position.x = user.coordX - window.innerWidth / 2;
                        cursor.obj.transform.position.y = user.coordY - window.innerHeight / 2;
                        userName.style.top =  user.coordY + "px";
                        userName.style.left =  user.coordX + "px";
                    }
                })
            }
        // } else {
        //     let p = document.createElement('p')
        //     p.id = user.id
        //     p.innerHTML = "User " + user.id + " Name : " + user.name + " coordX :  " + user.coordX + " coordY : " + user.coordY;
        //     document.getElementById("users").appendChild(p)
        //     usersCursors.push({id: user.id, obj : myGame.createCursor()})
        }
    })
});

// [EMIT] Change Name Input And emit
let nameInput = document.getElementById("name-input")

nameInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault()
        myName = nameInput.value

        if (myName !== "") {
            const name = myName;
            
            socket.emit('change-name', name, myId)
        }
    }
});

// [RECEIVED - ALL] Name changed notification
socket.on('name-notification', function(name, id, oldName) {
    let p = document.createElement('p')
    p.innerHTML = id + oldName + " a changé de nom pour " + name;
    document.getElementById("users").appendChild(p)
});

// [EMIT] JOIN & CREATE ROOM todo
let roomInput = document.getElementById("room-input")
let roomBttn = document.getElementById("room-generate")
let copyBttn = document.getElementById("copy-code")
let codeInput = document.getElementById("room-codeInput")
let joinBttn = document.getElementById("join-code")

roomBttn.addEventListener('click', function (e) {
    socket.emit('generate-code')
    roomBttn.disabled = true
})
socket.on('friendcode-generated', function(code) {
    roomInput.innerHTML = code
})
copyBttn.addEventListener('click', function (e) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(roomInput.innerHTML);
        return;
      }
      navigator.clipboard.writeText(roomInput.innerHTML).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        alert('Async: Could not copy text: ', err);
      });

      const fallbackCopyTextToClipboard = (code) => {
        var textArea = document.createElement("textarea");
        textArea.value = ""
        code.map((letter) => {
            textArea.value = textArea.value + letter
        })
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        document.body.removeChild(textArea);
    }
})
joinBttn.addEventListener('click', function (e) {
    let code = codeInput.value
    socket.emit('join-partner', code, myId)
})

socket.on('room-notification', function(code, id, name) {
    let p = document.createElement('p')
    p.innerHTML = code + " joined by " + id + name;
    document.getElementById("users").appendChild(p)
})

//test
let messageInput = document.getElementById("message-test")
messageInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault()
        const msg = messageInput.value
        const code = codeInput.value
        socket.emit('message', msg, code, myId)
    }
})
socket.on('messsage-emit', function(msg, code,id) {
    let p = document.createElement('p')
    p.innerHTML = code + " " + id + " dit  : " + msg;
    document.getElementById("users").appendChild(p)
})


// [RECEIVED - ALL] Disconnect notification
socket.on('disconnect-notification', function(id, name) {
    let p = document.createElement('p')
    p.innerHTML = id + " " + name + " a été déconnecté ";
    document.getElementById("users").appendChild(p)

    let userName = document.getElementById(id + "name")
    userName ? userName.remove() : null
    
    usersCursors.map((cursor, i) => {
        if (id == cursor.id) {
            myGame.app.stage.removeChild(cursor.obj)
            usersCursors.splice(i, 1)
        }
    })
});