import * as homepage from "../homepage/home"

let joinDiv = [...document.getElementsByClassName("codeForm")]
let roomConnect = document.getElementById("roomConnect")

roomConnect.addEventListener('click', () => {
   initJoin()
   document.getElementById("ambientPlayer").play()
   homepage.closeHome()
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