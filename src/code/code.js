import {PolySynth} from 'tone'
import * as nameForm from "../name/name"

let code = []
let keysPressed = []
let keysPressedContainer = document.getElementById("keysPressed")
let checkBttn = document.getElementById("checkCode")
let notes = [...document.getElementsByClassName("noteBg")]
let noteLabels = [...document.getElementsByClassName("noteLabel")]

export const init = (homepage, roomCode) => {
    const bodyClass = document.body.classList
    for(let i = 0; i  < bodyClass.length; i++){
      document.body.classList.remove(bodyClass[i])
    }
    document.body.classList.add("introStyle")
    homepage.closeHome()

    code = roomCode
    assignNotes()
    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)
    checkBttn.addEventListener("click", checkCode)
}

const assignNotes = () => {
    for(let i = 0; i < code.length; i++) {
        noteLabels[i].innerHTML = code[i]
        notes[i].addEventListener("mouseover", hoverNotes)
    }
}

const hoverNotes = (e) => {
    e.target.nextElementSibling.style.display = "block"
    e.target.addEventListener("mouseleave", () => {
        e.target.nextElementSibling.style.display = "none"
    })
}

const keyDown = (e) => {
    switch(e.keyCode) {
      case 8:
        keysPressed.splice(-1)
        break;
      case 13:
        checkCode()
        break;
      case 65:
        playNote('C4')
        break;
      case 87:
        playNote('Db4')
        break;
      case 83:
        playNote('D4')
        break;
      case 69:
        playNote('Eb4')
        break;
      case 68:
        playNote('E4')
        break;
      case 70:
        playNote('F4')
        break;
      case 84:
        playNote('Gb4')
        break;
      case 71:
        playNote('G4')
        break;
      case 89:
        playNote('Ab4')
        break;
      case 72:
        playNote('A4')
        break;
      case 85:
        playNote('Bb4')
        break;
      case 74:
        playNote('B4')
        break;
      case 75:
        playNote('C5')
        break;
      case 79:
        playNote('A#4') //to check w/ musicos
        break;
      case 80:
        playNote('D#4') //to check w/ musicos
        break;
      case 76:
        playNote('F#4') //to check w/ musicos
        break;
      case 77:
        playNote('C#4') //to check w/ musicos
        break;
    }
}

const keyUp = () => {
    const activeKeys = [...document.getElementsByClassName("activeKey")]
    activeKeys.map((a) => {
      a.classList.remove("activeKey")
      if(keysPressed.length < 4) {
        keysPressed.push(a.innerText)
      } else {
        keysPressed.splice(0, keysPressed.length)
        keysPressed.push(a.innerText)
      }
    })
    keysPressedContainer.innerHTML = keysPressed.join(" ")
}

const playNote = (note) => {
    const synth = new PolySynth().toDestination()
    synth.triggerAttackRelease(note,"8n");
    document.getElementById(note)?.classList.add("activeKey")
}

const checkCode = () => {
    if(JSON.stringify(code) === JSON.stringify(keysPressed)) {
        // document.getElementById("guess-piano").classList.add("hidden")
        // document.getElementById("copy-code").classList.remove("hidden") 
        // document.getElementById("room-input").classList.remove("hidden") 
        // document.getElementById("name-form").classList.remove("hidden")
        nameForm.initName()  

        document.removeEventListener("keydown", keyDown)
        document.removeEventListener("keyup", keyUp)

    } else {
        alert("C'est non")
    }
}



