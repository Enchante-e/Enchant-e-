let logo = [...document.getElementsByClassName("logo")]
let homeDiv = [...document.getElementsByClassName("homepage")]
let musicBttn = [...document.getElementsByClassName("musicBttn")]
let ambientPlayerHTML = document.getElementById("ambientPlayer")
ambientPlayerHTML.volume = 0.4

musicBttn[0].addEventListener("click", () => {
    if (ambientPlayerHTML.paused) {
        ambientPlayerHTML.play()
    } else {
        ambientPlayerHTML.pause()
    }
})

export const initHome = () => {
    document.body.classList.add("homeStyle")
}

export const closeHome = () => {
    homeDiv[0].classList.add("hidden")
    logo[0].classList.remove("hidden")
    // musicBttn[0].classList.remove("whiteTint")
}



