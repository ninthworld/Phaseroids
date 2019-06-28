import { EmitterEntity } from "./EmitterEntity";
import { ParticleManager } from "../particles/ParticleManager";
import { Vec2 } from "../utils/Vec2";
import { Color } from "../utils/Color";
import { SceneEntity } from "./SceneEntity";

export class RocketEntity extends EmitterEntity {
    public static LINE_WIDTH = 4;
    public static SIZE = 32;

    constructor(scene: Phaser.Scene, particleManager: ParticleManager, position: Vec2, rotation: number) {
        super(scene, particleManager, position, rotation, RocketEntity.SIZE, false);

        let moveSpeed = 0.75;
        this.velocity.x = Math.sin(this.rotation) * moveSpeed;
        this.velocity.y = Math.cos(this.rotation + Math.PI) * moveSpeed;

        let halfSize = this.size / 2;
        this.vertices.push(new Vec2(0, -halfSize), new Vec2(0, halfSize));
    }

    public create(): SceneEntity {
        return this.createImpl(SceneEntity.FILL_COLOR, SceneEntity.LINE_COLOR, RocketEntity.LINE_WIDTH);
    }
}