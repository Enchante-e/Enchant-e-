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

    sceneOneBttn.addEventListener("click", () => {
        currentScene = "Aube"
        clearScene(globalContainer)
        aube.initScene(globalApp, globalContainer, globalInventory)
        aube.playMusic()
    })
    
    sceneTwoBttn.addEventListener("click", () => {
        console.log("helooooooo")
        currentScene = "Aurore"
        clearScene(globalContainer)
        aurore.initScene(globalApp, globalContainer, globalInventory)
        aurore.playMusic()
    })
    
    sceneThreeBttn.addEventListener("click", () => {
        currentScene = "Jour"
        clearScene(globalContainer)
        jour.initScene(globalApp, globalContainer, globalInventory)
        jour.playMusic()
    })
    
    sceneFourBttn.addEventListener("click", () => {
        currentScene = "Crépuscule"
        clearScene(globalContainer)
        crépuscule.initScene(globalApp, globalContainer, globalInventory)
        crépuscule.playMusic()
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