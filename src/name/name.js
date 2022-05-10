
let pianoDiv = [...document.getElementsByClassName("pianoCode")]
let codeDiv = [...document.getElementsByClassName("codeForm")]
let nameDiv = [...document.getElementsByClassName("nameForm")]

export const initName = () => {
    pianoDiv[0].classList.add("hidden")
    codeDiv[0].classList.add("hidden")
    nameDiv[0].classList.remove("hidden")
}

export const closeName = () => {
    nameDiv[0].classList.add("hidden")
}