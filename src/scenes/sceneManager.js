import {Loader} from 'pixi.js';
import * as aube from "./aube"
import * as jour from "./jour"
import * as aurore from "./aurore"
import * as crépuscule from "./crépuscule"
import objectsData from "../data/objects.json"
import { getInventoryObjects } from '../js/background';


const SCENES = [aube, aurore, jour, crépuscule]
let currentScene = 'aube'
const OBJECTS = objectsData.objects

const AUDIO_POEME = document.createElement("AUDIO")
AUDIO_POEME.autoplay = true
AUDIO_POEME.loop = false

let sceneOneBttn = document.getElementById('sceneOne')
let sceneTwoBttn = document.getElementById('sceneTwo')
let sceneThreeBttn = document.getElementById('sceneThree')
let sceneFourBttn = document.getElementById('sceneFour')

export const initManager = (globalApp, globalContainer, globalInventory) => {

    const loader = new Loader()
    loader.baseUrl = "img"
    loader.onComplete.add(() => {
        sceneOneBttn.style.display = sceneTwoBttn.style.display = sceneThreeBttn.style.display = sceneFourBttn.style.display = "block"
        firstLoadSmooth(globalApp, globalContainer, globalInventory)
    })

    loader.onError.add((e) => {
        console.log("ERROR"+e.message)
    })

    for (let i = 0; i < OBJECTS.length; i++) {
        loader.load(OBJECTS[i].src)
    }

    playMusic("sound/Aube.wav")

    sceneOneBttn.addEventListener("click", () => {
        currentScene = "Aube"
        clearScene(globalContainer)
        aube.initScene(globalApp, globalContainer, globalInventory)
        playMusic("sound/Aube.wav")
    })
    
    sceneTwoBttn.addEventListener("click", () => {
        currentScene = "Aurore"
        clearScene(globalContainer)
        aurore.initScene(globalApp, globalContainer, globalInventory)
        playMusic("sound/Aurore.wav")
    })
    
    sceneThreeBttn.addEventListener("click", () => {
        currentScene = "Jour"
        clearScene(globalContainer)
        jour.initScene(globalApp, globalContainer, globalInventory)
        playMusic("sound/Jour.wav")
    })
    
    sceneFourBttn.addEventListener("click", () => {
        currentScene = "Crépuscule"
        clearScene(globalContainer)
        crépuscule.initScene(globalApp, globalContainer, globalInventory)
        playMusic("sound/Crépuscule.wav")
    })
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
}

const playMusic = (url) => {

    console.log(AUDIO_POEME.paused, AUDIO_POEME.currentTime)
    
    if (AUDIO_POEME.paused && AUDIO_POEME.currentTime > 0) {
        AUDIO_POEME.src = url
        AUDIO_POEME.play()
    } else if (AUDIO_POEME.paused && AUDIO_POEME.currentTime == 0) {
        AUDIO_POEME.src = url
        AUDIO_POEME.play()
    } else {
        const delay = (25 - AUDIO_POEME.currentTime) * 1000
        setTimeout(() => { 
            AUDIO_POEME.src = url
            AUDIO_POEME.play()
        }, delay);
    }

}