import {Texture, Sprite} from 'pixi.js';
import {Player} from 'tone'
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"

let cameraVector = {
    a: 0,
    l: 0
};
const OBJECTS = objectsData.objects
let app, container, inventory, inventoryBox

export const initJour = (globalApp, globalContainer, globalInventory) => {

    app = globalApp
    container = globalContainer
    inventory = globalInventory
    inventoryBox = inventory.getBounds()
    createEnvironment()

    for (let i = 0; i < OBJECTS.length; i++) {

        if(OBJECTS[i].timeOfDay == "Jour") {

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

    app.ticker.add((delta) => {
        for (const object of container.children) {
            object.update();
        }
    });    

}


export const playMusic = () => {
    const url = "sound/Jour.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = () => {
    const canvas = document.querySelectorAll('canvas')
    canvas[0].style.background = "rgb(155,194,255)"
    canvas[0].style.background = "linear-gradient(180deg, rgba(155,194,255,1) 0%, rgba(232,241,255,1) 100%)"
}

const checkCollision = (object) => {
    let objectBox = object.getBounds()
    
    return objectBox.x + objectBox.width > inventoryBox.x &&
           objectBox.x < inventoryBox.x + inventoryBox.width &&
           objectBox.y + objectBox.height > inventoryBox.y &&
           objectBox.y < inventoryBox.y + inventoryBox.height;
}