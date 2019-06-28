import { EmitterEntity } from "./EmitterEntity";
import { ParticleManager } from "../particles/ParticleManager";
import { Vec2 } from "../utils/Vec2";
import { RocketEntity } from "./RocketEntity";
import { Color } from "../utils/Color";

export class ShipEntity extends EmitterEntity {
    public static SIZE = 32;

    private rotateTo: number;
    private moveSpeed: number;
    private rotateSpeed: number;
    private immunity: boolean;
    private immunityTimer: number;
    private immunityTimerMax: number;

    constructor(scene: Phaser.Scene, particleManager: ParticleManager, position: Vec2) {
        super(scene, particleManager, position, 2 * Math.PI * Math.random(), ShipEntity.SIZE, true);
        this.rotateTo = this.rotation;
        this.moveSpeed = 0.15;
        this.rotateSpeed = 0.0025;
        this.immunity = true;
        this.immunityTimerMax = 2000;
        this.immunityTimer = this.immunityTimerMax;

        this.velocity.x = Math.sin(this.rotation) * this.moveSpeed;
        this.velocity.y = Math.cos(this.rotation + Math.PI) * this.moveSpeed;

        let halfSize = this.size / 2;
        this.vertices.push(
            new Vec2(0, -halfSize),
            new Vec2(Math.sin(Math.PI / 4) *  halfSize, Math.cos(Math.PI / 4) * halfSize),
            new Vec2(0, halfSize / 2),
            new Vec2(Math.sin(Math.PI / 4) * -halfSize, Math.cos(Math.PI / 4) * halfSize)
        );
    }

    public update(delta: number) {
        super.update(delta);
        if (this.alive) {
            if (this.rotation != this.rotateTo) {
                let dAngle = this.rotateTo - this.rotation;
                
                if (dAngle < -Math.PI) dAngle = -dAngle + 2 * (dAngle + Math.PI);
                if (dAngle >  Math.PI) dAngle = -dAngle + 2 * (dAngle - Math.PI);
                
                if (Math.abs(dAngle) > this.rotateSpeed * delta) {
                    this.angularVel = (dAngle > 0 ? 1 : -1) * this.rotateSpeed;
                }
                else {
                    this.rotation = this.rotateTo;
                    this.angularVel = 0;
                }

                this.velocity.x = Math.sin(this.rotation) * this.moveSpeed;
                this.velocity.y = Math.cos(this.rotation + Math.PI) * this.moveSpeed;

                let particlePos = this.position.clone();
                particlePos.x -= Math.sin(this.rotation) * this.size / 2;
                particlePos.y -= Math.cos(this.rotation - Math.PI) * this.size / 2;
                this.addParticle(particlePos, this.rotation - Math.PI, 0.05, 200);
            }

            if (this.immunity) {
                if (this.immunityTimer > 0) {
                    this.immunityTimer -= delta;
                    if (this.graphics != null) this.graphics.alpha = (Math.floor(this.immunityTimer / (this.immunityTimerMax / 16)) % 2 == 0 ? 0 : 1);
                }
                else {
                    this.immunity = false;
                    if (this.graphics != null) this.graphics.alpha = 1;
                }
            }
        }
    }

    public moveTo(to: Vec2) {
        this.rotateTo = Math.atan2(to.y - this.position.y, to.x - this.position.x) + Math.PI / 2;
    }

    public fire(): RocketEntity {
        let rocketPos = new Vec2(
            this.position.x + Math.sin(this.rotation) * this.size,
            this.position.y - Math.cos(this.rotation) * this.size
        );
        return new RocketEntity(this.scene, this.particleManager, rocketPos, this.rotation).create() as RocketEntity;
    }

    public respawn(position: Vec2) {
        this.alive = true;
        this.position = position;
        this.immunity = true;
        this.immunityTimer = this.immunityTimerMax;

        this.velocity.x = Math.sin(this.rotation) * this.moveSpeed;
        this.velocity.y = Math.cos(this.rotation + Math.PI) * this.moveSpeed;

        this.create();
    }

    public isImmune(): boolean {
        return this.immunity;
    }
}