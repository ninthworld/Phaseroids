export class Vec2 {
    public x: number;        
    public y: number;

    constructor();
    constructor(x: number, y: number);
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}