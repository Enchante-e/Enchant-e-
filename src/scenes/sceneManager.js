import {Loader} from 'pixi.js';
import * as aube from "./aube"
import * as jour from "./jour"
import * as aurore from "./aurore"
import * as crépuscule from "./crépuscule"
import objectsData from "../data/objects.json"
import { getInventoryObjects } from '../js/background';

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
        document.getElementById('testDiv').style.display = "block"
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
        switchScene("Aube", globalApp, globalContainer, globalInventory)
    })
    
    sceneTwoBttn.addEventListener("click", () => {
        switchScene("Aurore", globalApp, globalContainer, globalInventory)
    })
    
    sceneThreeBttn.addEventListener("click", () => {
        switchScene("Jour", globalApp, globalContainer, globalInventory)
    })
    
    sceneFourBttn.addEventListener("click", () => {
        switchScene("Crépuscule", globalApp, globalContainer, globalInventory)
    })
}

export const switchScene = (name, globalApp, globalContainer, globalInventory) => {
    currentScene = name

    switch(name) {
        case "Aube":
            clearScene(globalContainer)
            aube.playMusic()
            aube.initScene(globalApp, globalContainer, globalInventory)
            break;
        case "Aurore":
            clearScene(globalContainer)
            aurore.playMusic()
            aurore.initScene(globalApp, globalContainer, globalInventory)
            break;
        case "Jour":
            clearScene(globalContainer)
            jour.playMusic()
            jour.initScene(globalApp, globalContainer, globalInventory)
            break;
        case "Crépuscule":
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

    while (globalContainer.children[0]) {
        globalContainer.removeChild(globalContainer.children[0])
    }

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