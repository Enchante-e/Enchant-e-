import {io} from "socket.io-client";
import { gsap } from "gsap";
import * as homepage from "./homepage/home"
import * as background from "./js/background"
import * as musicCode from "./code/code"
import * as nameForm from "./name/name"
import * as join from "./code/join"
import * as aube from "./scenes/aube"
import * as finalScene from "./finalScene/finalScene"
import * as loading from "./loading/loading"
import * as hashtags from "./hashtags/hashtags"
import * as concept from "./conceptPages/concept"
import * as manageExperience from "./manageExperience/manageExperience"

import dotenv from "dotenv";
dotenv.config();

const socket = io(process.env.IO_URL)
let homeAnimation = homepage.initHome()


// CONST ------------------------------------------------------------------------------------------------------------------------------------

let myId, myName, myRoom = ""
let myCoord = []
let partnerId, partnerName = ""
let partnerCursor = []
let nameTag = null
let finalSceneStarted = false

// BUTTONS & INPUTS ROOMS
let roomBttn = document.getElementById("roomGenerate")
let joinBttn = document.getElementById("roomJoin")
let codeInput = document.getElementById("codeInput")
let pianoDiv = [...document.getElementsByClassName("pianoCode")]
let startExperience = document.getElementById("startExperience")
let startTutorial = document.getElementById("startTutorial")

// BUTTONS & INPUTS NAME
let nameInput = document.getElementById("nameInput")
let partnerDiv = document.getElementById("bulleAmi")
let partnerSymbol = document.getElementById("bulleSymbol")
let partnerNameHTML = [...document.getElementsByClassName("partnerName")]
let userNameHTML = [...document.getElementsByClassName("userName")]

let logo = [...document.getElementsByClassName('logo')]


// SOCKET ------------------------------------------------------------------------------------------------------------------------------------

// [RECEIVED] Set your local ID and write it 
socket.on('init', function(user) {
    myId = user.id;
});


// [EMIT] Create room & generate code
roomBttn.addEventListener('click', () => {
    socket.emit('generate-room')
    document.getElementById("ambientPlayer").play()
    
    homeAnimation.play()

    gsap.to([[...document.getElementsByClassName("homeNav")][0], document.getElementById("homeContraintes")], {
        opacity: 0,
        duration: 1.5
      });

    document.getElementsByClassName('musicBttn')[0].classList.remove("hidden")
})

// [EMIT] Join room with code
joinBttn.addEventListener('click', () => {
    let code = codeInput.value.toUpperCase()
    if (code !== "") {
        socket.emit('join-room', code, myId)
    } else {
        alert("Veuillez remplir le code")
    }
})

// [RECEIVED] Generated Code / Joined the room, Hiding forms & showing form name
socket.on('room-notification', (code, userStatus) => {
    myRoom = code
    document.getElementsByClassName('musicBttn')[0].classList.remove("whiteTint")
    if (userStatus == "creator") {      
        gsap.to(document.body, {
          backgroundColor: "#FFFFFF",
          delay: 4,
          duration: 1
        });
      
        setTimeout(() => { 
          pianoDiv[0].classList.remove("hidden")
          musicCode.init(homepage, code)
        }, 5500);
      
    } else if(userStatus == "invited") {
        join.closeJoin()
        nameForm.initName() 
    }

})

// [RECEIVED] Room full or issue with room
socket.on('room-fail', (code) => {
    alert("Vous ne pouvez pas rejoindre ce code ami " + code + ". Ce code n'existe pas ou votre proche est peut-être déjà avec quelqu'un d'autre. Veuillez réessayer, vérifier l'orthographe ou changer de code.") 
})

// [EMIT] Change Name Input And emit
startExperience.addEventListener('click', (e) => {
    e.preventDefault()
    myName = nameInput.value

    if (myName !== "") {
        const name = myName
        userNameHTML.map((item) => {
            item.innerHTML = myName
        })
        socket.emit('change-name', name, myId)
    } else {
        alert("Veuillez choisir un nom")
    }
});
    
// [EMIT] Change Name Input And emit
startTutorial.addEventListener('click', (e) => {
    e.preventDefault()
    concept.closeConcept()

    hashtags.initHashtag()
    background.activeMovement()
    logo[0].classList.add("whiteTint")
    
    // aube.playMusic()
    document.getElementById("finishObjectsChoice").classList.remove("hidden")
});

// [RECEIVED] Waiting for partner
socket.on('waiting-for-partner', () => {
    loading.initLoad(myRoom)
});

// [RECEIVED] Waiting for partner
socket.on('close-loading', () => {
    concept.initPhoneConcept()
    loading.closeLoad()
});

// [RECEIVED] Name changed notification
socket.on('name-notification', (name, id) => {
        partnerName = name
        concept.initConcept()
        
        partnerNameHTML.map((item) => {
            item.innerHTML = partnerName
        })
        
        partnerSymbol.innerHTML = partnerName.charAt(0).toUpperCase()
        partnerDiv.classList.remove("hidden")
        
        loading.closeLoad()
        nameForm.closeName()
});

// [RECEIVED] Generate Canvas
socket.on('canvas-create', (memberId) => {
    partnerId = memberId
    background.initCanvas()
});

// [RECEIVED] Create cursor of partner
socket.on('cursor-create', () => {
    generateCursor()
    hashtags.closeHashtag()
    finalSceneStarted = true
});

// [RECEIVED] Cursor update position
socket.on('cursor-update', (partnerId, coordX, coordY) => {
    finalScene.updateCursor(partnerCursor[0], coordX, coordY)
    if (nameTag) {
        gsap.to(nameTag, {
            top: coordY + 10 + "px",
            left: coordX - 15 + "px",
            duration: 0.15,
            delay: 0.15
        });
    }
});

socket.on('partner-notification', function(type) {
    hashtags.createNotification(partnerName, type)
})

socket.on('partner-objects', function(partnerObjects, hasFinished) {
    finalScene.partnerObjects(partnerObjects)
})

// [RECEIVED] Disconnect notification
socket.on('disconnect-notification', function(id, name) {
   alert(id + " " + name + " a été déconnecté ")

    let userName = document.getElementById(id + "name")
    userName ? userName.remove() : null

    if (partnerCursor[0]) {
        finalScene.deleteCursor(partnerCursor[0])
        partnerCursor = []
    }
});


// LOCAL ------------------------------------------------------------------------------------------------------------------------------------

socket.on('test', function(test) {
    alert(test)
 })

// [LOCAL] Creating Partner Cursor
const generateCursor = () => {
    partnerCursor.push(finalScene.createCursor())

    nameTag = document.createElement('p')
    nameTag.innerHTML = partnerName
    nameTag.id = "tag"
    // nameTag.classList.add("tag")
    document.body.appendChild(nameTag)
}

// [EMIT] Get mouse position and emit
document.addEventListener('mousemove', function(e) {
    e.preventDefault()
    
    if (finalSceneStarted == true) {
      myCoord = []
      myCoord.push(e.clientX, e.clientY)

      socket.emit('coord', myCoord, myId)
    }
});

export const getSocket = () => {
    return socket
}


