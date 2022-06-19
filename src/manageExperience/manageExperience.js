import { gsap } from "gsap";

let homepage = [...document.getElementsByClassName("homepage")]
let endingPage = [...document.getElementsByClassName("endingPage")]
let returnHomeBttn = document.getElementById("returnHome")

returnHomeBttn.addEventListener("click", () => {
    endingPage.map((e) => {
        gsap.to(e, {
            alpha: 0,
            duration: 1,
        })
    })
    gsap.to(".logo", {
        alpha: 0,
        duration: 1,
    })
    gsap.to(".musicBttn", {
        alpha: 0,
        duration: 1,
    })

    setTimeout(() => { 
        window.location.reload()
    }, 1500);
})

export const startExperience = () => {
    const bodyClass = document.body.classList
    for(let i = 0; i  < bodyClass.length; i++){
        document.body.classList.remove(bodyClass[i])
    }
    
    document.body.classList.add("homeStyle")
    homepage[0].classList.remove('hidden')  

    // hide all elements from interface except music bttn
}

export const closeExperience = () => {
    // server clear all datas from previous experiences
    // and all local values in main
    // close all pages (concept pages, nameform ...)

        // deleteCursor()

}