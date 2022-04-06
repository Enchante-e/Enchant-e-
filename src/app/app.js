import * as PIXI from 'pixi.js';

export class GameApp {

    constructor(parent, width, height) {

        this.app = new PIXI.Application({width, height, backgroundColor : 0xE8D6D6});
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        // // init Pixi loader
        // let loader = new PIXI.Loader();
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
