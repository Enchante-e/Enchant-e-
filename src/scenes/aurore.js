import {Texture, Sprite, Graphics} from 'pixi.js';
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
    // createEnvironment()

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
            object.l = Math.random() * 4;
            object.zIndex = 5;

            object
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);

            function onDragStart(event) {
                this.data = event.data;
                this.dragging = true;
                this.alpha = 0.6;

                gsap.to(object.scale, {
                    x: object.scale.x * 0.7,
                    y: object.scale.y * 0.7
                });

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

                gsap.to(object.scale, {
                    x: object.scale.x * 0.7,
                    y: object.scale.y * 0.7
                });
            }

            function onDragMove() {
                if (this.dragging) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x;
                    this.y = newPosition.y;
                    if(checkCollision(this)) {
                        gsap.to(object, {
                            rotation: 0.8,
                            transformOrigin: "right 10%"
                        });                 
                    } else {
                        gsap.to(object, {
                            rotation: -0.4,
                            transformOrigin: "left 10%"
                        }); 
                    }
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

            document.addEventListener('wheel', (e) => {
                if (e.deltaY >= 0) {
                    console.log("scroll down")
                    gsap.to(object.position, {
                        x: object.x * 2,
                        y: object.y * 2,
                        duration: 10
                    });

                } else if (e.deltaY <= 0) {
                    console.log("scroll up")
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

    app.ticker.add((delta) => {
        for (const object of container.children) {
            object.update();
        }
    });    

}


export const playMusic = () => {
    const url = "sound/Aurore.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = () => {
}

const checkCollision = (object) => {
    let objectBox = object.getBounds()
    
    return objectBox.x + objectBox.width > inventoryBox.x &&
           objectBox.x < inventoryBox.x + inventoryBox.width &&
           objectBox.y + objectBox.height > inventoryBox.y &&
           objectBox.y < inventoryBox.y + inventoryBox.height;
}
