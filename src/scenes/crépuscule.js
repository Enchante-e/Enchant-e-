import {Texture, Sprite, Graphics} from 'pixi.js';
import {Player} from 'tone'
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"

let cameraVector = {
    a: 0,
    l: 0
};
const OBJECTS = objectsData.objects
let app, container, inventory, inventoryBox

export const initCrépuscule = (globalApp, globalContainer, globalInventory) => {

    app = globalApp
    container = globalContainer
    inventory = globalInventory
    inventoryBox = inventory.getBounds()
    createEnvironment()

    for (let i = 0; i < OBJECTS.length; i++) {

        if(OBJECTS[i].timeOfDay == "Crépuscule" && OBJECTS[i].name !== "Cartes" && OBJECTS[i].name !== "Crayon" && OBJECTS[i].name !== "Lampe") {

            const img = Texture.from("img/" + OBJECTS[i].src);
            const object = new Sprite(img) ;
            object.id = OBJECTS[i].id;
    
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
            }

            function onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                this.data = null;

                if(checkCollision(this)) {
                    this.scale.set(0.05)
                    finalScene.addObject(object.id)
                                        
                    const url = "sound/Coffre.wav"
                    const player = new Player(url).toDestination();
                    player.autostart = true;
                } else {
                    this.scale.set(OBJECTS[i].scale)
                    finalScene.deleteObject(object.id)
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