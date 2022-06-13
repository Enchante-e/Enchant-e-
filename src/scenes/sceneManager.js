import {Loader} from 'pixi.js';
import * as aube from "./aube"
import * as jour from "./jour"
import * as aurore from "./aurore"
import * as crépuscule from "./crépuscule"
import objectsData from "../data/objects.json"

const SCENES = [aube, aurore, jour, crépuscule]
const OBJECTS = objectsData.objects

let sceneOneBttn = document.getElementById('sceneOne')
let sceneTwoBttn = document.getElementById('sceneTwo')
let sceneThreeBttn = document.getElementById('sceneThree')
let sceneFourBttn = document.getElementById('sceneFour')

export const initManager = (app) => {

    // const loader = Loader.shared
    const loader = new Loader()
    loader.baseUrl = "img"

    for (let i = 0; i < OBJECTS.length; i++) {
        if(OBJECTS[i].timeOfDay == "Jour") {
            console.log()
            loader.add(OBJECTS[i].src)
        }
    }
    
    loader.load(finishedLoading)
    loader.progress(showProgress)

    // loader.onProgress.add(showProgress)
    // loader.onError.add(showError)


    const showProgress = (e) => {
        console.log("PROGRESS"+e.progress)
    }
    
    const finishedLoading = (e) => {
        console.log("DONE LOADING")
    }
    
    const showError = (e) => {
        console.log("ERROR"+e.message)
    }

    sceneOneBttn.addEventListener("click", () => {
        console.log("scene 1")
    })
    
    sceneTwoBttn.addEventListener("click", () => {
        console.log("scene 2")
    })
    
    sceneThreeBttn.addEventListener("click", () => {
        console.log("scene 3")
    })
    
    sceneFourBttn.addEventListener("click", () => {
        console.log("scene 4")
    })
}
