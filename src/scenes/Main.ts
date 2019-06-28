import { SceneEntity } from "../entities/SceneEntity";
import { ParticleManager } from "../particles/ParticleManager";
import { ShipEntity } from "../entities/ShipEntity";
import { Vec2 } from "../utils/Vec2";
import { AsteroidEntity } from "../entities/AsteroidEntity";
import { RocketEntity } from "../entities/RocketEntity";
import { ShipController } from "../controllers/ShipController";

export class Main extends Phaser.Scene {

    private entities: Array<SceneEntity>;
    private particleManager: ParticleManager;

    private player: ShipEntity;
    private playerRespawnTimer: number;
    private playerRespawnTimerMax: number;
    private playerCanFire: boolean;

    private shipController: ShipController;
    
    constructor() {
        super("main");
        this.entities = new Array<SceneEntity>();
        this.particleManager = new ParticleManager(this);

        this.playerRespawnTimer = 0;
        this.playerRespawnTimerMax = 2000;
        this.playerCanFire = true;

        this.player = new ShipEntity(this, this.particleManager, new Vec2());
        this.entities.push(this.player);

        for (let i = 0; i < 8; ++i) {
            this.entities.push(new AsteroidEntity(this, this.particleManager, new Vec2(), 2 + i % 4));
        }

        this.shipController = new ShipController(this, this.player, this.entities);
    }

    public create() {     
        this.scale.on("resize", (size: Phaser.Structs.Size) => {
            this.cameras.resize(size.width, size.height);
        }, this);

        let width = this.cameras.cameras[0].width;
        let height = this.cameras.cameras[0].height;

        this.player.setPosition(width / 2, height / 2);

        this.entities.forEach((entity: SceneEntity) => {
            if (entity instanceof AsteroidEntity) {
                entity.setPosition(Math.random() * width, Math.random() * height);
            }
            entity.create();
        });

        this.shipController.create();
    }

    public update(time: number, delta: number) {
        // Ship Controller
        this.shipController.update(time, delta);

        // Respawn
        if (this.playerRespawnTimer > 0) {
            this.playerRespawnTimer -= delta;
        }
        else if (!this.player.isAlive()) {
            let width = this.cameras.cameras[0].width;
            let height = this.cameras.cameras[0].height;
            this.player.respawn(new Vec2(width / 2, height / 2));
            this.entities.push(this.player);
            this.shipController.enabled = true;
        }

        // Input
        if (this.player.isAlive()) {
            if (this.input.activePointer.isDown) {
                this.shipController.enabled = false;
                if (this.playerCanFire) {
                    this.entities.push(this.player.fire());
                    this.playerCanFire = false;
                }
                this.player.moveTo(new Vec2(this.input.activePointer.x, this.input.activePointer.y));
            }
            else {
                this.playerCanFire = true;
            }
        }

        // Update Entities
        this.entities.forEach((entity: SceneEntity) => {
            entity.update(delta);
        });

        // Check Collision
        this.entities.forEach((entityA: SceneEntity) => {
            if (entityA instanceof AsteroidEntity) {
                this.entities.forEach((entityB: SceneEntity) => {
                    if (entityB instanceof ShipEntity && !this.player.isImmune()) {
                        if (entityB.isColliding(entityA)) {
                            this.destroyPlayer();
                        }
                    }
                    else if (entityB instanceof RocketEntity) {
                        if (entityB.isColliding(entityA)) {
                            if (entityA.getAsteroidSize() > 0) {
                                this.entities.push(new AsteroidEntity(this, this.particleManager, entityA.getPosition(), entityA.getAsteroidSize() - 1).create());
                                this.entities.push(new AsteroidEntity(this, this.particleManager, entityA.getPosition(), entityA.getAsteroidSize() - 1).create());
                            }
                            entityA.destroy();
                            entityB.destroy();
                        }
                    }
                });
            }
        });

        // Remove Dead Entities
        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (!this.entities[i].isAlive()) {
                this.entities.splice(i, 1);
            }
        }

        // Update Particles
        this.particleManager.update(delta);
    }

    public destroyPlayer() {
        this.player.destroy();
        this.playerRespawnTimer = this.playerRespawnTimerMax;
    }
}