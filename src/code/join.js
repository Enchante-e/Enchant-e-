import * as homepage from "../homepage/home"

let joinDiv = [...document.getElementsByClassName("codeForm")]
let roomConnect = document.getElementById("roomConnect")

roomConnect.addEventListener('click', () => {
  homepage.homeAnimation.play()
  gsap.to([...document.getElementsByClassName("homeNav")][0], {
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
  }, 5500);

   initJoin()
   document.getElementsByClassName('musicBttn')[0].classList.remove("whiteTint")
   document.getElementsByClassName('musicBttn')[0].classList.remove("hidden")
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