import {Loader} from 'pixi.js';
import { gsap } from "gsap";
import objectsData from "../data/objects.json"
import * as aube from "./aube"
import * as jour from "./jour"
import * as aurore from "./aurore"
import * as crépuscule from "./crépuscule"
import { getInventoryObjects } from '../js/background';

let currentScene = 'Aube'
const OBJECTS = objectsData.objects

const AUDIO_POEME = document.createElement("AUDIO")
AUDIO_POEME.autoplay = true
AUDIO_POEME.loop = false

let tutorialBttn = document.getElementById('tutorialBttn')
let sceneOneBttn = document.getElementById('sceneOne')
let sceneTwoBttn = document.getElementById('sceneTwo')
let sceneThreeBttn = document.getElementById('sceneThree')
let sceneFourBttn = document.getElementById('sceneFour')

//TEST
let scrollRatio = 0
//

export const initManager = (globalApp, globalContainer, globalInventory) => {

    const loader = new Loader()
    loader.baseUrl = "img"
    loader.onComplete.add(() => {
        document.getElementById('sunNav').style.display = "block"
        firstLoadSmooth(globalApp, globalContainer, globalInventory)
    })

    loader.onError.add((e) => {
        console.log("ERROR"+e.message)
    })

    for (let i = 0; i < OBJECTS.length; i++) {
        loader.load(OBJECTS[i].src)
    }

    tutorialBttn.addEventListener("click", () => {
        switchScene("Aube", globalApp, globalContainer, globalInventory)
        scrollRatio = 0
    })

    sceneOneBttn.addEventListener("click", () => {
        switchScene("Aube", globalApp, globalContainer, globalInventory)
        scrollRatio = 0
    })
    
    sceneTwoBttn.addEventListener("click", () => {
        switchScene("Aurore", globalApp, globalContainer, globalInventory)
        scrollRatio = 0
    })
    
    sceneThreeBttn.addEventListener("click", () => {
        switchScene("Jour", globalApp, globalContainer, globalInventory)
        scrollRatio = 0
    })
    
    sceneFourBttn.addEventListener("click", () => {
        switchScene("Crépuscule", globalApp, globalContainer, globalInventory)
        scrollRatio = 0
    })

    document.addEventListener('wheel', (e) => {
        if(scrollRatio <= 200 && scrollRatio >= -40) {
            if (e.deltaY >= 0) {
                scrollRatio += 20
            } else if (e.deltaY <= 0) {
                scrollRatio -= 20
            }
        } else if(scrollRatio >= 200) {
            switch(currentScene) {
                case "Aube":
                    switchScene("Aurore", globalApp, globalContainer, globalInventory)
                break;
                case "Aurore":
                    switchScene("Jour", globalApp, globalContainer, globalInventory)
                break;
                case "Jour":
                    switchScene("Crépuscule", globalApp, globalContainer, globalInventory)
                break;
                case "Crépuscule":
                    switchScene("Aube", globalApp, globalContainer, globalInventory)
                break;
            }

            scrollRatio = 0
        } else if(scrollRatio <= -40) {
            switch(currentScene) {
                case "Jour":
                    switchScene("Aurore", globalApp, globalContainer, globalInventory)
                break;
                case "Crépuscule":
                    switchScene("Jour", globalApp, globalContainer, globalInventory)
                break;
                case "Aube":
                    switchScene("Crépuscule", globalApp, globalContainer, globalInventory)
                break;
                case "Aurore":
                    switchScene("Aube", globalApp, globalContainer, globalInventory)
                break;
            }

            scrollRatio = 0
        }
    });
}

export const switchScene = (name, globalApp, globalContainer, globalInventory) => {
    currentScene = name

    switch(name) {
        case "Aube":
            gsap.to([sceneOneBttn, tutorialBttn], {
                fill: '#fff',
                duration: 1,
                delay: 0.15
            });

            gsap.to([sceneThreeBttn,sceneFourBttn,sceneTwoBttn], {
                fill: 'rgba(255, 255, 255, 0.25)',
                duration: 1,
                delay: 0.15
            });
            
            clearScene(globalContainer)
            // aube.playMusic()
            aube.initScene(globalApp, globalContainer, globalInventory)
            break;
        case "Aurore":
            gsap.to(sceneTwoBttn, {
                fill: '#fff',
                duration: 1,
                delay: 0.15
            });

            gsap.to([sceneThreeBttn,sceneFourBttn,sceneOneBttn,tutorialBttn], {
                fill: 'rgba(255, 255, 255, 0.25)',
                duration: 1,
                delay: 0.15
            });

            clearScene(globalContainer)
            // aurore.playMusic()
            aurore.initScene(globalApp, globalContainer, globalInventory)
            break;
        case "Jour":
            gsap.to(sceneThreeBttn, {
                fill: '#fff',
                duration: 1,
                delay: 0.15
            });

            gsap.to([sceneTwoBttn,sceneFourBttn,sceneOneBttn,tutorialBttn], {
                fill: 'rgba(255, 255, 255, 0.25)',
                duration: 1,
                delay: 0.15
            });

            clearScene(globalContainer)
            // jour.playMusic()
            jour.initScene(globalApp, globalContainer, globalInventory)
            break;
        case "Crépuscule":
            gsap.to(sceneFourBttn, {
                fill: '#fff',
                duration: 1,
                delay: 0.15
            });

            gsap.to([sceneThreeBttn,sceneTwoBttn,sceneOneBttn,tutorialBttn], {
                fill: 'rgba(255, 255, 255, 0.25)',
                duration: 1,
                delay: 0.15
            });

            clearScene(globalContainer)
            crépuscule.playMusic()
            crépuscule.initScene(globalApp, globalContainer, globalInventory)
            break;
    }

}

const firstLoadSmooth = (globalApp, globalContainer, globalInventory) => {
    aube.initScene(globalApp, globalContainer, globalInventory)
    aurore.initScene(globalApp, globalContainer, globalInventory)
    jour.initScene(globalApp, globalContainer, globalInventory)
    crépuscule.initScene(globalApp, globalContainer, globalInventory)

    clearScene(globalContainer)

    aube.initScene(globalApp, globalContainer, globalInventory)
}

const clearScene = (globalContainer) => {

    let coffre = globalContainer.getChildByName("Coffre-Bttn")
    let coffreBg = globalContainer.getChildByName("Coffre-Bg")

    while (globalContainer.children[0]) {
        globalContainer.removeChild(globalContainer.children[0])
    }

    const INVENTORY_SLOTS = getInventoryObjects()

    INVENTORY_SLOTS.map((slot) => {
        if (slot.object !== null) {
            if (slot.object.timeOfDay !== currentScene) {
                globalContainer.addChild(slot.object)
            }
        }
    })

    globalContainer.addChild(coffreBg, coffre)
}