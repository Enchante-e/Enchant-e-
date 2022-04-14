import objectsData from "../data/objects.json"
import * as socket from "../main"
import {Text, Texture, Sprite} from 'pixi.js'
import {Player} from 'tone'


const OBJECTS = objectsData.objects
let stage = null
let chosenObjectsId = []
let socketObj = null


export const setStage = (pixiStage) => {
    stage = pixiStage 
}

export const addObject = (objectId) => {
    if (chosenObjectsId.length <= 5) {
        chosenObjectsId.push(objectId)
        console.log(objectId+" added")
    } else {
        console.log("Too much Object")   
        finished() 
    }
}

export const deleteObject = (objectId) => {
    chosenObjectsId.map((object, i) => {
        if(object.id == objectId) {
            users.splice(i, 1)
        }
    })
}


export const partnerObjects = (objects) => {
    objects.map((object) => {
        if((OBJECTS[object])) {
            let text = new Text(OBJECTS[object].name ,{fontFamily : 'Arial', fontSize: 100, fill : 0xFF0000, align : 'center'});
            text.interactive = true;

            text.initialPos = {
                x: 500,
                y: text.y
            }

            text.on("click", function () {
                const url = "sound/" + OBJECTS[object].sound 
                const player = new Player(url).toDestination();
                player.autostart = true;
            })

            stage.addChild(text) 
        } else {
            console.log(' nexiste po')
        }
    })
}


const finished = () => {
    stage.removeChild(stage.children[0])
    chosenObjectsId.map((object, i) => {
        if((OBJECTS[object])) {
            let text = new Text(OBJECTS[object].name ,{fontFamily : 'Arial', fontSize: 100, fill : 0x000000, align : 'center'});
            text.interactive = true;

            // const img = Texture.from("img/" + OBJECTS[object].src);
            // const star = new Sprite(img) ;
            // star.id = OBJECTS[object].id;

            text.on("click", function () {
                const url = "sound/" + OBJECTS[object].sound 
                const player = new Player(url).toDestination();
                player.autostart = true;
            })

            // star.initialPos = {
            //     x: star.x + i *100,
            //     y: star.y + 150
            // }

            // text.initialPos = {
            //     x: text.x + i *100,
            //     y: text.y
            // }

            // stage.addChild(star) 
            stage.addChild(text) 
        } else {
            console.log(' nexiste po')
        }
    })
    socketObj = socket.getSocket()
    socketObj.emit('set-objects', chosenObjectsId)
}



