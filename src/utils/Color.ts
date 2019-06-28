export class Color {
    public r: number;
    public g: number;
    public b: number;
    
    constructor();
    constructor(r: number, g: number, b: number);
    constructor(r: number = 0, g: number = 0, b: number = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public getValue(): number {
        return (
            (this.r & 0xff) << 16 |
            (this.g & 0xff) << 8  |
            (this.b & 0xff)
        );
    }

    public getString(): string {
        return "#" + this.getValue().toString(16);
    }

    public static mix(a: Color, b: Color, x: number): Color {
        let y = (1 - x);
        return new Color(
            a.r * y + b.r * x,
            a.g * y + b.g * x,
            a.b * y + b.b * x
        )
    }
}