import objectsData from "../data/objects.json"
import * as socket from "../main"
import {Texture, Sprite, Graphics} from 'pixi.js'
import {Player} from 'tone'

const OBJECTS = objectsData.objects
let app, socketObj, cursor = null
let chosenObjectsId = []
let partnerObjectsId = null
let validateBttn = document.getElementById("finishObjectsChoice")
let interfaceFinalScene = [...document.getElementsByClassName("finalScene")]

export const setStage = (globalApp) => {
    app = globalApp 
    validateBttn.classList.remove("hidden")
}

export const createCursor = () => {
    cursor  = new Graphics();
    cursor.beginFill(0xFFFFFF);
    cursor.drawCircle(app.view.width / 2, app.view.height / 2, 8);
    cursor.endFill();
    cursor.zIndex = 5
    
    app.stage.addChild(cursor);
    return cursor;
}

export const updateCursor = (cursor, coordX, coordY) => {
    if(cursor) {
        cursor.transform.position.x = coordX - window.innerWidth / 2;
        cursor.transform.position.y = coordY - window.innerHeight / 2;
    }
}

export const deleteCursor = (cursor) => {
    app.stage.removeChild(cursor)
}

export const addObject = (objectId, objectName) => {
    if (chosenObjectsId.length <= 5) {
        chosenObjectsId.push(objectId)
        console.log(objectId+" added", chosenObjectsId, objectName)

        if(socketObj == null) {
            socketObj = socket.getSocket()
        }

        socketObj.emit('partner-notification', "treasureAdded")
    }
}

export const deleteObject = (objectId, objectName) => {
    chosenObjectsId.map((object, i) => {
        if(object == objectId) {
            chosenObjectsId.splice(i, 1)
            console.log(objectId+" removed", chosenObjectsId, objectName)

            if(socketObj == null) {
                socketObj = socket.getSocket()
            }

            socketObj.emit('partner-notification', "treasureRemoved")
        }
    })
}


export const partnerObjects = (objects) => {
    partnerObjectsId = objects

    partnerObjectsId.map((object) => {
        if((OBJECTS[object])) {
            const img = Texture.from("img/" + OBJECTS[object].src);
            const objectImg = new Sprite(img) ;
            objectImg.id = OBJECTS[object].id;

            const SCALE = OBJECTS[object].scale
            objectImg.scale.set(SCALE);
            objectImg.interactive = true;

            objectImg.tint = 0x9B7593;
            objectImg.x = OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
            objectImg.y = OBJECTS[i].posY * window.innerHeight - (window.innerHeight / 6);

            objectImg.l = Math.random() * 4;
            objectImg.zIndex = 5;

            // objectImg.on("click", function () {
            //     const url = "sound/" + OBJECTS[object].sound 
            //     const player = new Player(url).toDestination();
            //     player.autostart = true;
            // })

            app.stage.addChild(objectImg) 
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
    app.stage.removeChild(app.stage.children[0])
    chosenObjectsId.map((object, i) => {
        if((OBJECTS[object])) {
           
            const img = Texture.from("img/" + OBJECTS[object].src);
            const objectImg = new Sprite(img) ;
            objectImg.id = OBJECTS[object].id;
            
            const SCALE = OBJECTS[object].scale
            objectImg.scale.set(SCALE);
            objectImg.interactive = true;

            objectImg.tint = 0xEE7E3C;
            objectImg.x =OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
            objectImg.y = OBJECTS[i].posY * window.innerHeight - (window.innerHeight / 6);

            objectImg.l = Math.random() * 4;
            objectImg.zIndex = 5;

            // objectImg.on("click", function () {
            //     const url = "sound/" + OBJECTS[object].sound 
            //     const player = new Player(url).toDestination();
            //     player.autostart = true;
            // })

            app.stage.addChild(objectImg) 
        } else {
            console.log(' nexiste po')
        }
    })
    validateBttn.classList.add("hidden")
    interfaceFinalScene[0].classList.remove("hidden")
    socketObj.emit('set-objects', chosenObjectsId)
}



