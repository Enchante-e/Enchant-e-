import * as PIXI from 'pixi.js';

console.log('test on load');

let cameraVector = {
    a: 0,
    l: 0
};

let move = false

// sound = PIXI.sound.Sound.from('key.mp3'),
// backgroundSound = PIXI.sound.Sound.from('../assets/sound/background.mp3');

    var center = {},
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xFFFAF3,
        resolution: window.devicePixelRatio || 1,
        resizeTo: window
    }),
    play = false,
    container = new PIXI.Container(1080),
    texture = PIXI.Texture.from('https://cdn.pixabay.com/photo/2021/11/25/18/46/leaf-6824367_960_720.png'),
    img = PIXI.Texture.from('https://cdn.pixabay.com/photo/2021/09/06/10/07/leaves-6601325_960_720.png'),
    rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
// AdvancedBloom = new PIXI.filters.AdvancedBloomFilter({
//     bloomScale: 6,
//     brightness: 2
/// });


const cursor  = new PIXI.Graphics();
cursor.beginFill(0x1A1D5C);
cursor.drawCircle(app.view.width / 2, app.view.height / 2, 8);
cursor.endFill();


document.body.appendChild(app.view);

document.addEventListener("mousemove", function (e) {

    center.x = app.screen.width / 2;
    center.y = app.screen.height / 2;
    if(move == true) {
        cameraVector.a = center.x - e.x;
        cameraVector.l = center.y - e.y;
        cameraVector.a = Math.atan2(center.y - e.y, center.x - e.x);
        cameraVector.l = Math.sqrt(a * a + b * b);
    }

    // console.log(cameraVector.a);
})

app.stage.addChild(container);

// container.filters = [AdvancedBloom];

for (let i = 0; i < 10000; i++) {

    let luck = (Math.random() * 10) == 5;
    const star = (luck) ? new PIXI.Sprite(img) : new PIXI.Sprite(texture);
    star.id = i;
    let scale = (Math.random() / 2) ;
    star.anchor.set(2);
    star.interactive = true;
    star.buttonMode = luck;
    // star.on("pointerdown", function () {
    //     // sound.filters = [new PIXI.sound.filters.ReverbFilter()];
    //     // sound.play();
    //     this.texture = texture;
    //     this.scale.set(Math.random() / 4);
    //     this.interactive = false;
    //     this.buttonMode = false;
    // })
    star.scale.set((luck) ? 0.3 + Math.random() * 0.7 : scale);
    star.tint = 0xfa0000 * Math.random();
    star.x = rnd(-4 * window.innerWidth, 4 * window.innerWidth);
    star.y = rnd(-4 * window.innerHeight, 4 * window.innerHeight);
    star.initialPos = {
        x: star.x,
        y: star.y
    }
    star.goBack = false;
    star.l = Math.random() * 4;
    star.zIndex = scale;

    // 
    star.on("click", function () {
        console.log('this is a click');
        this.scale.set(Math.random() / 10);
        this.interactive = true;
    })

    star.update = function () {
        if (this.goBack) {
            this.x = lerp(this.x, this.initialPos.x, 0.5);
            this.y = lerp(this.y, this.initialPos.y, 0.5);
            this.goBack = (this.x == this.initialPos.x) ? false : true;
        } else {
            this.x += Math.cos(cameraVector.a) * cameraVector.l * (scale / 10);
            this.y += Math.sin(cameraVector.a) * cameraVector.l * (scale / 10);
        }
    }

    container.addChild(star);
}


container.x = app.screen.width / 8;
container.y = app.screen.height / 8;
container.pivot.x = container.width / 8;
container.pivot.y = container.height / 8;


app.ticker.add((delta) => {
    for (const star of container.children) {
        star.update();
    }

   
});

export const createCursor = () => {
    app.stage.addChild(cursor);
    return cursor;
}

export const updateCursor = (cursor, coordX, coordY) => {
    cursor.transform.position.x = coordX - window.innerWidth / 2;
    cursor.transform.position.y = coordY - window.innerHeight / 2;
}

export const deleteCursor = (cursor) => {
    app.stage.removeChild(cursor)
}

export const activeMovement = () => {
    return move = true
}
