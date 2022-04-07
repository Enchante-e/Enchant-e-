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


    createCursor() {
        const cursor  = new PIXI.Graphics();
        cursor.beginFill(0xFFFFFF);
        cursor.drawCircle(this.app.view.width / 2, this.app.view.height / 2, 10);
        cursor.endFill();
        this.app.stage.addChild(cursor);
        return cursor;
    }

}

const GAMEAPP = new GameApp;

export default GAMEAPP;