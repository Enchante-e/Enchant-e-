import {Application,Container, Texture, Sprite, Graphics, Text } from 'pixi.js';
import objectsData from "../data/objects.json"
import {Player} from 'tone'
import * as finalScene from "../finalScene/finalScene"
import * as aube from "../scenes/aube"
import * as jour from "../scenes/jour"
import * as aurore from "../scenes/aurore"
import * as crépuscule from "../scenes/crépuscule"

import * as sceneManager from "../scenes/sceneManager"

let cameraVector = {
    a: 0,
    l: 0
};
let move = false

var center = {},
app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    transparent: true,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
}),
play = false,
container = new Container(1080),
rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const SCENES = [aube, aurore, jour, crépuscule]
const INVENTORY_SLOTS = [{'object': null,x:-100,y:0,'bttn': null, 'anecdote':null},{'object': null,x:100,y:150,'bttn': null, 'anecdote':null},{'object': null,x:-100,y:300,'bttn': null, 'anecdote':null},{'object': null,x:100,y:450,'bttn': null, 'anecdote':null},{'object': null,x:-100,y:600,'bttn': null, 'anecdote':null},{'object': null,x:100,y:750,'bttn': null, 'anecdote':null}]
let inventoryOpen = false

let anecdotesDiv = document.getElementById('anecdotes')
let annecdoteInput = document.getElementById('anecdoteInput')
let annecdoteAdd = document.getElementById('anecdoteBttnAdd')
let annecdoteDelete = document.getElementById('anecdoteBttnDelete')

export const initCanvas = () => {

    document.body.appendChild(app.view);

    container.x = app.screen.width / 8;
    container.y = app.screen.height / 8;
    container.pivot.x = container.width / 8;
    container.pivot.y = container.height / 8;
    container.sortableChildren = true
    app.stage.sortableChildren = true
    
    const inventory = createInventory()
    app.stage.addChild(container);

    sceneManager.initManager(app, container, inventory)
    
    finalScene.setStage(app)

}

const createInventory = () => {
    const imgCoffre = Texture.from("img/Coffre.svg")
    const coffre = new Sprite(imgCoffre)

    coffre.x = 80;
    coffre.y =  app.view.height - 110;
    coffre.scale.set(0.4);
    coffre.anchor.set(0.5)
    coffre.zIndex = 11;
    coffre.interactive = true;

    const imgCoffreBg = Texture.from("img/CoffreBg.svg")
    const coffreBg = new Sprite(imgCoffreBg)

    coffreBg.x = 0;
    coffreBg.y = 125;
    coffreBg.scale.set(0.15);
    coffreBg.alpha = 0;
    coffreBg.zIndex = 10;
    
    coffre.on("click", function (e) {
        this.interactive = true;
        inventoryOpen = !inventoryOpen

        if(inventoryOpen) {
            coffreBg.alpha = 1;
            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    slot.object.alpha = 1
                    slot.object.scale.set(0.13)
                    slot.bttn.alpha = 1
                    slot.bttn.scale.set(1)

                    if (slot.anecdote !== null) {
                        slot.anecdote.alpha = 1
                        slot.anecdote.scale.set(1)
                    }
                } else {
                    slot.bttn.alpha = 0
                    slot.bttn.scale.set(0)
                    
                    if (slot.anecdote !== null) {
                        slot.anecdote.alpha = 0
                        slot.anecdote.scale.set(0)
                    }
                }
            })
        } else {
            coffreBg.alpha = 0;
            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    slot.object.alpha = 0
                    slot.object.scale.set(0)
                    slot.bttn.alpha = 0
                    slot.bttn.scale.set(0)

                    if (slot.anecdote !== null) {
                        slot.anecdote.alpha = 0
                        slot.anecdote.scale.set(0)
                    }
                    anecdotesDiv.style.display = "none"
                    anecdotesDiv.className = ''
                }
            })
        }
    })

    INVENTORY_SLOTS.map((slot) => {
        const anecdoteBttn = new Graphics();
        anecdoteBttn.beginFill(0xFFFFFF);
        anecdoteBttn.drawCircle(slot.x + 150, slot.y + 150, 12);
        anecdoteBttn.endFill();
        anecdoteBttn.zIndex = 16
        anecdoteBttn.scale.set(0)
        anecdoteBttn.alpha = 0
        anecdoteBttn.interactive = true
        slot.bttn = anecdoteBttn

        anecdoteBttn.on("click", function (e) {
            this.interactive = true;
            initAnecdotes(slot)
        })

        app.stage.addChild(anecdoteBttn);
    })
    
    
    app.stage.addChild(coffre, coffreBg)
    return coffre
}

export const addToSlot = (object) => {
    let slotFound = false

    INVENTORY_SLOTS.map((slot) => {
        if (slotFound === false) {
            if (slot.object == null) {
                finalScene.addObject(object.id)
                slot.object = object
                
                object.x = slot.x;
                object.y = slot.y;
                object.scale.set(0.13)
                object.zIndex = 15
                object.tint = 0x1A1D5C;
                
                if(inventoryOpen === false) {
                    object.alpha = 0
                    object.scale.set(0)
                } else {
                    slot.bttn.alpha = 1
                    slot.bttn.scale.set(1)
                }                

                const url = "sound/Coffre.wav"
                const player = new Player(url).toDestination();
                player.autostart = true;

                slotFound = true
            }
        }
    })

    if (slotFound === false) {
        alert("coffre full")
        object.x = app.view.width / 2;
        object.y = app.view.height / 2;
    }
}

export const clearSlot = (object) => {
    INVENTORY_SLOTS.map((slot) => {
        if (slot.object == object) {
            slot.object = null 
            slot.bttn.alpha = 0   
            slot.bttn.scale.set(0)
            app.stage.removeChild(slot.anecdote)
            slot.anecdote = null 
        }
    })
}

export const initAnecdotes = (slot) => {

    if (anecdotesDiv.style.display == "flex") {
        anecdotesDiv.style.display = "none"
        anecdotesDiv.className = ''
    } else {
        anecdotesDiv.style.display ="flex"
        anecdotesDiv.classList.add(slot.object.name)
    }
}

annecdoteAdd.addEventListener("click", () => {
    const anecdoteTxt = annecdoteInput.value

    if (anecdoteTxt !== "") {
        INVENTORY_SLOTS.map((slot) => {
            if (slot.object !== null && slot.object.name == anecdotesDiv.className) {
                if(slot.anecdote == null) {
                    const textContainer = new Container();
                    
                    const text = new Text(anecdoteTxt,{fontFamily : 'Helvetica, Arial', fontSize: 15, fill : 0x0a0d42, align : 'center'});
                    text.x = slot.x + 200
                    text.y = slot.y + 100

                    const textBg = Sprite.from(Texture.WHITE);
                    textBg.width = text.width + 10;
                    textBg.height = text.height + 10;
                    textBg.x = slot.x + 195
                    textBg.y = slot.y + 95
                    
                    textContainer.addChild(textBg, text)
                    app.stage.addChild(textContainer)
                    slot.anecdote = textContainer
                } else {
                    slot.anecdote.children[1].text = anecdoteTxt
                    slot.anecdote.children[0].width = slot.anecdote.children[1].width + 10
                    slot.anecdote.children[0].height = slot.anecdote.children[1].height + 10
                }
            } 
        })
    }

    anecdotesDiv.style.display = "none"
    anecdotesDiv.className = ''
})

annecdoteDelete.addEventListener("click", () => {
    
    INVENTORY_SLOTS.map((slot) => {
        if (slot.object !== null && slot.object.name == anecdotesDiv.className) {
            app.stage.removeChild(slot.anecdote)
            slot.anecdote = null
        } 
    })
    
    anecdotesDiv.style.display = "none"
    anecdotesDiv.className = ''
})

anecdoteBttnClose.addEventListener("click", () => {
    anecdotesDiv.style.display = "none"
    anecdotesDiv.className = ''
})

export const activeMovement = () => {
    return move = true
}

export const getInventoryObjects = () => {
    return INVENTORY_SLOTS
}
