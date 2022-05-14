import objectsData from "../data/objects.json"
import * as socket from "../main"
import {Text, Texture, Sprite} from 'pixi.js'
import {Player} from 'tone'


const OBJECTS = objectsData.objects
let stage, socketObj = null
let chosenObjectsId = []


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
            console.log(objectId+" removed")
        }
    })
}


export const partnerObjects = (objects) => {
    objects.map((object) => {
        if((OBJECTS[object])) {
            let text = new Text(OBJECTS[object].name ,{fontFamily : 'Arial', fontSize: 100, fill : 0x00fa00, align : 'center'});
            // text.interactive = true;

            // const img = Texture.from('https://cdn.pixabay.com/photo/2021/09/06/10/07/leaves-6601325_960_720.png')
            const img = Texture.from("img/" + OBJECTS[object].src);
            const star = new Sprite(img) ;
            star.id = OBJECTS[object].id;

            const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
            let scale = 0.5 ;
            star.interactive = true;

            star.scale.set(scale);
            star.tint = 0x00fa00;
            star.x = rnd(-2 * window.innerWidth, 2 * window.innerWidth);
            star.y = rnd(-2 * window.innerHeight, 2 * window.innerHeight);
            star.initialPos = {
                x: star.x,
                y: star.y
            }
            star.l = Math.random() * 4;
            star.zIndex = scale;

            text.x = star.x
            text.y = star.y
            text.initialPos = {
                x: star.x,
                y: star.y
            }
            text.l = Math.random() * 4;
            text.zIndex = scale;

            star.on("click", function () {
                const url = "sound/" + OBJECTS[object].sound 
                const player = new Player(url).toDestination();
                player.autostart = true;
            })

            stage.addChild(star) 
            // stage.addChild(text) 
        } else {
            console.log(' nexiste po')
        }
    })
}


const finished = () => {
    stage.removeChild(stage.children[0])
    chosenObjectsId.map((object, i) => {
        if((OBJECTS[object])) {
            let text = new Text(OBJECTS[object].name ,{fontFamily : 'Arial', fontSize: 20, fill : 0xfa0000, align : 'center'});
            // text.interactive = true;
            
            // const img = Texture.from('https://cdn.pixabay.com/photo/2021/09/06/10/07/leaves-6601325_960_720.png')
            const img = Texture.from("img/" + OBJECTS[object].src);
            const star = new Sprite(img) ;
            star.id = OBJECTS[object].id;
            
            const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
            let scale = 0.5 ;
            star.interactive = true;

            star.scale.set(scale);
            star.tint = 0xfa0000;
            star.x = rnd(-1 * window.innerWidth, 1 * window.innerWidth);
            star.y = rnd(-1 * window.innerHeight, 1 * window.innerHeight);
            star.initialPos = {
                x: star.x,
                y: star.y
            }
            star.l = Math.random() * 4;
            star.zIndex = scale;

            text.x = star.x
            text.y = star.y
            text.initialPos = {
                x: star.x,
                y: star.y
            }
            text.l = Math.random() * 4;
            text.zIndex = scale;

            star.on("click", function () {
                const url = "sound/" + OBJECTS[object].sound 
                const player = new Player(url).toDestination();
                player.autostart = true;
            })

            stage.addChild(star) 
            // stage.addChild(text) 
        } else {
            console.log(' nexiste po')
        }
    })
    socketObj = socket.getSocket()
    socketObj.emit('set-objects', chosenObjectsId)
}



