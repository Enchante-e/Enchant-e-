
let homeDiv = [...document.getElementsByClassName("homepage")]
let interfaceDiv = [...document.getElementsByClassName("interface")]


export const initHome = () => {
    document.body.classList.add("homeStyle")
}

export const closeHome = () => {
    homeDiv[0].classList.add("hidden")
    interfaceDiv[0].classList.remove("hidden")
}