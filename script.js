const canvas = document.getElementById("canvas-1")
const ctx = canvas.getContext("2d")


const RESOLUTION = 300
const SCALE = 1


canvas.width = RESOLUTION
canvas.height = RESOLUTION

canvas.style.width = (canvas.width*SCALE)+"px"
canvas.style.height = (canvas.height*SCALE)+"px"

const canvasCenterX = Math.floor(canvas.width/2)
const canvasCenterY = Math.floor(canvas.height/2)

ctx.imageSmoothingEnabled = false
ctx.imageSmoothingQuality = "low"

