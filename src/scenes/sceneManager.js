import {Loader} from 'pixi.js';
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
                    sceneTwoBttn.style.fill='#fff'; 
                    sceneThreeBttn.style.fill = sceneFourBttn.style.fill = sceneOneBttn.style.fill = tutorialBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
                case "Aurore":
                    switchScene("Jour", globalApp, globalContainer, globalInventory)
                    sceneThreeBttn.style.fill='#fff'; 
                    sceneTwoBttn.style.fill = sceneFourBttn.style.fill = sceneOneBttn.style.fill = tutorialBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
                case "Jour":
                    switchScene("Crépuscule", globalApp, globalContainer, globalInventory)
                    sceneFourBttn.style.fill='#fff'; 
                    sceneTwoBttn.style.fill = sceneThreeBttn.style.fill = sceneOneBttn.style.fill = tutorialBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
                case "Crépuscule":
                    switchScene("Aube", globalApp, globalContainer, globalInventory)
                    sceneOneBttn.style.fill = tutorialBttn.style.fill = '#fff'; 
                    sceneThreeBttn.style.fill = sceneFourBttn.style.fill = sceneTwoBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
            }

            scrollRatio = 0
        } else if(scrollRatio <= -40) {
            switch(currentScene) {
                case "Jour":
                    switchScene("Aurore", globalApp, globalContainer, globalInventory)
                    sceneTwoBttn.style.fill='#fff'; 
                    sceneThreeBttn.style.fill = sceneFourBttn.style.fill = sceneOneBttn.style.fill = tutorialBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
                case "Crépsucule":
                    switchScene("Jour", globalApp, globalContainer, globalInventory)
                    sceneThreeBttn.style.fill='#fff'; 
                    sceneTwoBttn.style.fill = sceneFourBttn.style.fill = sceneOneBttn.style.fill = tutorialBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
                case "Aube":
                    switchScene("Crépuscule", globalApp, globalContainer, globalInventory)
                    sceneFourBttn.style.fill='#fff'; 
                    sceneTwoBttn.style.fill = sceneThreeBttn.style.fill = sceneOneBttn.style.fill = tutorialBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
                case "Aurore":
                    switchScene("Aube", globalApp, globalContainer, globalInventory)
                    sceneOneBttn.style.fill = tutorialBttn.style.fill = '#fff'; 
                    sceneThreeBttn.style.fill = sceneFourBttn.style.fill = sceneTwoBttn.style.fill = 'rgba(255, 255, 255, 0.25)';
                break;
            }
        }
    });
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

// MUSIQUE SE JOUE EN MEME TEMPS A TRAVAILLER

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