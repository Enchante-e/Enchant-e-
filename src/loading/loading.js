let loadingPage = [...document.getElementsByClassName("loadingPage")]
let codeMemo = document.getElementById("codeMemoValue")

export const initLoad = (code) => {
    const codeFormat = code.join('')
    codeMemo.innerHTML = codeFormat
    loadingPage[0].classList.remove("hidden")
}

export const closeLoad = () => {
    loadingPage[0].classList.add("hidden")
}