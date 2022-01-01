/* eslint-disable react-hooks/exhaustive-deps */
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import {Particle} from './Particle'

let text = ''
let mouseDown = false

function App() {
  let particle:Particle[] = []
  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D

  const ref = useRef<HTMLCanvasElement>(null)
  const helloref = useRef<HTMLCanvasElement>(null)
  const [context,setContext] = useState<CanvasRenderingContext2D>()

 // const [text,setText] = useState('A')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animate = () =>{
    if(ctx){
      let lineCount = 0
      //ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0,0,1000,1000)
      ctx.fillStyle = 'white'
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 0.5;
      ctx.font = '30px Arial'
      ctx.fillText(text, 10, 50)
   
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
    
    //context!.setTransform(dpr,0,0,dpr,0,0)
    //context!.scale(dpr,dpr)
    context!.fillStyle = 'black'
    context!.fillRect(0,0,offscreenCanvas.width,offscreenCanvas.height)
    context!.fillStyle = 'white'
    context!.font = "20px";
    context!.fillText('DPC 2022' , 2,10)
 
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

    return {offscreenCanvas,position}
  }


  const keyPressHandler =(e: string) =>{
   // setText(e)
    text += e
    console.log(e)
  }

  useEffect(() => {
      canvas = document.querySelector('canvas')!
      ctx = canvas?.getContext('2d')!
      const windowSizer = () =>{
        const wWidth = window.innerWidth
        const wHeight = window.innerHeight
        const dpr = window.devicePixelRatio || 1
        canvas!.width = wWidth * dpr
        canvas!.height = wHeight * dpr
        canvas!.style.width = wWidth+'px'
        canvas!.style.height = wHeight+'px'
        ctx!.scale(dpr,dpr)
        setContext(ctx!)
        //createOffScreen()
        const {offscreenCanvas,position} = createOffScreen()
        //ctx.drawImage(offscreenCanvas , 0,0)

        console.log('dpr',position)

        if(particle.length === 0){
          for(let i=0;i<position.length;i++){
            particle.push(new Particle(ctx!, position[i].x*3,position[i].y*3+wHeight/4))
          }
         animate()
        }
    }

    windowSizer()

    window.addEventListener('resize', windowSizer)
    window.addEventListener('mousedown',() => {mouseDown = true})
    window.addEventListener('mouseup',() => {mouseDown = false})
 
    return () => {
        window.removeEventListener('resize', windowSizer) 
    }
  
  }, [])

  return (
    <div className='App'>
     <canvas id='canvas' ref={ref}></canvas>
     <h1 id='hello'>hello</h1>
     <input type='text' id='text' value={text} onChange={(e) => keyPressHandler(e.target.value)}/>
    </div>
  )
}

export default App;
