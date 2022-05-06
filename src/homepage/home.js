
let logo = [...document.getElementsByClassName("logo")]
let homeDiv = [...document.getElementsByClassName("homepage")]
let musicBttn = [...document.getElementsByClassName("musicBttn")]


export const initHome = () => {
    document.body.classList.add("homeStyle")
}

export const closeHome = () => {
    homeDiv[0].classList.add("hidden")
    logo[0].classList.remove("hidden")
    musicBttn[0].classList.remove("whiteTint")
}