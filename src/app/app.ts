import * as PIXI from 'pixi.js';

export class GameApp {

    private app: PIXI.Application;

    constructor(parent: HTMLElement, width: number, height: number) {

        this.app = new PIXI.Application({width, height, backgroundColor : 0x000000});
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        // init Pixi loader
        let loader = new PIXI.Loader();

        // loader.add(playerFrames[key]);

        // Load assets
        // loader.load(this.onAssetsLoaded.bind(this))
    }

    private onAssetsLoaded() {

        // this.app.stage.addChild(playerIdle);
    }

}
