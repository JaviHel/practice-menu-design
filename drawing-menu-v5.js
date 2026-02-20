class Text {
    constructor(x=0, y=0, txt="hello", txtColor="black", txtSize=20, txtFont="Arial", txtFontWeight="normal") {
        this.x = x
        this.y = y
        this.w = ctx.measureText(txt).width
        this.h = txtSize
        this.txt = txt
        this.txtColor = txtColor
        this.txtSize = txtSize
        this.txtFont = txtFont
        this.txtFontWeight = txtFontWeight
        this.txtBaseline = "middle"
        this.txtAlign = "center"
    }

    setStyle(txtColor, txtSize, txtFont, txtFontWeight, txtBaseline, txtAlign) {
        this.h = txtSize
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
        
        this.fillColor = ""
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

        this.index = {x:0, y:0,}
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
    static column() {
        
    }

    static row() {
        
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
        this.container = new Rect(50, 50, 100*this.size, 100*this.size, 20, 2)
        this.container.fillColor = "black"
        this.container.strokeColor = "red"

        this.columnOptions = [
            new Text(0,0, "ONE-PLAYER", "red"),
            new Text(0,0, "TWO-PLAYERS", "red"),
            new Text(0,0, "OPTIONS", "red"),
        ]

        let offsetY = 60
        createColumn(this.columnOptions, this.container.cx, parseInt(this.container.y+(offsetY/this.columnOptions.length)), parseInt((this.container.h-offsetY)/this.columnOptions.length))


        this.selector = new Selector(this.container.x, this.container.y, this.container.w, this.container.h/this.columnOptions.length, 20, 4)
        
    }

    goTo() {
        if (ACTION_J) {
            ACTION_J = false
            currState = setState("MainMenu")[this.selector.index.y]
        }

        if (ACTION_J) {
            ACTION_J = false
            currState = setState("MainMenu")[this.selector.index.y]
        }

        if (ACTION_J) {
            ACTION_J = false
            currState = setState("MainMenu")[this.selector.index.y]
        }
    }  

    changeOptions() {
        if (UP && this.selector.index.y > 0) {
            this.selector.index.y -= 1
        }

        if (DOWN && this.selector.index.y < this.columnOptions.length-1) {
            this.selector.index.y += 1
        }
    }
                
    update() {
        this.goTo()
        this.changeOptions()
        this.container.draw(ctx)

        this.columnOptions.forEach(opt=>{
            opt.setStyle("red","32","monospace","italic "+" bold", "top", "center")
            opt.draw(ctx)
        })

        this.selector.rectBound(this.container.x, this.container.y, this.container.w, this.container.h)
        this.selector.update()
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
            currState = STATES.Main
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
            currState = STATES.Main
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
            new Text(this.container.cx-(ctx.measureText("EXIT").width-5), pos.y+120, "EXIT", "red"),
        ]


        var pos = {x:this.container.x+this.container.w-5, y:this.container.y+50,}
        this.rightColOptions = [
            new Text(pos.x, pos.y, "NORMAL", "red"),
            new Text(pos.x, pos.y+30, "DISABLED", "red"),
            new Text(pos.x, pos.y+60, "ENABLED", "red"),
            new Text(pos.x, pos.y+90, "neoVectorGreen", "red"),
        ]

        this.indY = 0

        // RIGHT COLUMN OPTIONS
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
        // Return To Main
        if (ACTION_J && this.indY == 4) {
            ACTION_J = false
            currState = STATES.Main

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
    Main:new MainMenu(),
    MainMenu:[new OnePlayer(), new TwoPlayers(), new Options()] ,
}





// This method goes in the Game class/type
function setState(newState) {
    return STATES[`${newState}`]
}

let currState = setState("Main")






function animate(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    currState.update()
    requestAnimationFrame(animate)
}


animate()
keyboardEnabled()





function createColumn(array, x=0, y=0, spacing=0) {
    // Sets the position of any objext with (x,y,w,h) inside the array as a column
    for (let i = 0; i < array.length; i++) {
        array[i].x = x
        array[i].y = i*(array[i].h+spacing)+y
    }
}





function print(text="default") {
    let txt = new Text(150, 290, `${text}`, "blue")
    txt.draw(ctx)
}