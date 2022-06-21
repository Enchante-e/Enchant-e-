let loadingPage = [...document.getElementsByClassName("loadingPage")]
let codeMemo = document.getElementById("codeMemoValue")

export const initLoad = (code) => {
    if(Array.isArray(code)) {
        codeMemo.innerHTML = code.join('')
    } else {
        codeMemo.innerHTML = code
    }

    loadingPage[0].classList.remove("hidden")
}

export const closeLoad = () => {
    loadingPage[0].classList.add("hidden")
}