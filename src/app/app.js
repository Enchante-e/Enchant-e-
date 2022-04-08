import * as PIXI from 'pixi.js';

class GameApp {
     constructor(parent = document.body, width = window.innerWidth, height = window.innerHeight) {
         this.parent = parent
         this.width = width
         this.height = height

         this.app = new PIXI.Application({
             width,
             height,
            backgroundColor: 0xFF0000
        });
  
     }



}

const GAMEAPP = new GameApp;

export default GAMEAPP;