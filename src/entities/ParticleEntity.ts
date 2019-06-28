import { SceneEntity } from "./SceneEntity";
import { Vec2 } from "../utils/Vec2";
import { Color } from "../utils/Color";

export class ParticleEntity extends SceneEntity {
    public static SIZE = 16;

    private moveSpeed: number;
    private lifeTimer: number;
    private lifeTimerMax: number;

    constructor(scene: Phaser.Scene, position: Vec2, rotation: number, speed: number, lifeSpan: number) {
        super(scene, position, rotation, ParticleEntity.SIZE, false);
        this.moveSpeed = speed;
        this.lifeTimerMax = this.lifeTimer = lifeSpan;

        this.velocity.x = Math.sin(this.rotation) * this.moveSpeed;
        this.velocity.y = Math.cos(this.rotation) * this.moveSpeed;

        let halfSize = this.size / 2;
        this.vertices.push(
            new Vec2(0, -halfSize),
            new Vec2(Math.sin(Math.PI / 4) *  halfSize, Math.cos(Math.PI / 4) * halfSize),
            new Vec2(Math.sin(Math.PI / 4) * -halfSize, Math.cos(Math.PI / 4) * halfSize)
        );
    }

    public update(delta: number) {
        super.update(delta);
        if (this.alive) {
            if (this.lifeTimer > 0) {
                if (this.graphics != null) {
                    this.graphics.alpha = this.lifeTimer / this.lifeTimerMax;
                }
                this.lifeTimer -= delta;
            }
            else {
                this.destroy();
            }
        }
    }
}