
let endingPage = [...document.getElementsByClassName("endingPage")]
let logo = [...document.getElementsByClassName("logo")]
let finalSceneInterface = [...document.getElementsByClassName("finalScene")]
let closeBttn = document.getElementById("closeEndPage")

export const initEndPage = () => {
    endingPage[0].classList.remove('hidden')
    logo[0].classList.add('end')
    
    const bodyClass = document.body.classList
    for(let i = 0; i  < bodyClass.length; i++){
        document.body.classList.remove(bodyClass[i])
    }
    document.body.classList.add("homeStyle")
    
    document.getElementById('tag').classList.add('hidden')
    document.getElementById('bulleAmi').classList.add('hidden')
    finalSceneInterface[0].classList.add('hidden')
}

export const closeEndPage = () => {
    logo[0].classList.remove('end')
    document.getElementById('tag').classList.remove('hidden')
    document.getElementById('bulleAmi').classList.remove('hidden')
    finalSceneInterface[0].classList.remove('hidden')
    
    endingPage[0].classList.add('hidden')
}

closeBttn.addEventListener("click", () => {
    closeEndPage()
})