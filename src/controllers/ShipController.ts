import { ShipEntity } from "../entities/ShipEntity";
import { SceneEntity } from "../entities/SceneEntity";
import { AsteroidEntity } from "../entities/AsteroidEntity";
import { Vec2 } from "../utils/Vec2";
import { Line } from "../utils/Line";

export class ShipController {

    public enabled: boolean;

    private scene: Phaser.Scene;
    private ship: ShipEntity;
    private entities: Array<SceneEntity>;
    
    constructor(scene: Phaser.Scene, ship: ShipEntity, entities: Array<SceneEntity>) {
        this.scene = scene;
        this.ship = ship;
        this.entities = entities;
        this.enabled = true;
    }

    public create() {
    }

    public update(time: number, delta: number) {
        if (this.enabled && this.ship.isAlive()) {
            let shipPosition = this.ship.getPosition();
            let shipRotation = this.ship.getRotation() - Math.PI / 2;

            let fovAngle = Math.PI / 6;
            let shipMoveLOS1 = new Line(shipPosition, new Vec2(shipPosition.x + Math.cos(shipRotation) * 256, shipPosition.y + Math.sin(shipRotation) * 256));
            let shipMoveLOS2 = new Line(shipPosition, new Vec2(shipPosition.x + Math.cos(shipRotation + fovAngle) * 256, shipPosition.y + Math.sin(shipRotation + fovAngle) * 256));
            let shipMoveLOS3 = new Line(shipPosition, new Vec2(shipPosition.x + Math.cos(shipRotation - fovAngle) * 256, shipPosition.y + Math.sin(shipRotation - fovAngle) * 256));

            let shipFireLOS = new Line(shipPosition, new Vec2(shipPosition.x + Math.cos(shipRotation) * 512, shipPosition.y + Math.sin(shipRotation) * 512));

            let fired = time % 12 > 1;
            let rD = 0;
            for (let i = 0; i < this.entities.length; ++i) {
                let entity = this.entities[i];
                if (entity instanceof AsteroidEntity) {
                    if (entity.isCollidingLine(shipFireLOS) && !fired) {
                        this.entities.push(this.ship.fire());
                        fired = true;
                    }
                    if (entity.isCollidingLine(shipMoveLOS1)) {
                        let dist = shipPosition.distanceTo(entity.getPosition());
                        if (dist != 0 ) rD += Math.atan(entity.getSize() / dist);
                    }
                    else if (entity.isCollidingLine(shipMoveLOS2)) {
                        let dist = shipPosition.distanceTo(entity.getPosition());
                        if (dist != 0 ) rD += Math.atan(entity.getSize() / dist) - fovAngle;
                    }
                    else if (entity.isCollidingLine(shipMoveLOS3)) {
                        let dist = shipPosition.distanceTo(entity.getPosition());
                        if (dist != 0 ) rD += Math.atan(entity.getSize() / dist) + fovAngle;
                    }
                }
            }

            this.ship.moveTo(new Vec2(shipPosition.x + Math.cos(shipRotation + rD) * 256, shipPosition.y + Math.sin(shipRotation + rD) * 256));
        }
    }
}