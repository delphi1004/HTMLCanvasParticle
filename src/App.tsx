/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react'
import './App.css'
import { Particle } from './Particle'

let text = 'AdventureClub'
let mouseDown = false
let particleCreated = false
let mouseX = 0
let mouseY = 0

function App() {
  let particle: Particle[] = []
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  const ref = useRef<HTMLCanvasElement>(null)

  const animate = () => {
    if (ctx) {
      let lineCount = 0
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 0.5

      for (let i = 0; i < particle.length; i++) {
        if (!mouseDown) {
          for (let j = i; j < particle.length; j++) {
            let dx = particle[i].pos.x - particle[j].pos.x
            let dy = particle[i].pos.y - particle[j].pos.y
            let d = Math.sqrt(dx * dx + dy * dy)

            if (d < 50) {
              lineCount++
              ctx.strokeStyle = 'rgba(255,255,255,0.8)'
              ctx.beginPath()
              ctx.moveTo(particle[i].pos.x, particle[i].pos.y)
              ctx.lineTo(particle[j].pos.x, particle[j].pos.y)
              ctx.stroke()
              if (lineCount > 200) {
                break
              }
            }
          }
        }
        particle[i].draw(mouseDown, mouseX, mouseY)
      }
    }
    requestAnimationFrame(animate)
  }

  const createOffScreen = () => {
    document.getElementById('canvas')?.remove()
    const offScreenCanvas = document.createElement('canvas')
    const context = offScreenCanvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const wWidth = window.innerWidth
    const wHeight = 200
    offScreenCanvas!.width = wWidth * dpr
    offScreenCanvas!.height = wHeight * dpr
    offScreenCanvas!.style.width = wWidth + 'px'
    offScreenCanvas!.style.height = wHeight + 'px'
    context!.scale(dpr, dpr)
    context!.fillStyle = 'black'
    context!.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height)
    context!.fillStyle = 'white'
    context!.font = `${wWidth / 160}px Roboto`
    context!.fillText(text, 2, 15)

    const pixel = context!.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height).data

    let index = 0
    let position = []
    for (let i = 0; i < pixel.length; i += 4) {
      if (pixel[i] > 50) {
        const x = index % offScreenCanvas!.width
        const y = index / offScreenCanvas!.width
        context!.fillStyle = 'red'
        context!.fillRect(x, y + 20, 1, 1)
        position.push({ x, y })
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
    canvas!.style.width = wWidth + 'px'
    canvas!.style.height = wHeight + 'px'
    ctx!.scale(dpr, dpr)

    if (!particleCreated) {
      const position = createOffScreen()
      const xOffset = 10

      for (let i = 0; i < position.length; i++) {
        delete particle[i]
      }

      particle = []

      if (particle.length === 0) {
        for (let i = 0; i < position.length; i++) {
          particle.push(new Particle(ctx!, position[i].x + xOffset, position[i].y * (dpr * 5) + wHeight / 4, dpr * 5))
        }
        animate()
      }
      particleCreated = true
    }
  }

  useEffect(() => {
    canvas = ref.current!
    ctx = canvas?.getContext('2d')!
    const windowSizer = () => {
      createParticle()
    }

    windowSizer()
    window.addEventListener('resize', windowSizer)
    window.addEventListener('mousedown', () => {
      mouseDown = !mouseDown
    })
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })

    return () => {
      window.removeEventListener('resize', windowSizer)
      window.removeEventListener('mousedown', () => {})
      window.removeEventListener('mousemove', () => {})
    }
  }, [])

  return (
    <div className='App'>
      <canvas id='particle_canvas' ref={ref}></canvas>
    </div>
  )
}

export default App
