import {Application,Container, Texture, Sprite } from 'pixi.js';
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"
import * as aube from "../scenes/aube"
import * as jour from "../scenes/jour"
import * as aurore from "../scenes/aurore"
import * as crépuscule from "../scenes/crépuscule"

let cameraVector = {
    a: 0,
    l: 0
};
let move = false
let inventoryOpen = false

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

const SCENES = [aube, aurore, jour, crépuscule]

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
    container.zIndex = 6
    
    const inventory = createInventory()
    app.stage.addChild(container);
    
    SCENES.map((scene) => {
        scene.init(app, container, inventory)
    })
    SCENES[0].playMusic()

    document.addEventListener('wheel', (e) => {
        // console.log(e.pageY)
        // const object = container.getChildByName(objectsData.objects[0].name)
        // container.pivot.x = container.width / 12;
        // container.pivot.y = container.height / 12;
        // container.scale.set(container.scale.x * 1.05, container.scale.y * 1.05)
    });
    
    finalScene.setStage(app)
    app.ticker.add((delta) => {
        for (const object of container.children) {
            object.update();
        } 
    });

}

const createInventory = () => {
    const imgCoffre = Texture.from("img/Coffre.svg")
    const coffre = new Sprite(imgCoffre)

    coffre.x = 80;
    coffre.y =  app.view.height - 110;
    coffre.scale.set(0.4);
    coffre.anchor.set(0.5)
    coffre.zIndex = 5;
    coffre.interactive = true;

    const imgCoffreBg = Texture.from("img/CoffreBg.svg")
    const coffreBg = new Sprite(imgCoffreBg)

    coffreBg.x = 0;
    coffreBg.y = 10;
    coffreBg.scale.set(0.2);
    coffreBg.alpha = 0;
    coffreBg.zIndex = 0;
    
    coffre.on("click", function (e) {
        this.interactive = true;
        inventoryOpen = !inventoryOpen
        if(inventoryOpen) {
            coffreBg.alpha = 1;
        } else {
            coffreBg.alpha = 0;
        }
    })
    
    app.stage.addChild(coffre, coffreBg)
    return coffre
}

export const activeMovement = () => {
    return move = true
}