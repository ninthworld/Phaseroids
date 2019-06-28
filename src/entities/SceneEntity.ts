import { Entity } from "./Entity";
import { Vec2 } from "../utils/Vec2";
import { Color } from "../utils/Color";
import { Line } from "../utils/Line";

export abstract class SceneEntity extends Entity {
    public static FILL_COLOR = new Color(255, 255, 255);
    public static LINE_COLOR = new Color(64, 64, 64);
    public static LINE_WIDTH = 2;

    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics | null;
    protected vertices: Array<Vec2>;
    protected edgeWrap: boolean;
    protected size: number;

    constructor(scene: Phaser.Scene, position: Vec2, rotation: number, size: number, edgeWrap: boolean) {
        super(position, rotation);
        this.scene = scene;
        this.graphics = null;
        this.vertices = new Array<Vec2>();
        this.edgeWrap = edgeWrap;
        this.size = size;
    }

    public create(): SceneEntity {
        return this.createImpl(SceneEntity.FILL_COLOR, SceneEntity.LINE_COLOR, SceneEntity.LINE_WIDTH);
    }

    protected createImpl(fillColor: Color, lineColor: Color, lineWidth: number): SceneEntity {
        if (this.graphics == null) this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(lineWidth, lineColor.getValue());
        this.graphics.fillStyle(fillColor.getValue());
        this.graphics.beginPath();
        for (let i = 0; i < this.vertices.length; ++i) {
            let vertex = this.vertices[i];
            if (i == 0) this.graphics.moveTo(vertex.x, vertex.y);
            else        this.graphics.lineTo(vertex.x, vertex.y);
        }
        this.graphics.closePath();
        this.graphics.fillPath();
        this.graphics.strokePath();
        return this;
    }

    public update(delta: number) {
        super.update(delta);

        let width = this.scene.cameras.cameras[0].width;
        let height = this.scene.cameras.cameras[0].height;
        if (this.edgeWrap) {
            if (this.position.x < -this.size)          this.position.x =  this.size + width;
            if (this.position.x >  this.size + width)  this.position.x = -this.size;
            if (this.position.y < -this.size)          this.position.y =  this.size + height;
            if (this.position.y >  this.size + height) this.position.y = -this.size;
        }
        else if (
            this.position.x < -this.size         ||
            this.position.x >  this.size + width ||
            this.position.y < -this.size         ||
            this.position.y >  this.size + height) {                    
            this.destroy();
        }

        if (this.graphics != null) {
            this.graphics.x = this.position.x;
            this.graphics.y = this.position.y;
            this.graphics.rotation = this.rotation;
        }
    }

    public destroy() {
        super.destroy();
        if (this.graphics != null) {
            this.graphics.clear();
            this.graphics.destroy();
            this.graphics = null;
        }
    }

    public isColliding(other: SceneEntity): boolean {
        if (this.vertices.length < 2 || other.vertices.length < 2) return false;        
        for (let i = 0; i < other.vertices.length; ++i) {
            let lineB = new Line(other.vertices[i], other.vertices[(i + 1) % other.vertices.length]);
            lineB.a.x += other.position.x;
            lineB.a.y += other.position.y;
            lineB.b.x += other.position.x;
            lineB.b.y += other.position.y;
            if (this.isCollidingLine(lineB)) return true;
        }
        return false;
    }

    public isCollidingLine(line: Line): boolean {
        if (this.vertices.length < 2) return false;
        for (let i = 0; i < this.vertices.length; ++i) {
            let lineA = new Line(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]);
            lineA.a.x += this.position.x;
            lineA.a.y += this.position.y;
            lineA.b.x += this.position.x;
            lineA.b.y += this.position.y;
            if (lineA.intersects(line)) return true;
        }
        return false;
    }

    public getSize(): number {
        return this.size;
    }
}