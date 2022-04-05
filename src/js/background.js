import * as PIXI from 'pixi.js';
import {GameApp} from "./app/app";

console.log('test on load');

let app;

let bgBack;
let bgFar;
let bgMiddle;
let bgClose;
let bgX = 0;
let bgSpeed = 1;

window.onload = function () {
    app = new PIXI.Application({
        width: 800,
        height: 500,
        backgroundColor: 0xFF00FF
    })
}


document.querySelector("#parallax").appendChild(app.view);

// app.loader.baseURL = "assets";
app.loader
    .add("bgBack", "assets/images/parallax-demon-woods-bg.png")
    .add("bgFar", "assets/images/parallax-demon-woods-far-trees.png")
    .add("bgMiddle", "assets/images/parallax-demon-woods-mid-trees.png")
    .add("bgClose", "assets/images/parallax-demon-woods-close-trees.png");
app.loader.onComplete.add(initLevel);
app.loader.load();

function initLevel() {
    bgBack = createBg(app.loader.resources["bgBack"].texture);
    bgFar = createBg(app.loader.resources["bgFar"].texture);
    bgMiddle = createBg(app.loader.resources["bgMiddle"].texture);
    bgClose = createBg(app.loader.resources["bgClose"].texture);

    app.ticker.add(parallax);
}

function createBg(texture) {
    let tiling = new PIXI.TilingSprite(texture, 800, 600);
    tiling.position(0, 0);
    app.stage.addChild(tiling);

    return tiling;
}