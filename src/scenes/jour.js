import {Texture, Sprite, Graphics} from 'pixi.js';
import {Player} from 'tone'
import {gsap} from "gsap";
gsap.registerPlugin(ScrollTrigger);
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"
import * as background from "../js/background"
import contraintesData from "../data/contraintes.json"

let cameraVector = {
    a: 0,
    l: 0
};

const OBJECTS = objectsData.objects
const CONTRAINTES = contraintesData.contraintes
let app, container, inventoryBox


export const initScene = (globalApp, globalContainer, globalInventory) => {


    app = globalApp
    container = globalContainer
    inventoryBox = globalInventory.getBounds()
    createEnvironment(globalContainer)

    for (let i = 0; i < OBJECTS.length; i++) {


        if (OBJECTS[i].timeOfDay == "Jour" && !globalContainer.getChildByName(OBJECTS[i].name)) {


            const img = Texture.from("img/" + OBJECTS[i].src);
            const object = new Sprite(img);
            object.id = OBJECTS[i].id;

            object.name = OBJECTS[i].name

            const LUCK = (Math.random() * 10) == 5;
            const SCALE = OBJECTS[i].scale
            object.scale.set(SCALE);
            object.targetScale = SCALE;
            object.anchor.set(0.5)
            object.interactive = true;
            object.buttonMode = LUCK;

            object.x = OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
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

                gsap.to(object.scale, {
                    x: object.scale.x * 0.7,
                    y: object.scale.y * 0.7
                });

                if(OBJECTS[i].sound !== "") {
                    const url = "sound/" + OBJECTS[i].sound
                    const player = new Player(url).toDestination();
                    player.autostart = true;
                    player.volume.value = 2
                }
            }

            function onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                this.data = null;

                if (checkCollision(this)) {
                    background.addToSlot(this, OBJECTS[i].name)

                } else {
                    finalScene.deleteObject(object.id, OBJECTS[i].name)
                    background.clearSlot(this)
                    this.tint = 0xffffff;
                    this.scale.set(OBJECTS[i].scale)
                }
                gsap.to(object.scale, {
                    x: object.scale.x,
                    y: object.scale.y
                });
            }

            function onDragMove() {
                if (this.dragging) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x;
                    this.y = newPosition.y;

                    if(checkCollision(this)) {
                        gsap.to(object, { 
                            rotation: Math.random(),
                            transformOrigin: "right 10%",
                            opacity : 0.4
                        });                 
                    } else {
                        gsap.to(object, {
                            rotation: Math.random(),
                            transformOrigin: "left 10%"
                        }); 
                    }
                }

            }

            // BLUR FILTER

            // const blurFilter1 = new PIXI.filters.BlurFilter();
            // blurFilter1.blur = 0.0;
            // object.filters = [blurFilter1];

            // const time = 2.0;
            // TweenMax.to(blurFilter1, time, {
            //     blur: 5.0,
            //     repeat: -1
            // });

            // OBJECTS FOLLOW MOUSE

            // app.stage.interactive = true;

            // app.stage.hitArea = app.renderer.screen;

            // app.stage.addEventListener('pointermove', (e) => {
            //     object.position.copyFrom(e.global);
            // });

            // PARALLAX 

            document.addEventListener('wheel', (e) => {
                if (e.deltaY >= 0) {

                    changePosition(object,object.x * 2, object.y * 2, 10 )          
                    
                } else if (e.deltaY <= 0) {
                    gsap.to(object.position, {
                        x: object.initialPos.x,
                        y: object.initialPos.y,
                        duration: 2
                    });
                }
            });

            container.addChild(object);
        }

    }

}

export const changePosition = (object, posX, posY, duration) => {
    gsap.to(object.position, {
        x: posX,
        y: posY,
        duration: duration
    }) 
} 

export const playMusic = () => {
    const url = "sound/Jour.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}


const createEnvironment = (globalContainer) => {


    for (let i = 0; i < CONTRAINTES.length; i++) {

        if (CONTRAINTES[i].timeOfDay == "Jour") {

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
                this.alpha = 0.6;
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

            document.addEventListener('wheel', (e) => {
                if (e.deltaY >= 0) {
                    gsap.to(contrainte.position, {
                        x: contrainte.x * 2,
                        y: contrainte.y * 2,
                        duration: 10
                    });

                } else if (e.deltaY <= 0) {
                    gsap.to(contrainte.position, {
                        x: contrainte.initialPos.x,
                        y: contrainte.initialPos.y,
                        duration: 2
                    });
                }
            });
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