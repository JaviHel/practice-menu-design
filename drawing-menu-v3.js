class Text {
    constructor(x=0, y=0, txt="hello", txtColor="black", txtSize=20, txtFont="Arial", txtFontWeight="normal") {
        this.x = x
        this.y = y
        this.txt = txt
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
        this.txtBaseline = "middle"
        this.txtAlign = "center"
    }

    draw(ctx) {
        ctx.fillStyle = this.txtColor
        ctx.font = `${this.txtFontWeight} ${this.txtSize}px ${this.txtFont}`
        ctx.textBaseline = this.txtBaseline // Top, Bottom, Middle, Alphabetic, Hanging. 
        ctx.textAlign = this.txtAlign // left, center, right, start, end.
        ctx.fillText(this.txt, this.x, this.y)
    }
}




class Rect {
    constructor(x, y, w, h, borderRadius=0, lineWidth=1) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.cx = parseInt(x+w*0.5)
        this.cy = parseInt(y+h*0.5)
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
        this.x = x; 
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.cols = cols
        this.rows = rows
        this.colSize = colSize
        this.rowSize = rowSize

        this.spacingX = 0
        this.spacingY = 0
        this.spacingW = 1
        this.spacingH = 1
        
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

        this.fillColor = "darkred"
        this.strokeColor = "crimson"
        this.txtColor = "red"
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

                let rX = col*this.colSize+this.x+this.spacingX
                let rY = row*this.rowSize+this.y+this.spacingY
                let rW = this.colSize*this.spacingW
                let rH = this.rowSize*this.spacingH
                let br = 20
                let lw = 2
                
                let cell = new Rect(rX, rY, rW, rH, br, lw)
                cell.fillColor = this.fillColor
                cell.strokeColor = this.strokeColor
                cell.draw(ctx)

                let txtX = col*this.colSize+this.x;
                let txtY = row*this.rowSize+this.y;
                let txtOffsetX = parseInt((this.w/this.cols) / 2)
                let txtOffsetY = parseInt((this.w/this.rows) / 2)
                let txtStr = this.getAt(col, row);
                let txtSize = parseInt(this.colSize*0.15)
                let txtFont = "monospace"
                let txtFontWeight = "italic "+"bold "
                
                let text = new Text(txtX+txtOffsetX, txtY+txtOffsetY, txtStr, this.txtColor, txtSize, txtFont, txtFontWeight)
                text.draw(ctx)
            }
        }
    }

    update() {
        this.draw(ctx)
    }
}





class State {
    constructor(game=null) {
        this.game = game
        
    }

    update() {
        
    }
} 


class MainMenu extends State {
    constructor(game) {
        super(game)
        
        this.size = 2
        this.container = new Rect(50, 50, 100*this.size, 100*this.size, 20)
        this.container.fillColor = "black"
        
        this.cols = 1
        this.rows = 3
        this.grid = new Grid(this.container.x, this.container.y, this.container.w, this.container.h, this.cols, this.rows)
        this.grid.innerText = ["ONE-PLAYER", "TWO-PLAYERS", "OPTIONS"]
        this.grid.createGrid()
        
        this.selector = new Selector(this.grid.x, this.grid.y, this.grid.colSize, this.grid.rowSize, 20, 6)
    }

    goTo() {
        // Changes index based on the  position of the selector
        let ps = this.selector.getPos()
        let index = parseInt(ps[1] / this.grid.rowSize)

        // Go To Selected Option
        if (ACTION_J) {
            ACTION_J = false
            // Selects the new state based on the index of the selector
            currState = STATES.MainMenu[index] 

            // canvas.style.backgroundColor = randColor()
            
        }
    }

    update() {
        this.container.draw(ctx)
        this.grid.update()
        
        this.selector.update()
        this.selector.rectBound(this.grid.x, this.grid.y, this.container.w, this.container.h)

        this.goTo()
    }
}




class OnePlayer extends State {
    constructor(game) {
        super(game)
        this.txt = new Text(150, 150, "...ONE-PLAYER")
        
    }

    goTo() {
        // Return To Main
        if (ACTION_L) {
            ACTION_J = false
            currState = STATES.main
        }
    }
    
    update() {
        this.txt.draw(ctx)
        this.goTo()
    }
}


class TwoPlayers extends State {
    constructor(game) {
        super(game)
        this.txt = new Text(150, 150, "...TWO-PLAYERS")
    }

    goTo() {
        // Return To Main
        if (ACTION_L) {
            ACTION_J = false
            currState = STATES.main
        }
    }
    
    update() {
        this.txt.draw(ctx)
        this.goTo()
    }
}


class Options extends State {
    constructor(game) {
        super(game)
        this.size = 2
        this.container = new Rect(50, 50, 100*this.size, 100*this.size, 20)
        this.container.fillColor = "black"
        
        this.labelText = new Text(this.container.cx, this.container.y+8, "--OPTIONS--", "red")
        this.labelText.txtSize = 30
        this.labelText.txtFontWeight = "italic "+" bold"
        this.labelText.txtBaseline = "top"
    
        this.cols = 2
        this.rows = 3
        this.grid = new Grid(this.container.x, this.container.y+this.labelText.txtSize, this.container.w, this.container.h-this.labelText.txtSize, this.cols, this.rows)
        this.grid.spacingH = 0.75
        this.grid.spacingY = this.grid.rowSize*0.25
        this.grid.innerText = ["LEVEL", "FREE-ROAM", "SFX"]
        this.grid.createGrid()

        this.selector
    }

    goTo() {
        // Return To Main
        if (ACTION_L) {
            ACTION_J = false
            currState = STATES.main
        }
    }
    
    update() {
        this.goTo()
        this.container.draw(ctx)
        this.grid.update()
        
        this.labelText.draw(ctx)

        
    }
}




// let states = {
//     MainMenu:new MainMenu(),
    
//     // Main Menu
//     OnePlayer: new OnePlayer(),
//     TwoPlayers: new TwoPlayers(),
//     Options:new Options(),
    
//     // Options
// }



// let states = [
//     // new MainMenu(),
    
//     // Main Menu
//     new OnePlayer(),
//     new TwoPlayers(),
//     new Options(),
    
//     // Options
// ]



let STATES = {
    main:new MainMenu(),
    MainMenu:[new OnePlayer(), new TwoPlayers(), new Options()] ,
    Options: ["new Difficulty()", "new TableStyle()", "new PlayerStyle()"],
}





// This method goes in the Game class/type
function setState(newState) {
    return STATES[`${newState}`]
}

let currState = setState("main")






function animate(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    currState.update()
    requestAnimationFrame(animate)
}


animate()
keyboardEnabled()





function print(text="default") {
    let txt = new Text(150, 290, `${text}`, "blue")
    txt.draw(ctx)
}