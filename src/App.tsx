/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import './App.css';
import {Particle} from './Particle'

function App() {
  let particle:Particle[] = []
  let canvas:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D

  const ref = useRef<HTMLCanvasElement>(null)
  const [context,setContext] = useState<CanvasRenderingContext2D>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animate = () =>{
    if(ctx){
      ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
      ctx.fillStyle = 'red'
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 0.1;
      for(let i=0;i<particle.length;i++)
      particle[i].draw()
    }
    requestAnimationFrame(animate)
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

        if(particle.length === 0){
          for(let i=0;i<1000;i++){
            particle.push(new Particle(ctx!))
          }
          animate()
        }
    }

    window.addEventListener('resize', windowSizer)

    return () => {
        window.removeEventListener('resize', windowSizer) 
    }
  
  }, [])

  return (
    <div className="App">
     <canvas id='canvas' ref={ref}></canvas>
    </div>
  );
}

export default App;
