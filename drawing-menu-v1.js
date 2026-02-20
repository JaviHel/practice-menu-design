class Rect {
    constructor(x, y, w, h, borderRadius=0, lineWidth=1) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.borderRadius = borderRadius
        this.lineWidth = lineWidth
        
        this.strokeColor = ""
        this.strokeColor = ""
     }

    draw(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.strokeColor
        ctx.fillStyle = this.fillColor
        
        ctx.beginPath()
        ctx.roundRect(this.x, this.y, this.w, this.h, this.borderRadius)
        
        this.fillColor != ""? ctx.fill(): false;
        this.strokeColor != ""? ctx.stroke(): false;
    }
}



class Selector extends Rect {
    constructor(x, y, w, h, br, lw) {
        super(x, y, w, h, br, lw)
        this.stepX = w
        this.stepY = h
        this.lineWidth = 4
        this.fillColor = ""
        this.strokeColor = "rgba(255, 0, 0, 1)"

        this.opacityCycle = 0
        this.opacityCycleFreq = 32
        
    }

    pulseFX() {
        let opacity = sineFloat(1, this.opacityCycle, this.opacityCycleFreq)
        this.strokeColor = `rgba(0, 0, 255, ${opacity})`
        
        this.opacityCycle += 1
        this.opacityCycle >= 180? this.opacityCycle=0: false;
    }
    
    getPos() {
        return [this.x, this.y]
    }
    
    rectBound(x, y, w, h) {
        if (this.x < x) {
            this.x = x
        } else if (this.x > x+w-this.w) {
            this.x = x+w-this.w
        }

        if (this.y < y) {
            this.y = y
        } else if (this.y > y+h-this.h) {
            this.y = y+h-this.h
        }
        
    }
    
    keyControl() {
        if (UP) {
            UP = false
            this.y -= 1 + this.stepY
        } else if (DOWN) {
            DOWN = false
            this.y += 1 + this.stepY
        }

        if (LEFT) {
            LEFT = false
            this.x -= 1 + this.stepX
        } else if (RIGHT) {
            RIGHT = false
            this.x += 1 + this.stepX
        }

    }

    update() {
        this.draw(ctx)
        this.keyControl()
        this.pulseFX()
    }
}


class Text {
    constructor(x=0, y=0, txt="hello", txtColor="white", txtSize=20, txtFont="Arial", txtFontWeight="normal") {
        this.x = x
        this.y = y
        this.txt = txt
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
    }

    draw(ctx) {
        ctx.fillStyle = this.txtColor
        ctx.font = `${this.txtFontWeight} ${this.txtSize}px ${this.txtFont}`
        ctx.textBaseline = "top" // Top, Bottom, Middle, Alphabetic, Hanging. 
        ctx.textAlign = "center" // left, center, right, start, end.
        ctx.fillText(this.txt, this.x, this.y)
    }

    update() {
        this.draw(ctx)
    }
}





class Grid {
    static innerText = ["ONE-PLAYER", "TWO-PLAYERS", "OPTIONS"]
    
    constructor(x=0, y=0, w=0, h=0, cols=0, rows=0, colSize=0, rowSize=0) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.cols = cols
        this.rows = rows
        this.colSize = colSize
        this.rowSize = rowSize
        this.grid = []

        
        this.mainValue = [randColor(), randColor()]
        
        if (cols != 0 && rows != 0) {
            this.colSize = Math.floor(w / cols)
            this.rowSize = Math.floor(h / rows)            
        }
        
        if (colSize != 0 && rowSize != 0) {
            this.cols = Math.floor(w / colSize)
            this.rows = Math.floor(h / rowSize)            
        }

        this.createGrid()
    }

    createGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = []
            for (let col = 0; col < this.cols; col++) {
                    this.grid[row][col] = Grid.innerText[row%Grid.innerText.length]
            }
        }
    }

    setAt(value, col, row) {
        // Adds "value" to the col-row position 
        this.grid[row%this.grid.length][col%this.grid[0].length] = value
    }

    getGrid() {
        return this.grid
    }
    
    getAt(col, row) {
        // Gets the value at col-row position
        return this.grid[row][col]
    }
}



// State Handler
class Handler {
    constructor() {
        this.size = 2
        this.container = new Rect(50, 50, 100*this.size, 100*this.size, 20)
        this.container.fillColor = "black"
        
        this.cols = 1
        this.rows = 3
        this.grid = new Grid(this.container.x, this.container.y,
                             this.container.w, this.container.h,
                             this.cols, this.rows)
        
        this.selector = new Selector(this.grid.x, this.grid.y,
                                     this.grid.colSize, this.grid.rowSize,
                                     20, 4)
    }


    changeRowColor() {
        if (ACTION_J) {
            ACTION_J = false
            // The offset fixes an error where when trying to paint the middle rect,
            // returning from bottom to the top, skips it and paints the one at the top
            // or simply just skips a rect even though it seems to be at the correct position
            let offset = 0
            let x = Math.floor((this.selector.getPos()[0] / this.grid.colSize)+offset)
            let y = Math.floor((this.selector.getPos()[1] / this.grid.rowSize)+offset)
            
            this.grid.setAt([randColor()], x, y)
            // console.log(x, y)
        }
    }
    
    drawGrid(ctx) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                
                let rect = new Rect(col*this.grid.colSize+this.grid.x,
                                    row*this.grid.rowSize+this.grid.y,
                                    this.grid.colSize, this.grid.rowSize,
                                    20, 2)
                
                // rect.fillColor = this.grid.getAt(col, row)[0]
                // rect.strokeColor = this.grid.getAt(col, row)[1]
                rect.fillColor = "darkred"
                rect.strokeColor = "crimson"
                rect.draw(ctx)

                let txtOffsetX = parseInt(this.grid.colSize / 2)
                let txtOffsetY = parseInt(this.grid.rowSize / 4)
                let txtSize = parseInt(this.grid.rowSize*0.48)
                
                let text = new Text(col*this.grid.colSize+this.grid.x+txtOffsetX,
                                    row*this.grid.rowSize+this.grid.y+txtOffsetY,
                                    this.grid.getAt(col, row), "red",
                                    txtSize, "monospace", "italic"+" bold")
                
                text.draw(ctx)
            }
        }
    }
    
    update() {
        this.container.draw(ctx)
        this.drawGrid(ctx)
        
        this.selector.update()
        this.selector.rectBound(this.grid.x, this.grid.y, this.container.w, this.container.h)
        
        this.changeRowColor()
    }
}


let h1 = new Handler()


function animate(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    h1.update()
    requestAnimationFrame(animate)
}


animate()
keyboardEnabled()