import {Application,Container, Texture, Sprite, Graphics, Text } from 'pixi.js';
import {Player} from 'tone'
import * as finalScene from "../finalScene/finalScene"
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

const INVENTORY_SLOTS = [

    {'object': null,x:500,y:750,'bttn': null, 'anecdote':null},
    {'object': null,x:100,y:400,'bttn': null, 'anecdote':null},
    {'object': null,x:400,y:500,'bttn': null, 'anecdote':null},
    {'object': null,x:200,y:550,'bttn': null, 'anecdote':null},
    {'object': null,x:200,y:800,'bttn': null, 'anecdote':null},
    {'object': null,x:700,y:850,'bttn': null, 'anecdote':null}
]

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
    
    app.stage.addChild(container);
    
    const inventory = createInventory()
    sceneManager.initManager(app, container, inventory)
    
    finalScene.setStage(app)

}

const createInventory = () => {
    const imgCoffre = Texture.from("img/Coffre.svg")
    const coffre = new Sprite(imgCoffre)

    coffre.x = - 130;
    coffre.y =  app.view.height - 220;
    // coffre.x = - 80;
    // coffre.y =  1000;
    coffre.scale.set(0.4);
    coffre.anchor.set(0.5)
    coffre.zIndex = 2;
    coffre.interactive = true;
    coffre.name = "Coffre-Bttn"

    const imgCoffreBg = Texture.from("img/CoffreBg.svg")
    const coffreBg = new Sprite(imgCoffreBg)

    coffreBg.x = -280;
    coffreBg.y = 30;
    coffreBg.scale.set(0.18);
    coffreBg.alpha = 0;
    coffreBg.zIndex = 2;
    coffreBg.name = "Coffre-Bg"
    
    coffre.on("click", function (e) {
        this.interactive = true;
        inventoryOpen = !inventoryOpen

        if(inventoryOpen) {

            gsap.to(coffreBg, {
                alpha: 1,
                x: -310,
                duration: 1
            });

            INVENTORY_SLOTS.map((slot) => {
                if (slot.object !== null) {
                    gsap.to([slot.bttn, slot.object], {
                        alpha: 1,
                        duration: 3
                    });

                    slot.object.scale.set(0.13)
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
            
            gsap.to(coffreBg, {
                alpha: 0,
                x: -320,
                duration: 1
            });

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
        anecdoteBttn.zIndex = 3
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
    
    container.addChild(coffreBg,coffre)
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
        alert("Votre coffre a déjà 6 objets au maximum.")
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
                    
                    const text = new Text(anecdoteTxt,{fontFamily : 'futura-pt, Helvetica, Arial', fontSize: 18, wordWrap: true, wordWrapWidth: 150,  fill : 0x0a0d42, align : 'left'});
                    text.x = slot.x + 200
                    text.y = slot.y + 100

                    const textBg = Sprite.from(Texture.WHITE);
                    textBg.width = text.width + 30;
                    textBg.height = text.height + 30;
                    textBg.x = slot.x + 185
                    textBg.y = slot.y + 85
                    
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
