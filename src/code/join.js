import * as homepage from "../homepage/home"
import {Player} from 'tone'
let joinDiv = [...document.getElementsByClassName("codeForm")]
let roomConnect = document.getElementById("roomConnect")

roomConnect.addEventListener('click', () => {
  homepage.homeAnimation.play()
  const url = "sound/Serrure.mp3"
  const player = new Player(url).toDestination()
  player.autostart = true;
  player.volume.value= -5

  gsap.to([[...document.getElementsByClassName("homeNav")][0], document.getElementById("homeContraintes")], {
      opacity: 0,
      duration: 1.5
  });

  document.getElementById("ambientPlayer").play()

  gsap.to(document.body, {
    backgroundColor: "#FFFFFF",
    delay: 4,
    duration: 1
  });

  setTimeout(() => { 
    initJoin()
    homepage.closeHome()

    document.getElementsByClassName('musicBttn')[0].classList.remove("hidden")
  }, 5500);

})

export const initJoin = () => {
    const bodyClass = document.body.classList
    for(let i = 0; i  < bodyClass.length; i++){
      document.body.classList.remove(bodyClass[i])
    }
    document.body.classList.add("introStyle")

    joinDiv[0].classList.remove("hidden")
}

export const closeJoin = () => {
  joinDiv[0].classList.add("hidden")
}