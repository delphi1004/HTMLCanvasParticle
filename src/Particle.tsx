export class Particle{
    ctx: CanvasRenderingContext2D
    posX:number
    posY:number
    dirX:number
    dirY:number
    speedX:number
    speedY:number
    size:number

    constructor(ctx:CanvasRenderingContext2D){
        this.ctx = ctx
        this.posX = Math.random() * ctx.canvas.width
        this.posY = Math.random() * ctx.canvas.height

        this.speedX = Math.random()
        this.speedY = Math.random()

        this.size = this.rand(1,5)
        this.dirX = this.rand(0.5,2)
        this.dirY = this.rand(0.7,2.1)
    }

    rand(min:number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.size, 0, 2 * Math.PI);
        this.ctx.fill();

        this.posX +=this.dirX
        this.posY +=this.dirY

        if(this.posX >= this.ctx.canvas.width/3.0625 || this.posX <=0){
            this.dirX *= -1
        }

        if(this.posY >= this.ctx.canvas.height/3.0625 || this.posY <=0){
            this.dirY *= -1
        }
    }
}