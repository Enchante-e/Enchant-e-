import {Texture, Sprite, Graphics, Container, Text} from 'pixi.js'
import {Player} from 'tone'
import { gsap } from "gsap";
import objectsData from "../data/objects.json"
import contraintesData from "../data/contraintes.json"
import * as socket from "../main"
import * as concept from "../conceptPages/concept"
import * as endPage from './endPage'


const OBJECTS = objectsData.objects
const CONTRAINTES = contraintesData.contraintes

let app, socketObj, cursor = null
let chosenObjectsId = []
let commonObjectsId = []
let partnerObjectsId = null
let hoverContainer = null

let validateBttn = document.getElementById("finishObjectsChoice")
let finalSceneBttn = document.getElementById("startFinalScene")
let finishExperienceBttn = document.getElementById("finishExperienceBttn")
let interfaceFinalScene = [...document.getElementsByClassName("finalScene")]


export const setStage = (globalApp) => {
    app = globalApp 
}

export const createCursor = () => {
    cursor  = new Graphics();
    cursor.lineStyle(3, 0x1A1D5C);
    cursor.drawCircle(app.view.width / 2, app.view.height / 2, 15);
    cursor.zIndex = 5
    cursor.alpha = 0
    
    app.stage.addChild(cursor);
    return cursor;
}

export const updateCursor = (cursor, coordX, coordY) => {
    if(cursor) {
        gsap.to(cursor.transform.position, {
            x: coordX - window.innerWidth / 2,
            y: coordY - window.innerHeight / 2,
            duration: 0.15,
            delay: 0.15
        });
    }
}

export const deleteCursor = (cursor) => {
    app.stage.removeChild(cursor)
    document.getElementById("tag").remove()
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
    if (chosenObjectsId.length == 6) {
        finishedChoices() 
    } else {
        alert("You didn't chose enough objects")   
    }
})

finalSceneBttn.addEventListener("click", () => {
    finalSceneInit()
    document.getElementById('tag').style.display = "flex"
    cursor.alpha = 1
    concept.closePhoneConcept()
})

const finishedChoices = () => {
    while(app.stage.children[0]) { app.stage.removeChild(app.stage.children[0]); }

    validateBttn.classList.add("hidden")
    socketObj.emit('set-objects', chosenObjectsId)
}

export const finalSceneInit = () => {
    checkCommonObjects()
    createObjectsSprites(chosenObjectsId, "Mine")
    createObjectsSprites(partnerObjectsId, "Their")
    createObjectsSprites(commonObjectsId, "Ours")
    createEnvironment()
    hoverContainer = createHoverText()
    interfaceFinalScene[0].classList.remove("hidden")
}

const checkCommonObjects = () => {
    chosenObjectsId.map((object) => {
        if (partnerObjectsId.includes(object)) {
            commonObjectsId.push(object)
        }
    })

    commonObjectsId.map((object, i) => {
        if (partnerObjectsId.includes(object)) {
            partnerObjectsId.splice(partnerObjectsId.indexOf(object), 1)
        }
        
        if (chosenObjectsId.includes(object)) {
            chosenObjectsId.splice(chosenObjectsId.indexOf(object), 1)
        }
    })

}

const createObjectsSprites = (objectsArray, whichObjects) => {

    objectsArray.map((object) => {
        if((OBJECTS[object])) {
           
            const img = Texture.from("img/" + OBJECTS[object].src);
            const objectImg = new Sprite(img) ;
            objectImg.id = OBJECTS[object].id;
            
            const SCALE = OBJECTS[object].scale
            objectImg.scale.set(SCALE);
            objectImg.anchor.set(0.5)
            objectImg.interactive = true;

            objectImg.x = 250 + OBJECTS[object].posX * window.innerWidth - (window.innerWidth / 6);
            objectImg.y = 100 + OBJECTS[object].posY * window.innerHeight - (window.innerHeight / 6);
            objectImg.zIndex = OBJECTS[object].index;

            objectImg
            .on('mouseover', onMouseOver)
            .on('mouseout', onMouseOut)
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);

            function onDragStart(event) {
                this.data = event.data;
                this.dragging = true;
                gsap.to(objectImg.scale, {
                    x: objectImg.scale.x * 0.7,
                    y: objectImg.scale.y * 0.7
                });

                const url = "sound/" + OBJECTS[object].sound
                const player = new Player(url).toDestination();
                player.autostart = true;
            }

            function onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                this.data = null;

                gsap.to(objectImg.scale, {
                    x: objectImg.scale.x,
                    y: objectImg.scale.y
                });
            }

            function onDragMove() {
                if (this.dragging) {
                    const newPosition = this.data.getLocalPosition(this.parent);
                    this.x = newPosition.x;
                    this.y = newPosition.y;
                }
            }
            
            function onMouseOver(e) {
                switch(whichObjects) {
                    case "Mine":
                      updateHoverText("Trésor choisi par vous", e.target.x, e.target.y)
                      break;
                    case "Their":
                      updateHoverText("Trésor choisi par votre proche", e.target.x, e.target.y)
                      break;
                    case "Ours":
                      updateHoverText("Trésor choisi par vous deux", e.target.x, e.target.y)
                      break;
                }
            }

            function onMouseOut() {
                hoverContainer.alpha = 0
            }

            app.stage.addChild(objectImg) 
        }
    })
}

const createHoverText = () => {   
    const container = new Container();
    container.alpha = 0
    container.zIndex = 5
    
    const text = new Text("Trésor choisi par vous",{fontFamily : 'futura-pt, Helvetica, Arial', fontSize: 16, fill : 0x0a0d42, align : 'center'});
    text.x = 5
    text.y = 5

    const textBg = Sprite.from(Texture.WHITE);
    textBg.width = text.width + 30;
    textBg.height = text.height + 30;
    textBg.x = 0
    textBg.y = 0

    container.addChild(textBg,text)
    app.stage.addChild(container)

    return container
}

const updateHoverText = (text, posX, posY) => {                  
    hoverContainer.children[1].text = text
    hoverContainer.children[0].width = hoverContainer.children[1].width + 10
    hoverContainer.children[0].height = hoverContainer.children[1].height + 10
    hoverContainer.x = posX
    hoverContainer.y = posY
    hoverContainer.alpha = 1
}

const createEnvironment = () => {

    document.querySelector('canvas').style.background = "linear-gradient(179.38deg, #AFC6EC 4.01%, #FFEEE8 40.15%, #F9D7C0 62.04%, #FF919B 81.49%, #4665BE 134.64%)";

    for (let i = 0; i < CONTRAINTES.length; i++) {

        if (CONTRAINTES[i].timeOfDay == "Final") {

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


            app.stage.addChild(contrainte)

        }
    }


}


finishExperienceBttn.addEventListener("click", () => {
    endPage.initEndPage()
})

