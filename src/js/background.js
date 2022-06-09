import {Application,Container, Texture, Sprite } from 'pixi.js';
import objectsData from "../data/objects.json"
import {Player} from 'tone'
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
const INVENTORY_SLOTS = [{'object': null,x:-100,y:0},{'object': null,x:100,y:150},{'object': null,x:-100,y:300},{'object': null,x:100,y:450},{'object': null,x:-100,y:600},{'object': null,x:100,y:750}]
let inventoryOpen = false

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
    container.sortableChildren = true
    app.stage.sortableChildren = true
    
    const inventory = createInventory()
    app.stage.addChild(container);
    
    SCENES.map((scene) => {
        scene.init(app, container, inventory)
    })
    SCENES[0].playMusic()
    
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
    coffre.zIndex = 11;
    coffre.interactive = true;

    const imgCoffreBg = Texture.from("img/CoffreBg.svg")
    const coffreBg = new Sprite(imgCoffreBg)

    coffreBg.x = 0;
    coffreBg.y = 125;
    coffreBg.scale.set(0.15);
    coffreBg.alpha = 0;
    coffreBg.zIndex = 10;
    
    coffre.on("click", function (e) {
        this.interactive = true;
        inventoryOpen = !inventoryOpen

        if(inventoryOpen) {
            coffreBg.alpha = 1;
            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    slot.object.alpha = 1
                    slot.object.scale.set(0.13)
                }
            })
        } else {
            coffreBg.alpha = 0;
            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    slot.object.alpha = 0
                    slot.object.scale.set(0)
                }
            })
        }
    })
    
    app.stage.addChild(coffre, coffreBg)
    return coffre
}

export const addToSlot = (object) => {
    let slotFound = false

    INVENTORY_SLOTS.map((slot) => {
        if (slotFound === false) {
            if (slot.object == null) {
                finalScene.addObject(object.id)
                slot.object = object
                
                object.x = slot.x;
                object.y = slot.y;
                object.scale.set(0.13)
                object.zIndex = 15
                object.tint = 0x1A1D5C;
                
                if(inventoryOpen === false) {
                    object.alpha = 0
                    object.scale.set(0)
                }                

                const url = "sound/Coffre.wav"
                const player = new Player(url).toDestination();
                player.autostart = true;

                slotFound = true
            }
        }
    })

    if (slotFound === false) {
        alert("coffre full")
        object.x = app.view.width / 2;
        object.y = app.view.height / 2;
    }
}

export const clearSlot = (object) => {
    INVENTORY_SLOTS.map((slot) => {
        if (slot.object == object) {
            slot.object = null        
        }
    })
}

export const activeMovement = () => {
    return move = true
}