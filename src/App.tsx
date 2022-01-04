/* eslint-disable react-hooks/exhaustive-deps */
import {  useEffect, useRef } from 'react';
import './App.css';
import {Particle} from './Particle'

let text = 'Accenture 2022'
let mouseDown = false
let particleCreated = false

function App() {
  let particle:Particle[] = []
  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D
  const ref = useRef<HTMLCanvasElement>(null)

  const animate = () =>{
    if(ctx){
      let lineCount = 0
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.5;

      for(let i=0;i<particle.length;i++){
        particle[i].draw(mouseDown)
        if(!mouseDown){
          for(let j=i;j<particle.length;j++){
            let dx = particle[i].pos.x - particle[j].pos.x
            let dy = particle[i].pos.y - particle[j].pos.y
            let d = Math.sqrt(dx*dx+dy*dy)

            if(d < 50){
              lineCount++
              ctx.strokeStyle='rgba(255,255,255,0.2)'
              ctx.beginPath();
              ctx.moveTo(particle[i].pos.x, particle[i].pos.y);
              ctx.lineTo( particle[j].pos.x,  particle[j].pos.y);
              ctx.stroke();
              if(lineCount > 200){
                break
              }
            }
          }
        }
      }
    }
    requestAnimationFrame(animate)
  }

  const createOffScreen = () =>{
    document.getElementById('canvas')?.remove()
    const offscreenCanvas = document.createElement('canvas')
    const context = offscreenCanvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const wWidth = window.innerWidth
    const wHeight = 55
    offscreenCanvas!.width = wWidth * dpr
    offscreenCanvas!.height = wHeight * dpr
    offscreenCanvas!.style.width = wWidth+'px'
    offscreenCanvas!.style.height = wHeight+'px'
    context!.scale(dpr,dpr)
    context!.fillStyle = 'black'
    context!.fillRect(0,0,offscreenCanvas.width,offscreenCanvas.height)
    context!.fillStyle = 'white'
    context!.font = "20px";
    context!.fillText(text , 2,10)
 
    const pixel = context!.getImageData(0,0, offscreenCanvas.width, offscreenCanvas.height).data
  
    let index = 0
    let position = []
    for(let i=0;i<pixel.length;i+=4){
      if(pixel[i] > 50){
        const x = index % offscreenCanvas!.width
        const y = index / offscreenCanvas!.width
        context!.fillStyle = 'red'
        context!.fillRect(x,y+20,1,1)
        position.push({x,y})
      }
      index++
    }
    return position
  }

 const createParticle = () => {
    const wWidth = window.innerWidth
    const wHeight = window.innerHeight
    const dpr = window.devicePixelRatio || 1
    canvas!.width = wWidth * dpr
    canvas!.height = wHeight * dpr
    canvas!.style.width = wWidth+'px'
    canvas!.style.height = wHeight+'px'
    ctx!.scale(dpr,dpr)

    if(!particleCreated) {
      const position = createOffScreen()
      const xOffset = 10

      for(let i=0;i<position.length;i++){
        delete particle[i]
      }

      particle = []
      if(particle.length === 0){
        for(let i=0;i<position.length;i++){
          particle.push(new Particle(ctx!, (position[i].x+xOffset)*3,position[i].y*3+wHeight/4))
        }
        animate() 
      }
      particleCreated = true
    }
  }

  useEffect(() => {
      canvas = ref.current!
      ctx = canvas?.getContext('2d')!
      const windowSizer = () =>{
        createParticle()
    }

    windowSizer()
    window.addEventListener('resize', windowSizer)
    window.addEventListener('mousedown',() => {mouseDown = !mouseDown})

    return () => {
      window.removeEventListener('resize', windowSizer) 
      window.removeEventListener('mousedown', () => {}) 
    }

  }, [])

return (
  <div className='App'>
    <canvas id='particle_canvas' ref={ref}></canvas>
  </div>
  )
}

export default App;
