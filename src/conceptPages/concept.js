import {Player} from 'tone'
let conceptOne = [...document.getElementsByClassName("conceptPageOne")]
let conceptTwo = [...document.getElementsByClassName("conceptPageTwo")]
let conceptThree = [...document.getElementsByClassName("conceptPageThree")]
let player

export const initConcept = () => {
    conceptOne[0].classList.remove("hidden")

    setTimeout(() => { 
        conceptOne[0].classList.add("hidden")
        conceptTwo[0].classList.remove("hidden")
    }, 8000);
}

export const closeConcept = () => {
    document.getElementsByClassName('logo')[0].classList.add("whiteTint")
    document.getElementsByClassName('musicBttn')[0].classList.add("whiteTint")
    conceptOne[0].classList.add("hidden")
    conceptTwo[0].classList.add("hidden")
}

export const initPhoneConcept = () => {
    const url = "sound/Telephone.mp3"
    player = new Player(url).toDestination()
    player.autostart = true;
    player.loop = true;
    player.volume.value= -5

    document.getElementsByClassName('logo')[0].classList.remove("whiteTint")
    document.getElementsByClassName('musicBttn')[0].classList.remove("whiteTint")
    conceptThree[0].classList.remove("hidden")
}

export const closePhoneConcept = () => {
    if(player) {
        player.stop()
    }
    document.getElementsByClassName('logo')[0].classList.add("whiteTint")
    document.getElementsByClassName('musicBttn')[0].classList.add("whiteTint")
    conceptThree[0].classList.add("hidden")
}