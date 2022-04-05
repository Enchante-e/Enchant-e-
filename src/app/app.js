import * as PIXI from 'pixi.js';

export class GameApp {

    constructor(parent, width, height) {

        this.app = new PIXI.Application({width, height, backgroundColor : 0xFFFFFF});
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        // init Pixi loader
        let loader = new PIXI.Loader();

        // loader.add(playerFrames[key]);

        // Load assets
        // loader.load(this.onAssetsLoaded.bind(this))
    }

    onAssetsLoaded() {

        // this.app.stage.addChild(playerIdle);
    }

}
