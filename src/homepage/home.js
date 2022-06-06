import {Application,Container, Texture, Sprite } from 'pixi.js';
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
    initCanvas()
}

export const closeHome = () => {
    homeDiv[0].classList.add("hidden")
    logo[0].classList.remove("hidden")
    // musicBttn[0].classList.remove("whiteTint")
}


let cameraVector = {
    a: 0,
    l: 0
};
let move = false

var center = {},
app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    transparent: true,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
}),
container = new Container(1080)

const initCanvas = () => {
    document.body.appendChild(app.view);

    document.addEventListener("mousemove", function (e) {
        center.x = app.screen.width / 2;
        center.y = app.screen.height / 2;
        if(move == true) {
            cameraVector.a = center.x - e.x;
            cameraVector.l = center.y - e.y;
            cameraVector.a = Math.atan2(center.y - e.y, center.x - e.x);
            cameraVector.l = Math.sqrt(a * a + b * b);
        }
    })

    container.x = app.screen.width / 8;
    container.y = -500;
    container.pivot.x = container.width / 8;
    container.pivot.y = container.height / 8;
    container.zIndex =0
  
               
    const img = Texture.from("img/Entrave-Debut-to-drag.svg");
    const object= new Sprite(img);
    object.interactive = true;

    object.x = 0;
    object.y = -220;

    object
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

    function onDragStart(event) {
        this.data = event.data;
        this.dragging = true;
    }

    function onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }

    function onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }

    app.stage.addChild(object) 
}

