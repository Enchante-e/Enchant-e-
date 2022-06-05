
let homepage = [...document.getElementsByClassName("homepage")]
let returnHomeBttn = document.getElementById("returnHome")

returnHomeBttn.addEventListener("click", () => {
    closeExperience()
    startExperience()
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
}