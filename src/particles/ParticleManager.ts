import { Vec2 } from "../utils/Vec2";
import { ParticleEntity } from "../entities/ParticleEntity";

export class ParticleManager {
    private scene: Phaser.Scene;
    private particles: Array<ParticleEntity>;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.particles = new Array<ParticleEntity>();
    }

    public addParticle(position: Vec2, rotation: number, speed: number, lifeSpan: number) {
        this.particles.push(new ParticleEntity(this.scene, position, rotation, speed, lifeSpan).create() as ParticleEntity);
    }

    public update(delta: number) {            
        for (let i = this.particles.length - 1; i >= 0; --i) {
            if (!this.particles[i].isAlive()) {
                this.particles.splice(i, 1);
            }
        }

        this.particles.forEach((particle: ParticleEntity) => {
            particle.update(delta);
        });
    }
}