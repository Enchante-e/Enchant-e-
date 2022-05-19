import objectsData from "../data/objects.json"
import * as socket from "../main"
import {Texture, Sprite} from 'pixi.js'
import {Player} from 'tone'

const OBJECTS = objectsData.objects
let stage, socketObj = null
let chosenObjectsId = []
let validateBttn = document.getElementById("finishObjectsChoice")


export const setStage = (pixiStage) => {
    stage = pixiStage 
}

export const addObject = (objectId) => {
    if (chosenObjectsId.length <= 5) {
        chosenObjectsId.push(objectId)
        console.log(objectId+" added")
    } else {
        validateBttn.classList.remove("hidden")
    }
}

export const deleteObject = (objectId) => {
    chosenObjectsId.map((object, i) => {
        if(object.id == objectId) {
            users.splice(i, 1)
            console.log(objectId+" removed")
        }
    })
}


export const partnerObjects = (objects) => {
    objects.map((object) => {
        if((OBJECTS[object])) {
            const img = Texture.from("img/" + OBJECTS[object].src);
            const objectImg = new Sprite(img) ;
            objectImg.id = OBJECTS[object].id;

            const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
            let scale = 0.5 ;
            objectImg.interactive = true;

            objectImg.scale.set(scale);
            objectImg.tint = 0x00fa00;
            objectImg.x = rnd(-2 * window.innerWidth, 2 * window.innerWidth);
            objectImg.y = rnd(-2 * window.innerHeight, 2 * window.innerHeight);
            objectImg.initialPos = {
                x: objectImg.x,
                y: objectImg.y
            }
            objectImg.l = Math.random() * 4;
            objectImg.zIndex = scale;

            objectImg.on("click", function () {
                const url = "sound/" + OBJECTS[object].sound 
                const player = new Player(url).toDestination();
                player.autostart = true;
            })

            stage.addChild(objectImg) 
        } else {
            console.log(' nexiste po')
        }
    })
}

validateBttn.addEventListener("click", () => {
    if (chosenObjectsId.length == 6) {
        finished() 
    } else {
        alert("You didn't chose enough objects")   
    }
})


const finished = () => {
    stage.removeChild(stage.children[0])
    chosenObjectsId.map((object, i) => {
        if((OBJECTS[object])) {
            const img = Texture.from("img/" + OBJECTS[object].src);
            const objectImg = new Sprite(img) ;
            objectImg.id = OBJECTS[object].id;
            
            const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
            let scale = 0.5 ;
            objectImg.interactive = true;

            objectImg.scale.set(scale);
            objectImg.tint = 0xfa0000;
            objectImg.x = rnd(-1 * window.innerWidth, 1 * window.innerWidth);
            objectImg.y = rnd(-1 * window.innerHeight, 1 * window.innerHeight);
            objectImg.initialPos = {
                x: objectImg.x,
                y: objectImg.y
            }
            objectImg.l = Math.random() * 4;
            objectImg.zIndex = scale;

            objectImg.on("click", function () {
                const url = "sound/" + OBJECTS[object].sound 
                const player = new Player(url).toDestination();
                player.autostart = true;
            })

            stage.addChild(objectImg) 
        } else {
            console.log(' nexiste po')
        }
    })
    socketObj = socket.getSocket()
    socketObj.emit('set-objects', chosenObjectsId)
}



