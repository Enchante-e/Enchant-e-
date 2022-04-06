import * as PIXI from 'pixi.js';

// class GameApp {
//     constructor(parent = document.body, width = window.innerWidth, height = window.innerHeight) {
//         this.parent = parent
//         this.width = width
//         this.height = height

//         this.app = new PIXI.Application({
//             width,
//             height,
//             backgroundColor: 0xFF0000
//         });
//         parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

//         // init Pixi loader
//         let loader = new PIXI.Loader();
//         // loader.add(playerFrames[key]);

//         console.log('test constructor')

//         // Load assets 
//         // loader.load(this.onAssetsLoaded.bind(this))
//     }

//     onAssetsLoaded() {

//         // this.app.stage.addChild(playerIdle);


//     }

// }

// const GAMEAPP = new GameApp;

// export default GAMEAPP;