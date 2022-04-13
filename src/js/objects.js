import objectsData from "../assets/data/objects.json"
import {Text} from 'pixi.js'
import {Player} from 'tone'

const OBJECTS = objectsData.objects
let stage = null
let chosenObjectsId = []

export const addObject = (objectId, app) => {
    if (chosenObjectsId.length <= 5) {
        chosenObjectsId.push(objectId)
        console.log(objectId+" added")
    } else {
        console.log("Too much Object")   
        if (stage == null) {
            stage = app 
            finished() 
        }
    }
}

export const deleteObject = (objectId) => {
    chosenObjectsId.map((object, i) => {
        if(object.id == objectId) {
            users.splice(i, 1)
        }
    })
}

const finished = () => {
    stage.removeChild(stage.children[0])
    chosenObjectsId.map((object) => {
        if((OBJECTS[object])) {
            let text = new Text(OBJECTS[object].name ,{fontFamily : 'Arial', fontSize: 150, fill : 0x000000, align : 'center'});
            text.interactive = true;

            text.on("click", function () {
                // const sound = require("../assets/sound/background.mp3")
                const url = "../assets/sound/" + OBJECTS[object].sound 
                console.log(url)
                const sound = require(url)
                const player = new Player(sound).toDestination();
                player.autostart = true;
            })

            stage.addChild(text) 
        } else {
            console.log('nexiste po')
        }
    })
}



