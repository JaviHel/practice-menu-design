// CLASS TO GET RANDOM NUMBERS

function randColor(type="hex") {
    let digits = '0123456789ABCDEF';
    let colorHex = '#';
    
    if (type.toLowerCase() == "hex") {
        for (let i = 0; i < 6; i++) {
            let randIndex = Math.floor(Math.random() * digits.length);
            colorHex += digits[randIndex];
        }    
        
        return colorHex
    }

    if (type.toLowerCase() == "rgb") {
        r = randInt(0, 255)
        g = randInt(0, 255)
        b = randInt(0, 255)

        return `rgb(${r}, ${g}, ${b})`
    }
    
}


function randRange(n) {
    return Math.floor(Math.random()*n)
}

function randInt(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min
}

function randChoice(array) {
    let randIndex = Math.floor(Math.random()*array.length)
    return array[randIndex]
}

