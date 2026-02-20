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
        ctx.textBaseline = "middle" // Top, Bottom, Middle, Alphabetic, Hanging. 
        ctx.textAlign = "center" // left, center, right, start, end.
        ctx.fillText(this.txt, this.x, this.y)
    }
}


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
        this.fillColor = "transparent"
        this.strokeColor = "rgba(0, 0, 255, 1)"

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
        this.pulseFX()
        this.keyControl()
    }
}



class Grid {
    constructor(x=0, y=0, w=0, h=0, cols=0, rows=0, colSize=0, rowSize=0) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.cols = cols
        this.rows = rows
        this.colSize = colSize
        this.rowSize = rowSize
        this.innerText = ["ONE-PLAYER", "TWO-PLAYERS", "OPTIONS"]
        this.grid = []
        
        if (cols != 0 && rows != 0) {
            this.colSize = Math.floor(w / cols)
            this.rowSize = Math.floor(h / rows)            
        }
        
        if (colSize != 0 && rowSize != 0) {
            this.cols = Math.floor(w / colSize)
            this.rows = Math.floor(h / rowSize)            
        }
    }

    createGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = []
            for (let col = 0; col < this.cols; col++) {
                    this.grid[row][col] = this.innerText[row%this.innerText.length]
            }
        }
    }

    setAt(value, col, row) {
        this.grid[row%this.grid.length][col%this.grid[0].length] = value
    }

    getGrid() {
        return this.grid
    }
    
    getAt(col, row) {
        return this.grid[row][col]
    }

    draw(ctx) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                
                let rX = col*this.colSize+this.x
                let rY = row*this.rowSize+this.y;
                let rW = this.colSize
                let rH = this.rowSize
                let br = 20
                let lw = 2
                
                let cell = new Rect(rX, rY, rW, rH, br, lw)
                cell.fillColor = "darkred"
                cell.strokeColor = "crimson"
                cell.draw(ctx)

                let txtX = rX;
                let txtY = rY;
                let txtOffsetX = parseInt((this.w/this.cols) / 2)
                let txtOffsetY = parseInt((this.w/this.rows) / 2)
                let txtStr = this.getAt(col, row);
                let txtColor = "red";
                let txtSize = parseInt(this.colSize*0.15)
                let txtFont = "monospace"
                let txtFontWeight = "italic "+"bold "
                
                let text = new Text(txtX+txtOffsetX, txtY+txtOffsetY, txtStr, txtColor, txtSize, txtFont, txtFontWeight)
                text.draw(ctx)
            }
        }
    }

    update() {
        this.draw(ctx)
    }
}




class Handler {
    constructor() {
        this.size = 2
        this.container = new Rect(50, 50, 100*this.size, 100*this.size, 20)
        this.container.fillColor = "black"
        
        this.cols = 1
        this.rows = 3
        this.grid = new Grid(this.container.x, this.container.y, this.container.w, this.container.h, this.cols, this.rows)
        this.grid.createGrid()
        
        this.selector = new Selector(this.grid.x, this.grid.y, this.grid.colSize, this.grid.rowSize, 20, 6)
    }

    update() {
        this.container.draw(ctx)
        this.grid.update()
        
        this.selector.update()
        this.selector.rectBound(this.grid.x, this.grid.y, this.container.w, this.container.h)
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