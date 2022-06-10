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
    conceptOne[0].classList.add("hidden")
    conceptTwo[0].classList.add("hidden")
}

export const initPhoneConcept = () => {
    conceptThree[0].classList.remove("hidden")
}

export const closePhoneConcept = () => {
    conceptThree[0].classList.add("hidden")
}