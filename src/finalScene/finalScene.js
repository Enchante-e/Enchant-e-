import {Texture, Sprite, Graphics} from 'pixi.js'
import {Player} from 'tone'
import objectsData from "../data/objects.json"
import * as socket from "../main"
import * as concept from "../conceptPages/concept"


const OBJECTS = objectsData.objects
let app, socketObj, cursor = null
let chosenObjectsId = []
let commonObjectsId = []
let partnerObjectsId = null
let validateBttn = document.getElementById("finishObjectsChoice")
let finalSceneBttn = document.getElementById("startFinalScene")
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

            if(socketObj == null) {
                socketObj = socket.getSocket()
            }

            socketObj.emit('partner-notification', "treasureRemoved")
        }
    })
}


export const partnerObjects = (objects) => {
    partnerObjectsId = objects
}

validateBttn.addEventListener("click", () => {
    console.log(chosenObjectsId)
    if (chosenObjectsId.length == 6) {
        finishedChoices() 
    } else {
        alert("You didn't chose enough objects")   
    }
})

finalSceneBttn.addEventListener("click", () => {
    finalSceneInit()
    concept.closePhoneConcept()
})

const finishedChoices = () => {
    concept.initPhoneConcept()
    app.stage.removeChild(app.stage.children[0])
    validateBttn.classList.add("hidden")
    socketObj.emit('set-objects', chosenObjectsId)
}

export const finalSceneInit = () => {
    checkCommonObjects()
    createObjectsSprites(chosenObjectsId, "0xEE7E3C")
    createObjectsSprites(partnerObjectsId, "0x9B7593")
    createObjectsSprites(commonObjectsId, "0xC57A68")
    interfaceFinalScene[0].classList.remove("hidden")
}

const checkCommonObjects = () => {
    chosenObjectsId.map(i => {
        if (partnerObjectsId.includes(i)) {
            commonObjectsId.push(i)
            // partnerObjectsId.splice(i, 1)
            // chosenObjectsId.splice(i, 1)
        }
    })
}

const createObjectsSprites = (objectsArray, objectsColor) => {
    objectsArray.map((object) => {
        if((OBJECTS[object])) {
           
            const img = Texture.from("img/" + OBJECTS[object].src);
            const objectImg = new Sprite(img) ;
            objectImg.id = OBJECTS[object].id;
            
            const SCALE = OBJECTS[object].scale
            objectImg.scale.set(SCALE);
            objectImg.interactive = true;

            objectImg.tint = objectsColor;
            objectImg.x = OBJECTS[object].posX * window.innerWidth - (window.innerWidth / 6);
            objectImg.y = OBJECTS[object].posY * window.innerHeight - (window.innerHeight / 6);

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


