import animLogo from "../data/animLogo.json"

let homeAnimation = null
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

    homeAnimation = lottie.loadAnimation({
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animLogo
    });

    return homeAnimation
}

export const closeHome = () => {
    homeDiv[0].classList.add("hidden")
    logo[0].classList.remove("hidden")
    // musicBttn[0].classList.remove("whiteTint")
}

export {
    homeAnimation
}


