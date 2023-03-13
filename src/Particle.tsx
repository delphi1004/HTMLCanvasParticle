
interface Vector2D {
    x:number
    y:number
} 

export enum TEST {
    value1,
    value2,
}

//const color = ['hsl(214,53%,35%)','hsl(208,40%,55%)','hsl(11,59%,95%)','hsl(11,34%,65%)']
//const color = ['hsl(207,94.8%,45.1%)','hsl(191,39.9%,76.9%)','hsl(203,50.2%,100%)','hsl(196,86.8%,84.7%)']
const color = ['hsl(208,20%,65%)','hsl(39,19%,95%)','hsl(33,64%,95%)','hsl(22,80%,85%)','hsl(22,69%,55%)']

export class Particle{
    ctx: CanvasRenderingContext2D
    pos:Vector2D
    orgPos:Vector2D
    dirX:number
    dirY:number
    speedX:number
    speedY:number
    size:number
    curSize:number
    velocity:Vector2D
    acceleration:Vector2D
    hue:number
    dirSelected:boolean
    colorIndex:number
    dpr:number

    constructor(ctx:CanvasRenderingContext2D,x:number,y:number,dpr:number){
        this.ctx = ctx
        this.dpr = dpr
        this.pos = {x:Math.random() * ctx.canvas.width,y:Math.random() * ctx.canvas.height}
        this.orgPos = {x:x*dpr,y:y}
   
        this.velocity = {x:Math.random(),y:Math.random()}
        this.acceleration = {x:0,y:0}

        this.speedX = Math.random()
        this.speedY = Math.random()
        this.hue = (Math.random()*(40-200))+150

        this.colorIndex = this.rand(0,color.length)

        const ratio =  ctx.canvas.width/980
        this.size = this.rand(ratio,ratio+0.7)
        this.curSize = 0.1
        this.dirX = this.rand(-2,2)
        this.dirY = this.rand(-2,2)
        this.dirSelected = true
    }

    rand(min:number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    attract(){
      let force:Vector2D = {x:this.orgPos.x - this.pos.x,y:this.orgPos.y - this.pos.y}
      let d = Math.sqrt(Math.pow(force.x,2) + Math.pow(force.y,2))

      force.x /=d
      force.y /=d

      let steer:Vector2D = {x:force.x - this.velocity.x , y:force.y - this.velocity.y}
      let distanceSteer = Math.sqrt(Math.pow(steer.x,2) + Math.pow(steer.y,2))
      steer.x = Math.min(Math.max(distanceSteer, 0.01), 0.1)
      steer.y = Math.min(Math.max(distanceSteer, 0.01), 0.1)

      this.acceleration.x += steer.x
      this.acceleration.y += steer.y

      this.velocity.x += this.acceleration.x
      this.velocity.y += this.acceleration.y

      this.acceleration.x *= 0
      this.acceleration.y *= 0
    }

    draw(mouseDown:boolean,mouseX:number,mouseY:number){
        this.ctx.beginPath();
        this.ctx.fillStyle = color[this.colorIndex]
        this.ctx.arc(this.pos.x, this.pos.y, Math.abs(this.size), 0, 2 * Math.PI);
        this.ctx.fill();

        if(mouseDown){
           this.dirX = (this.orgPos.x - this.pos.x) * 0.06
           this.dirY = (this.orgPos.y - this.pos.y) * 0.05
           this.dirSelected = true
           let dx = this.orgPos.x - mouseX
           let dy = this.orgPos.y - mouseY
           let d = Math.sqrt(dx*dx+dy*dy)

           if(d < 100){
            this.dirX = Math.random() * (Math.random() > 0.5 ? 25:-25)
            this.dirY = Math.random() * (Math.random() > 0.5 ? 25:-25)
           }
        }else if( this.dirSelected){
            this.dirX = Math.random() * (Math.random() > 0.5 ? 1:-1)
            this.dirY = Math.random() * (Math.random() > 0.5 ? 1:-1)
            this.dirSelected = false
        }

        this.pos.x += this.dirX
        this.pos.y += this.dirY

        if(this.dirX <=0){
            this.pos.x += Math.random()*0.2
        }

        if(this.dirY <=0){
            this.pos.y += Math.random()*0.2
        }

        if(this.pos.x >= window.innerWidth || this.pos.x <=0){
            this.dirX *= -1
        }

        if(this.pos.y >= window.innerHeight || this.pos.y <=0){
            this.dirY *= -1
        }
    }
}