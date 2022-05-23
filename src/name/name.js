
let nameDiv = [...document.getElementsByClassName("nameForm")]

export const initName = () => {
    nameDiv[0].classList.remove("hidden")
}

export const closeName = () => {
    nameDiv[0].classList.add("hidden")
}