import { Vec2 } from "./Vec2";

export class Line {
    public a: Vec2;
    public b: Vec2;
    constructor(a: Vec2, b: Vec2) {
        this.a = a.clone();
        this.b = b.clone();
    }

    public intersects(other: Line): boolean {
        let d = ((this.b.x - this.a.x) * (other.b.y - other.a.y)) - ((this.b.y - this.a.y) * (other.b.x - other.a.x));
        let n1 = ((this.a.y - other.a.y) * (other.b.x - other.a.x)) - ((this.a.x - other.a.x) * (other.b.y - other.a.y));
        let n2 = ((this.a.y - other.a.y) * (this.b.x - this.a.x)) - ((this.a.x - other.a.x) * (this.b.y - this.a.y));
        if (d == 0) return n1 == 0 && n2 == 0;
        let r = n1 / d;
        let s = n2 / d;
        return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
    }
}