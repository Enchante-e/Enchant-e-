import {Texture, Sprite, Container} from 'pixi.js';
import {Player} from 'tone'
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"
import * as background from "../js/background"

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

        if(OBJECTS[i].timeOfDay == "Aube" && !globalContainer.getChildByName(OBJECTS[i].name)) {

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
            object.zIndex = OBJECTS[i].index;

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
    const url = "sound/Aube.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = (globalContainer) => {
    const container = new Container(1080)
    container.x = app.screen.width / 8;
    container.y = app.screen.height / 8;
    container.pivot.x = container.width / 8;
    container.pivot.y = container.height / 8;
    container.sortableChildren = true
    container.zIndex = -1
    app.stage.addChild(container)

    const rightImg = Texture.from("img/Aube-Fond-Droite.svg")
    const rightBg = new Sprite(rightImg) 
    rightBg.name = "Aube-Fond-Droite"
    rightBg.zIndex = -7

    const leftImg = Texture.from("img/Aube-Fond-Gauche.svg")
    const leftBg = new Sprite(leftImg) 
    leftBg.name = "Aube-Fond-Gauche"
    leftBg.zIndex = -8

    rightBg.x = app.view.width / 4 ;
    rightBg.y = - app.view.height / 2;
    rightBg.scale.set(0.8)
    rightBg.interactive = true;

    leftBg.x =  - app.view.width / 2 ;
    leftBg.y = - app.view.height / 2;
    leftBg.scale.set(0.8)
    leftBg.interactive = true;
    
    const contrainteImg = Texture.from("img/Contraintes/Aube-algue-middle.svg")
    const contrainteBg = new Sprite(contrainteImg) 
    contrainteBg.scale.set(0.8)
    contrainteBg.x =  150;
    contrainteBg.interactive = true;
    // contrainteBg.name = "Con"
    contrainteBg.zIndex = 1
    contrainteBg.anchor.set(0.5)


    contrainteBg
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
            leftBg
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
            rightBg
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

    globalContainer.addChild(rightBg,leftBg, contrainteBg)
}

const checkCollision = (object) => {
    let objectBox = object.getBounds()
    
    return objectBox.x + objectBox.width > inventoryBox.x &&
           objectBox.x < inventoryBox.x + inventoryBox.width &&
           objectBox.y + objectBox.height > inventoryBox.y &&
           objectBox.y < inventoryBox.y + inventoryBox.height;
}

