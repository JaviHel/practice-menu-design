class Text {
    constructor(x=0, y=0, txt="hello", txtColor="black", txtSize=20, txtFont="Arial", txtFontWeight="normal") {
        this.x = x
        this.y = y
        this.w = ctx.measureText(txt).width
        this.h = ctx.measureText(txt).height
        this.txt = txt
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
        this.txtBaseline = "middle"
        this.txtAlign = "center"
    }

    setStyle(txtColor, txtSize, txtFont, txtFontWeight, txtBaseline, txtAlign) {
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
        this.txtBaseline = txtBaseline
        this.txtAlign = txtAlign
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
    constructor(x, y, w, h, br=0, lw=1) {
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
            this.y -= this.stepY
        } else if (DOWN) {
            DOWN = false
            this.y += this.stepY
        }

        if (LEFT) {
            LEFT = false
            this.x -= this.stepX
        } else if (RIGHT) {
            RIGHT = false
            this.x += this.stepX
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

        this.cell = new Rect(0,0,0,0)
        
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
                
                this.cell = new Rect(rX, rY, rW, rH, br, lw)
                this.cell.fillColor = this.fillColor
                this.cell.strokeColor = this.strokeColor
                this.cell.draw(ctx)

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
        this.init()
        
    }

    update() {
        
    }
} 


class MainMenu extends State {
    init() {
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
    init() {
        this.txt = new Text(150, 150, "...ONE-PLAYER")
        
    }

    goTo() {
        // Return To Main
        if (ACTION_L) {
            ACTION_L = false
            currState = STATES.main
        }
    }
    
    update() {
        this.txt.draw(ctx)
        this.goTo()
    }
}


class TwoPlayers extends State {
    init() {
        this.txt = new Text(150, 150, "...TWO-PLAYERS")
    }

    goTo() {
        // Return To Main
        if (ACTION_L) {
            ACTION_L = false
            currState = STATES.main
        }
    }
    
    update() {
        this.txt.draw(ctx)
        this.goTo()
    }
}


class Options extends State {
    init() {
        this.size = 2
        this.container = new Rect(50, 50, 100*this.size, 100*this.size, 20)
        this.container.fillColor = "black"
        
        this.labelText = new Text(this.container.cx, this.container.y+8, "--OPTIONS--", "red")
        this.labelText.txtSize = 30
        this.labelText.txtFontWeight = "italic "+" bold"
        this.labelText.txtBaseline = "top"

        var pos = {x:this.container.x+5, y:this.container.y+50,}
        this.leftColOptions = [
            new Text(pos.x, pos.y, "LEVEL", "red"),
            new Text(pos.x, pos.y+30, "FREEROAM", "red"),
            new Text(pos.x, pos.y+60, "SFX", "red"),
            new Text(pos.x, pos.y+90, "THEME", "red"),
            new Text(this.container.cx-16, pos.y+120, "EXIT", "red"),
        ]


        var pos = {x:this.container.x+this.container.w-5, y:this.container.y+50,}
        this.rightColOptions = [
            new Text(pos.x, pos.y, "EASY", "red"),
            new Text(pos.x, pos.y+30, "DISABLED", "red"),
            new Text(pos.x, pos.y+60, "ENABLED", "red"),
            new Text(pos.x, pos.y+90, "neoVectorGreen", "red"),
        ]

        this.indY = 0

        this.levelIndex = 2
        this.levelOptions = ["VERY-EASY","EASY", "NORMAL", "HARD", "VERY-HARD"]

        this.enaDisIndexA = 0
        this.enaDisIndexB = 1
        this.enabledDisabled = ["DISABLED", "ENABLED"]
        
        this.themesIndex = 0
        this.themesOptions = ["neoVectorGreen", "neonDuel", "cyberGold", "magentaStorm", "blueChrome", "neoGreen", "cryoBlue"]


        this.selectorPos = [this.container.x, this.leftColOptions[0].y]
        this.selector = new Selector(this.container.x, this.leftColOptions[0].y, this.container.w, 15, 0, 2)
        this.selector.stepY = this.selector.h*2
    }

    goTo() {
        // Return To Main V1
        // if (ACTION_L) {
        //     ACTION_L = false
        //     currState = STATES.main
        // }

        // Return to main V2
        if (ACTION_J && this.indY == 4) {
            ACTION_J = false
            currState = STATES.main

            this.indY = 0
            this.selector.x = this.selectorPos[0]
            this.selector.y = this.selectorPos[1]
        }
    }

    changeOptions() {
        if (UP && this.indY > 0) {
            this.indY -= 1
        }

        if (DOWN && this.indY < this.leftColOptions.length-1) {
            this.indY += 1
        }


        if (this.indY == 0) {
            
            if (LEFT && this.levelIndex > 0) {
                this.levelIndex -= 1
            }
            if (RIGHT && this.levelIndex < this.levelOptions.length-1) {
                this.levelIndex += 1
            }
            
            this.rightColOptions[0].txt = this.levelOptions[this.levelIndex]
        } 

        
        if (this.indY == 1) {
            if (LEFT && this.enaDisIndexA > 0) {
                this.enaDisIndexA -= 1
            }
            if (RIGHT && this.enaDisIndexA < this.enabledDisabled.length-1) {
                this.enaDisIndexA += 1
            }
            
            this.rightColOptions[1].txt = this.enabledDisabled[this.enaDisIndexA]
        }
        
        
        if (this.indY == 2) {
            if (LEFT && this.enaDisIndexB > 0) {
                this.enaDisIndexB -= 1
            }
            if (RIGHT && this.enaDisIndexB < this.enabledDisabled.length-1) {
                this.enaDisIndexB += 1
            } 
            
            this.rightColOptions[2].txt = this.enabledDisabled[this.enaDisIndexB]
        }
        

        if (this.indY == 3) {
            if (LEFT && this.themesIndex > 0) {
                this.themesIndex -= 1
            }
            if (RIGHT && this.themesIndex < this.themesOptions.length-1) {
                this.themesIndex += 1
            } 
            
            this.rightColOptions[3].txt = this.themesOptions[this.themesIndex]
        }

    }
    
    update() {
        this.goTo()
        this.changeOptions()

        this.container.draw(ctx)
        this.labelText.draw(ctx)
        
        this.leftColOptions.forEach((opt, i)=>{
            opt.setStyle("red","16","monospace","italic "+"bold","top","left")
            opt.draw(ctx)
        })


        this.rightColOptions.forEach((opt, i)=>{
            opt.setStyle("red","16","monospace","italic "+"bold","top","right")
            opt.draw(ctx)
        })

        
        this.selector.rectBound(this.container.x, this.leftColOptions[0].y, this.container.w, this.leftColOptions[1].y+5)
        this.selector.update()

    }
}



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