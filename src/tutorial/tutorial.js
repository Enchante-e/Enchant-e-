import {Graphics } from 'pixi.js';

let overlay, tutorialText = null
const OBJECTS_TO_EXPLAIN = [
    {   'object' : "nav", 
        'text' : "Le paysage que vous allez découvrir est divisé en 4 étapes de la journée, l'aube, le jour, l'aurore, le crépuscule. Vous pouvez naviguer dedans en scrollant ou en cliquant sur les soleils.",
        'coordX' : 0,
        'coordY' : 0
    }, 
    {
        'object' : "coffre", 
        'text' : "Votre coffre aux trésors, vous pouvez drag n droper les trésors que vous choisissez ici, avec un nombre maximum de 6 trésors. En cliquant dessus vous pourrez observer vos trésors choisis et les supprimer de votre coffre en les drag n droppant en dehors de la zone. Vous pouvez également associer une anecdote à ce souvenir en cliquant sur le bouton",
        'coordX' : 0,
        'coordY' : 0
    }, 
    {
        'object' : "notif", 
        'text' : "Vous aurez un aperçu en temps réel des actions de votre proche, quand il ajoute ou supprime des objets de son coffre. Vous aurez également des inspirations sous forme de hashtags pour vous donner des thèmes de souvenirs pouvant être asssociés aux trésors disponibles",
        'coordX' : 0,
        'coordY' : 0
    }]

export const initTutorial = (app) => {
    overlay = new Graphics()
    overlay.beginFill(0x0a0d43, 0.8)
    overlay.name = 'overlay'
    overlay.drawRect(0,0,app.view.width, app.view.height)
    app.stage.addChild(overlay)

    switchObject('coffre')
}

export const switchObject = (object) => {
    switch(object) {
        case "nav":
            createText(OBJECTS_TO_EXPLAIN[0].text)
            break;
        case "coffre":
            createText(OBJECTS_TO_EXPLAIN[1].text)
            console.log(app.getChildByName('coffre'))
            break;
        case "notif":
            createText(OBJECTS_TO_EXPLAIN[2].text)
            break;
    }
}

export const closeTutorial = (app) => {
    tutorialText.remove()
    app.stage.removeChild(overlay)
}

const createText = (text) => {
    tutorialText = document.createElement('p')
    tutorialText.innerHTML = text
    tutorialText.id = 'tutorial-text'
    document.body.appendChild(tutorialText)
}

const updateText = (text) => {
    tutorialText.innerHTML = text
}

const focusObject = (object) => {

}