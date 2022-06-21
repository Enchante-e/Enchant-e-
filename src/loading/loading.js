import {Player} from 'tone'
let loadingPage = [...document.getElementsByClassName("loadingPage")]
let codeMemo = document.getElementById("codeMemoValue")
let player

export const initLoad = (code) => {
    if(Array.isArray(code)) {
        codeMemo.innerHTML = code.join('')
    } else {
        codeMemo.innerHTML = code
    }

    const url = "sound/Sablier.mp3"
    player = new Player(url).toDestination()
    player.autostart = true;
    player.loop = true;
    player.volume.value= -5

    loadingPage[0].classList.remove("hidden")
}

export const closeLoad = () => {
    if(player) {
        player.stop()
    }
    loadingPage[0].classList.add("hidden")
}