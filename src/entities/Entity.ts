import { Vec2 } from "../utils/Vec2";

export abstract class Entity {
    protected position: Vec2;
    protected rotation: number;
    protected velocity: Vec2;
    protected angularVel: number;
    protected alive: boolean;
    
    constructor(position: Vec2, rotation: number) {
        this.position = position;
        this.rotation = rotation;
        this.velocity = new Vec2();
        this.angularVel = 0;
        this.alive = true;
    }

    public update(delta: number) {
        if (this.alive) {
            this.position.x += this.velocity.x * delta;
            this.position.y += this.velocity.y * delta;
            this.rotation   += this.angularVel * delta;
        }
    }

    public getPosition(): Vec2 {
        return this.position.clone();
    }

    public setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    public getRotation(): number {
        return this.rotation;
    }

    public setRotation(rotation: number) {
        this.rotation = rotation;
    }

    public isAlive(): boolean {
        return this.alive;
    }

    public destroy() {
        this.alive = false;
    }
}