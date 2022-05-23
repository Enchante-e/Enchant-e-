let conceptOne = [...document.getElementsByClassName("conceptPageOne")]
let conceptTwo = [...document.getElementsByClassName("conceptPageTwo")]

export const initConcept = () => {
    conceptOne[0].classList.remove("hidden")

    setTimeout(() => { 
        conceptOne[0].classList.add("hidden")
        conceptTwo[0].classList.remove("hidden")
    }, 10000);
}

export const closeConcept = () => {
    conceptOne[0].classList.add("hidden")
    conceptTwo[0].classList.add("hidden")
}