import {Texture, Sprite} from 'pixi.js';
import {Player} from 'tone'
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"

let cameraVector = {
    a: 0,
    l: 0
};
const OBJECTS = objectsData.objects
const INVENTORY_SLOTS = [{'object': null,x:-100,y:0},{'object': null,x:100,y:150},{'object': null,x:-100,y:300},{'object': null,x:100,y:450},{'object': null,x:-100,y:600},{'object': null,x:100,y:750}]
let inventoryOpen = false
let app, container, inventory, inventoryBox

export const init = (globalApp, globalContainer, globalInventory) => {

    app = globalApp
    container = globalContainer
    inventory = globalInventory
    inventoryBox = inventory.getBounds()
    createEnvironment()

    for (let i = 0; i < OBJECTS.length; i++) {

        if(OBJECTS[i].timeOfDay == "Crépuscule") {

            const img = Texture.from("img/" + OBJECTS[i].src);
            const object = new Sprite(img) ;
            object.id = OBJECTS[i].id;
            object.name = OBJECTS[i].name
    
            const LUCK = (Math.random() * 10) == 5;
            const SCALE = OBJECTS[i].scale
            object.scale.set(SCALE);
            object.anchor.set(0.5)
            object.interactive = true;
            object.buttonMode = LUCK;
    
            object.x =OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
            object.y = OBJECTS[i].posY * window.innerHeight - (window.innerHeight / 6);
            object.initialPos = {
                x: object.x,
                y: object.y
            }

            object.goBack = false;
            object.l = Math.random() * 4;
            object.zIndex = 0;

            object
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);

            function onDragStart(event) {
                this.data = event.data;
                this.dragging = true;

                const url = "sound/" + OBJECTS[i].sound
                const player = new Player(url).toDestination();
                player.autostart = true;
            }

            function onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                this.data = null;

                if(checkCollision(this)) {
                    addToSlot(this)                    
                } else {
                    finalScene.deleteObject(object.id)
                    clearSlot(this)
                    this.tint = 0xffffff;
                    this.scale.set(OBJECTS[i].scale)
                }
            }

            function onDragMove() {
                if (this.dragging) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x;
                    this.y = newPosition.y;
                }
            }

            object.update = function () {
                if (this.goBack) {
                    this.x = lerp(this.x, this.initialPos.x, 0.5);
                    this.y = lerp(this.y, this.initialPos.y, 0.5);
                    this.goBack = (this.x == this.initialPos.x) ? false : true;
                } else {
                    this.x += Math.cos(cameraVector.a) * cameraVector.l * (SCALE / 10);
                    this.y += Math.sin(cameraVector.a) * cameraVector.l * (SCALE / 10);
                }
            }
            
            container.addChild(object);
        }
    }

    app.ticker.add((delta) => {
        for (const object of container.children) {
            object.update();
        }
    });    

    inventory.on("click", function (e) {
        this.interactive = true;
        inventoryOpen = !inventoryOpen
        if(inventoryOpen) {
            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    slot.object.alpha = 1
                    slot.object.scale.set(0.13)
                }
            })
        } else {
            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    slot.object.alpha = 0
                    slot.object.scale.set(0)
                }
            })
        }
    })

}


export const playMusic = () => {
    const url = "sound/Crépuscule.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = () => {
    const canvas = document.querySelectorAll('canvas')
    canvas[0].style.background = "rgb(106,0,143)"
    canvas[0].style.background = "linear-gradient(180deg, rgba(106,0,143,1) 0%, rgba(0,41,157,1) 100%)"

    document.getElementById("bulleBg").style.background = "#fff"
    document.getElementById("bulleName").style.color = "#fff"
    document.getElementById("bulleSymbol").style.color = "#0a0d42"

    const backgroundImg = Texture.from("img/constraints-c-lines.svg");
    const background = new Sprite(backgroundImg)
    background.scale.set(0.5);
    app.stage.addChild(background);

    for (let i = 0; i < 1; i++) {
        const constraintImg = Texture.from("img/constraints-c-3-"+i+".svg");
        const constraint = new Sprite(constraintImg)
        constraint.scale.set(0.5);
        
        app.stage.addChild(constraint);
    }
}

const checkCollision = (object) => {
    let objectBox = object.getBounds()
    
    return objectBox.x + objectBox.width > inventoryBox.x &&
           objectBox.x < inventoryBox.x + inventoryBox.width &&
           objectBox.y + objectBox.height > inventoryBox.y &&
           objectBox.y < inventoryBox.y + inventoryBox.height;
}

const addToSlot = (object) => {
    let slotFound = false

    INVENTORY_SLOTS.map((slot) => {
        if (slotFound === false) {
            if (slot.object == null) {
                finalScene.addObject(object.id)
                slot.object = object
                
                object.x = slot.x;
                object.y = slot.y;
                object.scale.set(0.13)
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

const clearSlot = (object) => {
    INVENTORY_SLOTS.map((slot) => {
        if (slot.object == object) {
            slot.object = null        
        }
    })
}