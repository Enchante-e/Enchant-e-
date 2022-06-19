import {PolySynth} from 'tone'
import * as nameForm from "../name/name"
import * as loading from "../loading/loading"

let code = []
let keysPressed = []
let keysPressedContainer = document.getElementById("keysPressed")
let checkBttn = document.getElementById("checkCode")
let notes = [...document.getElementsByClassName("noteBg")]
let noteLabels = [...document.getElementsByClassName("noteLabel")]
let pianoDiv = [...document.getElementsByClassName("pianoCode")]
let pianoKey = [...document.getElementsByClassName("pianoKey")]


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
    pianoKey.map((key) => {
      key.addEventListener("click", keyDownClick)
    })
}

const assignNotes = () => {
    for(let i = 0; i < code.length; i++) {

        switch(code[i]) {
          case "A":
            noteLabels[i].previousElementSibling.style.marginBottom = "0"
            noteLabels[i].innerHTML = code[i]
            break;
          case "S":
            noteLabels[i].previousElementSibling.style.marginBottom = "25px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "D":
            noteLabels[i].previousElementSibling.style.marginBottom = "50px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "F":
            noteLabels[i].previousElementSibling.style.marginBottom = "75px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "G":
            noteLabels[i].previousElementSibling.style.marginBottom = "100px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "H":
            noteLabels[i].previousElementSibling.style.marginBottom = "125px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "J":
            noteLabels[i].previousElementSibling.style.marginBottom = "150px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "K":
            noteLabels[i].previousElementSibling.style.marginBottom = "175px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "L":
            noteLabels[i].previousElementSibling.style.marginBottom = "200px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "M":
            noteLabels[i].previousElementSibling.style.marginBottom = "225px"
            noteLabels[i].innerHTML = code[i]
            break;
          case "W":
            noteLabels[i].previousElementSibling.style.marginBottom = "0"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
            case "E":
            noteLabels[i].previousElementSibling.style.marginBottom = "25px"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
          case "T":
            noteLabels[i].previousElementSibling.style.marginBottom = "75px"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
          case "Y":
            noteLabels[i].previousElementSibling.style.marginBottom = "100px"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
          case "U":
            noteLabels[i].previousElementSibling.style.marginBottom = "125px"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
          case "O":
            noteLabels[i].previousElementSibling.style.marginBottom = "175px"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
          case "P":
            noteLabels[i].previousElementSibling.style.marginBottom = "200px"
            noteLabels[i].innerHTML = "#"+code[i]
            break;
        }

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

const keyDownClick = (e) => {
    switch(e.target.id) {
      case 'C4':
        playNote('C4'), keyUp() 
        break;
      case 'Db4':
        playNote('Db4'), keyUp() 
        break;
      case 'D4':
        playNote('D4'), keyUp() 
        break;
      case 'Eb4':
        playNote('Eb4'), keyUp() 
        break;
      case 'E4':
        playNote('E4'), keyUp() 
        break;
      case 'F4':
        playNote('F4'), keyUp() 
        break;
      case 'Gb4':
        playNote('Gb4'), keyUp() 
        break;
      case 'G4':
        playNote('G4'), keyUp() 
        break;
      case 'Ab4':
        playNote('Ab4'), keyUp() 
        break;
      case 'A4':
        playNote('A4'), keyUp() 
        break;
      case 'Bb4':
        playNote('Bb4'), keyUp() 
        break;
      case 'B4':
        playNote('B4'), keyUp() 
        break;
      case 'C5':
        playNote('C5'), keyUp() 
        break;
      case 'A#4':
        playNote('A#4') , keyUp() //to check w/ musicos
        break;
      case 'D#4':
        playNote('D#4') , keyUp() //to check w/ musicos
        break;
      case 'F#4':
        playNote('F#4') , keyUp() //to check w/ musicos
        break;
      case 'C#4':
        playNote('C#4') , keyUp() //to check w/ musicos
        break;
    }
}

const keyUp = () => {
    const activeKeys = [...document.getElementsByClassName("activeKey")]
    activeKeys.map((a) => {
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
    setTimeout(() => { 
      document.getElementById(note)?.classList.remove("activeKey")
  }, 100);
}

const checkCode = () => {
    if(JSON.stringify(code) === JSON.stringify(keysPressed)) {
        nameForm.initName()  

        document.removeEventListener("keydown", keyDown)
        document.removeEventListener("keyup", keyUp)
        pianoDiv[0].classList.add("hidden")
    } else {
        alert("C'est non")
    }
}



