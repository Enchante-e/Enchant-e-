import * as homepage from "../homepage/home"

let joinDiv = [...document.getElementsByClassName("codeForm")]
let roomConnect = document.getElementById("roomConnect")

roomConnect.addEventListener('click', () => {

  homepage.homeAnimation.play()
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