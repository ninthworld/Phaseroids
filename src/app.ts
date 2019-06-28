/**
 * @author      NinthWorld <theninthworldix@gmail.com>
 * @date        June 28, 2019
 * @description Asteroids clone with Phaser 3 and TypeScript
 * @license     MIT
 */

import "phaser";
import { Main } from "./scenes/Main";
    
const config = {
    type: Phaser.AUTO,
    backgroundColor: "#ffffff",
    scale: {
        mode: Phaser.Scale.NONE,
        parent: "phaseroids",
        width: window.innerWidth,
        height: window.innerHeight,
    },
    scene: Main
};

export class Game extends Phaser.Game {
    constructor() {
        super(config);
        window.addEventListener("resize", () => {
            this.scale.resize(window.innerWidth, window.innerHeight);
        }, false);
    }
}

window.addEventListener("load", () => {
    new Game();
})
