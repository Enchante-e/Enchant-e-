import {Application,Container } from 'pixi.js';
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"
import * as crépuscule from "../scenes/crépuscule"

let cameraVector = {
    a: 0,
    l: 0
};
let move = false

const OBJECTS = objectsData.objects

var center = {},
app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    transparent: true,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
}),
play = false,
container = new Container(1080),
rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const initCanvas = () => {

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
    container.y = app.screen.height / 8;
    container.pivot.x = container.width / 8;
    container.pivot.y = container.height / 8;
    
    app.stage.addChild(container);
    crépuscule.initCrépuscule(app, container)
    finalScene.setStage(app)

    app.ticker.add((delta) => {
        for (const object of container.children) {
            object.update();
        } 
    });
}

export const activeMovement = () => {
    return move = true
}