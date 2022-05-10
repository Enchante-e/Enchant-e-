import {io} from "socket.io-client";
import * as homepage from "./homepage/home"
import * as background from "./js/background"
import * as musicCode from "./code/code"
import * as name from "./name/name"
import * as join from "./code/join"
import * as objects from "./js/objects"
import * as loading from "./loading/loading"


import dotenv from "dotenv";
dotenv.config();

const socket = io(process.env.IO_URL)
homepage.initHome()


// CONST ------------------------------------------------------------------------------------------------------------------------------------

let myId, myName, myRoom = ""
let myCoord = []
let partnerId, partnerName = ""
let partnerCursor = []
let nameTag = null
let partnerIsReady = false

// BUTTONS & INPUTS ROOMS
let roomBttn = document.getElementById("roomGenerate")
let joinBttn = document.getElementById("roomJoin")
let pianoDiv = [...document.getElementsByClassName("pianoCode")]
let roomInput = document.getElementById("roomInput")
let copyBttn = document.getElementById("copyCode")
let codeInput = document.getElementById("codeInput")
let startExperience = document.getElementById("startExperience")

// BUTTONS & INPUTS NAME
let nameInput = document.getElementById("nameInput")
let nameForm = document.getElementById("nameForm")
let partnerDiv = document.getElementById("bulleAmi")
let partnerNameDiv = document.getElementById("bulleName")
let partnerSymbol = document.getElementById("bulleSymbol")


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
    let code = codeInput.value.toUpperCase()
    if (code !== "") {
        socket.emit('join-room', code, myId)
    } 
})

// [RECEIVED] Generated Code / Joined the room, Hiding forms & showing form name
socket.on('room-notification', (code, userStatus) => {
    myRoom = code
    roomInput.innerHTML = myRoom
    roomBttn.classList.add("hidden")
    
    if (userStatus == "creator") {
        pianoDiv[0].classList.remove("hidden")
        musicCode.init(homepage, code)
    } else if(userStatus == "invited") {
        join.closeJoin() 
    }

})

// [RECEIVED] Room full or issue with room
socket.on('room-fail', (code) => {
    alert("Couldn't join " + code + ". The room is already full or doesn't exist, please retry or change code.") 
})

// [EMIT] Change Name Input And emit
startExperience.addEventListener('click', (e) => {
        e.preventDefault()
        myName = nameInput.value

        if (myName !== "") {
            const name = myName;
            socket.emit('change-name', name, myId)
        }
        (partnerIsReady == false) ? loading.initLoad(myRoom) : null
        name.closeName()
});

// [RECEIVED] Name changed notification
socket.on('name-notification', (name, id) => {
        partnerName = name
        partnerIsReady = true
        loading.closeLoad()
        
        partnerNameDiv.innerHTML = partnerName 
        nameTag.innerHTML = partnerName
        partnerSymbol.innerHTML = partnerName.charAt(0)
        partnerDiv.classList.remove("hidden") 

        background.activeMovement()
});

// [RECEIVED] Create cursor of partner
socket.on('cursor-create', (memberId) => {
    partnerId = memberId
    background.initCanvas()
    generateCursor(partnerId)
});

// [RECEIVED] Cursor update position
socket.on('cursor-update', (partnerId, coordX, coordY) => {
    background.updateCursor(partnerCursor[0].obj, coordX, coordY)
    nameTag.style.top =  coordY + "px";
    nameTag.style.left =  coordX + "px";
});

socket.on('partner-objects', function(partnerObjects) {
    objects.partnerObjects(partnerObjects)
})

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

export const getSocket = () => {
    return socket
}



