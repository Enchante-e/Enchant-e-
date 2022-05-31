import {Texture, Sprite, Graphics} from 'pixi.js';
import objectsData from "../data/objects.json"
import {Player} from 'tone'
import * as finalScene from "../finalScene/finalScene"
import * as socket from "../main"

let socketObj = null
let cameraVector = {
    a: 0,
    l: 0
};
const OBJECTS = objectsData.objects
let app, container

export const initCrépuscule = (globalApp, globalContainer) => {

    app = globalApp
    container = globalContainer
    createEnvironment()

    for (let i = 0; i < OBJECTS.length; i++) {

        if(OBJECTS[i].timeOfDay == "Crépuscule" && OBJECTS[i].name !== "Cartes" && OBJECTS[i].name !== "Crayon" && OBJECTS[i].name !== "Lampe") {

            const img = Texture.from("img/" + OBJECTS[i].src);
            const object = new Sprite(img) ;
            object.id = OBJECTS[i].id;
    
            const LUCK = (Math.random() * 10) == 5;
            const SCALE = OBJECTS[i].scale
            object.scale.set(SCALE);
            object.interactive = true;
            object.buttonMode = LUCK;
    
            object.x = OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
            object.y = OBJECTS[i].posY * window.innerHeight - (window.innerHeight / 6);
            object.initialPos = {
                x : object.x,
                y: object.y
            }

            object.goBack = false;
            object.l = Math.random() * 4;
            object.zIndex = 5;
             
            object.on("click", function (e) {
                this.interactive = true;
                finalScene.addObject(object.id)

                if(socketObj == null) {
                    socketObj = socket.getSocket()
                }
    
                socketObj.emit('partner-notification', "treasureAdded")
            })
    
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
            
            container.addChild(object);
        }
    }
}

export const playMusic = () => {
    const url = "sound/Aurore.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = () => {
    const canvas = document.querySelectorAll('canvas')
    canvas[0].style.background = "rgb(106,0,143)"
    canvas[0].style.background = "linear-gradient(180deg, rgba(106,0,143,1) 0%, rgba(0,41,157,1) 100%)"

    document.getElementById("bulleBg").style.background = "#fff"
    document.getElementById("bulleName").style.color = "#fff"
    document.getElementById("bulleSymbol").style.color = "#0a0d42"

    const backgroundImg = Texture.from("img/constraints-c-lines.svg");
    const background = new Sprite(backgroundImg)
    background.scale.set(0.5);
    app.stage.addChild(background);

    for (let i = 0; i < 1; i++) {
        const constraintImg = Texture.from("img/constraints-c-3-"+i+".svg");
        const constraint = new Sprite(constraintImg)
        constraint.scale.set(0.5);
        
        app.stage.addChild(constraint);
    }
}

