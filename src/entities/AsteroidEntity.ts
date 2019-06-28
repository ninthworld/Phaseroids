import { EmitterEntity } from "./EmitterEntity";
import { Vec2 } from "../utils/Vec2";
import { ParticleManager } from "../particles/ParticleManager";

export class AsteroidEntity extends EmitterEntity {
    private asteroidSize: number;

    constructor(scene: Phaser.Scene, particleManager: ParticleManager, position: Vec2, asteroidSize: number) {
        super(scene, particleManager, position, 2 * Math.PI * Math.random(), 32 + asteroidSize * 32, true);
        this.asteroidSize = asteroidSize;
        this.angularVel = (Math.random() * 2 - 1) * 0.001;

        let moveSpeed = (1 - this.asteroidSize / 8) * 0.075;
        this.velocity.x = Math.sin(this.rotation) * moveSpeed;
        this.velocity.y = Math.cos(this.rotation + Math.PI) * moveSpeed;

        let vertexCount = 4 + this.asteroidSize * 2;
        for (let i = 0; i < vertexCount; ++i) {
            let dR = ((Math.random() - 0.5) * 0.4 + 0.5) * this.size;
            let rad = 2 * Math.PI * (i / vertexCount);
            this.vertices.push(new Vec2(Math.sin(rad) * dR, Math.cos(rad) * dR));
        }
    }

    public getAsteroidSize(): number {
        return this.asteroidSize;
    }
}