
const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight


const c = canvas.getContext('2d')

// rectangle
c.fillStyle = "rgba(255,0,0, 0.5)"
c.fillRect(0, 0, 100, 100)
c.fillStyle = "rgba(0,255,0, 0.5)"
c.fillRect(40, 20, 100, 100)
c.fillStyle = "rgba(0,0,255, 0.5)"
c.fillRect(80, 40, 100, 100)

// line
c.beginPath()
c.moveTo(0, 0)
c.lineTo(40, 40)
c.lineTo(120, 40)
c.lineTo(160, 80)
c.strokeStyle = "rgb(0,255,255)"
c.stroke()

// arc / circle
c.beginPath()
c.arc(100, 100, 33, 0, Math.PI * 2, true)
c.strokeStyle = "red"
c.stroke()