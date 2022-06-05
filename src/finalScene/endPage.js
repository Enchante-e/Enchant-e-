
import { deleteCursor } from "./finalScene"
let endingPage = [...document.getElementsByClassName("endingPage")]
let logo = [...document.getElementsByClassName("logo")]
let finalSceneInterface = [...document.getElementsByClassName("finalScene")]

export const initEndPage = () => {
    endingPage[0].classList.remove('hidden')
    logo[0].classList.add('end')
    
    const bodyClass = document.body.classList
    for(let i = 0; i  < bodyClass.length; i++){
        document.body.classList.remove(bodyClass[i])
    }
    document.body.classList.add("homeStyle")
    
    deleteCursor()
    document.getElementById('bulleAmi').classList.add('hidden')
    finalSceneInterface[0].classList.add('hidden')
}

export const closeEndPage = () => {
    endingPage[0].classList.add('hidden')
}