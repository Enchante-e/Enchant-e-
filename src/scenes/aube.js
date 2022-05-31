import {Texture, Sprite} from 'pixi.js';
import objectsData from "../data/objects.json"
import * as finalScene from "../finalScene/finalScene"
import {Player} from 'tone'

let cameraVector = {
    a: 0,
    l: 0
};
const OBJECTS = objectsData.objects
let app, container

export const initAube = (globalApp, globalContainer) => {

    app = globalApp
    container = globalContainer
    createEnvironment()

    for (let i = 0; i < OBJECTS.length; i++) {

        if(OBJECTS[i].timeOfDay == "Aube") {

            const img = Texture.from("img/" + OBJECTS[i].src);
            const object = new Sprite(img) ;
            object.id = OBJECTS[i].id;
    
            const LUCK = (Math.random() * 10) == 5;
            const SCALE = OBJECTS[i].scale
            object.scale.set(SCALE);
            object.interactive = true;
            object.buttonMode = LUCK;
    
            object.x =OBJECTS[i].posX * window.innerWidth - (window.innerWidth / 6);
            object.y = OBJECTS[i].posY * window.innerHeight - (window.innerHeight / 6);

            object.goBack = false;
            object.l = Math.random() * 4;
            object.zIndex = 0;
             
            object.on("click", function (e) {
                this.interactive = true;
                finalScene.addObject(object.id)
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
    const url = "sound/Aube.wav"
    const player = new Player(url).toDestination();
    player.autostart = true;
}

const createEnvironment = () => {
    const canvas = document.querySelectorAll('canvas')
    canvas[0].style.background = "rgb(182,142,155)"
    canvas[0].style.background = "linear-gradient(180deg, rgba(182,142,155,1) 0%, rgba(223,206,255,1) 100%)"
}