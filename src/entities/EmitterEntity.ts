import { SceneEntity } from "./SceneEntity";
import { ParticleManager } from "../particles/ParticleManager";
import { Vec2 } from "../utils/Vec2";

export class EmitterEntity extends SceneEntity {
    protected particleManager: ParticleManager;

    constructor(scene: Phaser.Scene, particleManager: ParticleManager, position: Vec2, rotation: number, size: number, edgeWrap: boolean) {
        super(scene, position, rotation, size, edgeWrap);
        this.particleManager = particleManager;
    }

    protected addParticle(position: Vec2, rotation: number, speed: number, lifeSpan: number) {
        this.particleManager.addParticle(position, rotation, speed, lifeSpan);
    }

    public destroy() {
        super.destroy();
        for (let i = 0; i < this.size / 4; ++i) {
            this.addParticle(this.position.clone(), Math.random() * 2 * Math.PI, 0.05 + Math.random() * 0.05, 500);
        }
    }
}