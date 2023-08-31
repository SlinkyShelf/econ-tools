const readline = require('readline');
const { stdout, stdin } = require("process");

readline.emitKeypressEvents(stdin);

function createMatrix(x, y)
{
    const matrix = new Array(y);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(x);
    } 
    return matrix
}

exports.createMatrix = createMatrix

const tlCorner = "┌"
const trCorner = "┐"
const blCorner = "└"
const brCorner = "┘"

const vLine    = "│"
const hLine    = "─"

const topT     = "┴"
const botttomT = "┬"
const rightT   = "├"
const leftT    = "┤"

const _4 = "┼"

function getEdge(x, y, width, height)
{
    // Edged
    if (x == 0 && y == 0)
        return tlCorner
    if (x == 0 && y == height-1)
        return blCorner
    if (x == width-1 && y == 0)
        return trCorner
    if (x == width-1 && y == height-1)
        return brCorner


    if (x == 0)
        return rightT
    if (x == width-1)
        return leftT
    if (y == 0)
        return botttomT
    if (y == height-1)
        return topT

    return _4
}

function drawGrid(grid)
{
    const width = 10
    const height = 10
    
    let gridStr = ""
    const spacing = 1

    for (let y = 0; y < height; y++)
    {
        // Line
        for (let x = 0; x < width; x++)
        {
            gridStr += getEdge(x, y, width+1, height+1)
        }
        gridStr += getEdge(width+1, y, width+1, height+1)
        gridStr += "\n"
    }

    return gridStr
}

function loadGrid(grid)
{
    function onKeypress(str, key)
    {
        key = key || {}
        
        if (key.sequence == '\x03')
            stdin.pause()
    }

    stdin.setRawMode( true );
    stdin.resume();

    const drawMatrix = createMatrix(grid.length, grid[0].length)

    stdin.on("keypress", onKeypress)
    console.log(drawGrid())
}

exports.loadGrid = loadGrid