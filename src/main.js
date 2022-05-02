import {io} from "socket.io-client";
const socket = io('https://warm-chamber-97929.herokuapp.com/')
// import {GameApp} from "./app/app";
import * as background from "./js/background"

// const myGame = new GameApp(document.body,  window.innerWidth, window.innerHeight);


// CONST ------------------------------------------------------------------------------------------------------------------------------------

let myId = ""
let partnerId = ""
let myName = "" 
let myCoord = []
let myRoom = ""
let partnerCursor = []
let nameTag = null

// BUTTONS & INPUTS ROOMS
let roomInput = document.getElementById("room-input")
let roomBttn = document.getElementById("room-generate")
let copyBttn = document.getElementById("copy-code")
let codeInput = document.getElementById("room-codeInput")
let joinBttn = document.getElementById("join-code")

// BUTTONS & INPUTS NAME
let nameInput = document.getElementById("name-input")
let nameForm = document.getElementById("name-form")
let partnerDiv = document.getElementById("bulle-ami")
let partnerName = document.getElementById("bulle-name")


// SOCKET ------------------------------------------------------------------------------------------------------------------------------------

// [RECEIVED] Set your local ID and write it 
socket.on('init', function(user) {
    myId = user.id;
    console.log("Vous êtes " + myId + " Name : " + user.name + " coordX :  " + user.coordX + " coordY : " + user.coordY)
});


// [EMIT] Create room & generate code
roomBttn.addEventListener('click', () => {
    socket.emit('generate-room')
})

// [EMIT] Join room with code
joinBttn.addEventListener('click', () => {
    let code = codeInput.value
    if (code !== "") {
        socket.emit('join-room', code, myId)
    } 
})

// [RECEIVED] Generated Code / Joined the room, Hiding forms & showing form name
socket.on('room-notification', (code, id, name) => {
    myRoom = code.toString()

    roomInput.innerHTML = myRoom
    document.getElementById("code-form").classList.add("hidden")   
    roomBttn.classList.add("hidden")
    copyBttn.classList.remove("hidden") 

    nameForm.classList.remove("hidden")   
})

// [RECEIVED] Room full or issue with room
socket.on('room-fail', (code) => {
    alert("Couldn't join " + code + ". Room full or there is an issue, please retry or change code.") 
})

// [EMIT] Change Name Input And emit
nameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        myName = nameInput.value

        if (myName !== "") {
            const name = myName;
            socket.emit('change-name', name, myId)
        }
        nameForm.classList.add("hidden")   
        document.getElementById("users").classList.add("hidden")   
    }
});

// [RECEIVED] Name changed notification
socket.on('name-notification', (name, id) => {
    if (id == partnerId) { 
        partnerName.innerHTML = name 
        nameTag.innerHTML = name
        background.activeMovement()
    }
});

// [RECEIVED] Create cursor of partner
socket.on('cursor-create', (memberId) => {
    partnerId = memberId
    partnerDiv.classList.remove("hidden") 
    generateCursor(partnerId)
});

// [RECEIVED] Cursor update position
socket.on('cursor-update', (partnerId, coordX, coordY) => {
    background.updateCursor(partnerCursor[0].obj, coordX, coordY)
    nameTag.style.top =  coordY + "px";
    nameTag.style.left =  coordX + "px";
});

// [RECEIVED] Disconnect notification
socket.on('disconnect-notification', function(id, name) {
   console.log(id + " " + name + " a été déconnecté ")

    let userName = document.getElementById(id + "name")
    userName ? userName.remove() : null

    if (partnerCursor[0]) {
        background.deleteCursor(partnerCursor[0].obj)
        partnerCursor = []
    }
});


// LOCAL ------------------------------------------------------------------------------------------------------------------------------------

socket.on('test', function(test) {
    console.log(test)
 })


// [LOCAL] Copy Code
copyBttn.addEventListener('click', () => {
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

// [LOCAL] Creating Partner Cursor
const generateCursor = (id) => {
    partnerCursor.push({id: id, obj : background.createCursor()})

    nameTag = document.createElement('p')
    nameTag.innerHTML = "";
    nameTag.id = id
    nameTag.classList.add("tag")
    document.body.appendChild(nameTag)
}

// [EMIT] Get mouse position and emit
document.addEventListener('mousemove', function(e) {
    e.preventDefault()
    
    if (myCoord && myRoom !== "" && partnerId !== "") {
      myCoord = []
      myCoord.push(e.clientX, e.clientY)

      socket.emit('coord', myCoord, myId)
    }
});


