let conceptOne = [...document.getElementsByClassName("conceptPageOne")]
let conceptTwo = [...document.getElementsByClassName("conceptPageTwo")]
let conceptThree = [...document.getElementsByClassName("conceptPageThree")]

export const initConcept = () => {
    conceptOne[0].classList.remove("hidden")

    setTimeout(() => { 
        conceptOne[0].classList.add("hidden")
        conceptTwo[0].classList.remove("hidden")
    }, 100);
}

export const closeConcept = () => {
    document.getElementsByClassName('logo')[0].classList.add("whiteTint")
    document.getElementsByClassName('musicBttn')[0].classList.add("whiteTint")
    conceptOne[0].classList.add("hidden")
    conceptTwo[0].classList.add("hidden")
}

export const initPhoneConcept = () => {
    document.getElementsByClassName('logo')[0].classList.remove("whiteTint")
    document.getElementsByClassName('musicBttn')[0].classList.remove("whiteTint")
    conceptThree[0].classList.remove("hidden")
}

export const closePhoneConcept = () => {
    document.getElementsByClassName('logo')[0].classList.add("whiteTint")
    document.getElementsByClassName('musicBttn')[0].classList.add("whiteTint")
    conceptThree[0].classList.add("hidden")
}