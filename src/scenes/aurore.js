import {Texture, Sprite, Graphics} from 'pixi.js';
import {Player} from 'tone'
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"
import * as background from "../js/background"
import contraintesData from "../data/contraintes.json"



const CONTRAINTES = contraintesData.contraintes

let cameraVector = {
    a: 0,
    l: 0
};
const OBJECTS = objectsData.objects
let app, container, inventoryBox

export const initScene = (globalApp, globalContainer, globalInventory) => {

    app = globalApp
    container = globalContainer
    inventoryBox = globalInventory.getBounds()
    createEnvironment(globalContainer)

    for (let i = 0; i < OBJECTS.length; i++) {

        if(OBJECTS[i].timeOfDay == "Aurore" && !globalContainer.getChildByName(OBJECTS[i].name)) {

            const img = Texture.from("img/" + OBJECTS[i].src);
            const object = new Sprite(img) ;
            object.id = OBJECTS[i].id;
            object.name = OBJECTS[i].name
    
            const LUCK = (Math.random() * 10) == 5;
            const SCALE = OBJECTS[i].scale
            object.scale.set(SCALE);
            object.anchor.set(0.5);
            object.interactive = true;
            object.buttonMode = LUCK;
    
            object.x =OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
            object.y = OBJECTS[i].posY * window.innerHeight - (window.innerHeight / 6);
            object.initialPos = {
                x: object.x,
                y: object.y
            }

            object.goBack = false;
            object.zIndex = OBJECTS[i].index;

            object
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);

            function onDragStart(event) {
                this.alpha = 0.6;
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
                    background.addToSlot(this)                    
                } else {
                    finalScene.deleteObject(object.id)
                    background.clearSlot(this)
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
            
            container.addChild(object);
        }
    }

}


export const playMusic = () => {
    const url = "sound/Aurore.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = (globalContainer) => {


    for (let i = 0; i < CONTRAINTES.length; i++) {

        if (CONTRAINTES[i].timeOfDay == "Aurore") {

            const contrainteImg = Texture.from("img/Contraintes/" + CONTRAINTES[i].src)
            const contrainte = new Sprite(contrainteImg)
            contrainte.zIndex = CONTRAINTES[i].index
            contrainte.scale.set(CONTRAINTES[i].scale)
            contrainte.x = CONTRAINTES[i].posX;
            contrainte.y = CONTRAINTES[i].posY;
            contrainte.anchor.set(0.5)
            contrainte.interactive = true;

            contrainte.x = CONTRAINTES[i].posX * window.innerWidth - (window.innerWidth / 6);
            contrainte.y = CONTRAINTES[i].posY * window.innerHeight - (window.innerHeight / 6);
            contrainte.initialPos = {
                x: contrainte.x,
                y: contrainte.y
            }

            contrainte
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


            globalContainer.addChild(contrainte)

        }
    }


}

const checkCollision = (object) => {
    let objectBox = object.getBounds()
    
    return objectBox.x + objectBox.width > inventoryBox.x &&
           objectBox.x < inventoryBox.x + inventoryBox.width &&
           objectBox.y + objectBox.height > inventoryBox.y &&
           objectBox.y < inventoryBox.y + inventoryBox.height;
}
