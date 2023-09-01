const readline = require('readline');
const { stdout, stdin } = require("process");

readline.emitKeypressEvents(stdin);

const max = Math.max
const min = Math.min

function createMatrix(x, y)
{
    const matrix = new Array(y);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(x);
    } 
    return matrix
}

exports.createMatrix = createMatrix

function style(s, color)
{
    var colorIndex;

    if (typeof(color) == "number")
        colorIndex = color;
    else
        switch (color.toLowerCase())
        {
            case "red":
                colorIndex = 31;
                break;
            case "green":
                colorIndex = 32;
                break;
            case "yellow":
                colorIndex = 33;
                break;
            default:
                console.log("Invalid Color \""+color+"\"")
                return s;
        }

    return  '\x1b['+colorIndex+"m"+s+"\x1b[0m"
}

function removeStyles(str)
{
    return str.replace(/\x1b\[[0-9]*m/g, "")
}

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

function createEdgeLine(spacingArray, y, height)
{
    const width = spacingArray.length

    let lineStr = ""
    for (let x = 0; x < width; x++)
    {
        lineStr += getEdge(x, y, width+1, height+1)

        for (let i = 0; i < spacingArray[x]; i++)
        {
            lineStr += hLine
        }
    }
    lineStr += getEdge(width, y, width+1, height+1)

    return lineStr
}

function createSpaceLine(spacingArray)
{
    const width = spacingArray.length

    let lineStr = ""
    for (let x = 0; x < width; x++)
    {
        lineStr += vLine

        for (let i = 0; i < spacingArray[x]; i++)
        {
            lineStr += " "
        }
    }
    lineStr += vLine

    return lineStr
}

function createContentLine(spacingArray, content, spacing)
{
    const width = spacingArray.length

    let lineStr = ""
    for (let x = 0; x < width; x++)
    {
        lineStr += vLine
        const cellSpacing = spacingArray[x]
        const cellContent = content[x]

        const visibleLength = removeStyles(cellContent).length

        const frontSpacing = Math.floor( (cellSpacing - visibleLength ) / 2 )

        for (let i = 0; i < frontSpacing; i++)
            lineStr += " "

        lineStr += content[x]

        for (let i = frontSpacing+visibleLength; i < cellSpacing; i++)
        {
            lineStr += " "
        }
    }
    lineStr += vLine

    return lineStr
}

function drawMatrix(matrix)
{
    const width = matrix[0].length
    const height = matrix.length
    
    let gridStr = ""
    const spacing = 1

    // Spacing Array
    const spacingArray = []
    for (let x = 0; x < width; x++)
    {
        let largestStr = 0
        for (let y = 0; y < height; y++)
        {
            // console.log(matrix[y][x], matrix[y][x].length, removeStyles(matrix[y][x]).length)
            if (largestStr < removeStyles(matrix[y][x]).length)
                largestStr = removeStyles(matrix[y][x]).length
        }

        spacingArray.push(spacing*2 + largestStr)
    }

    for (let y = 0; y < height; y++)
    {
        // Line
        gridStr += createEdgeLine(spacingArray, y, height) + "\n"
        for (let i = 0; i < spacing; i++)
            gridStr += createSpaceLine(spacingArray, y, height) + "\n"

        gridStr += createContentLine(spacingArray, matrix[y], spacing) + "\n"

        for (let i = 0; i < spacing; i++)
            gridStr += createSpaceLine(spacingArray, y, height) + "\n"
        // gridStr += "\n"
    }
    gridStr += createEdgeLine(spacingArray, height, height) + "\n"

    return gridStr
}

function getDim(grid)
{
    return {"width": (grid[0] || []).length, "height": grid.length}
}

function copyDefaults(displayMatrix, originalGrid)
{
    const {oWidth, oHeight} = getDim(originalGrid.cells)
    const {dWidth, dHeight} = getDim(displayMatrix)

    if (dWidth != oWidth || dHeight != oHeight)
        return console.error("Dimensions of display matrix and grid do not match")

    for (let y = 0; y < oHeight; y++)
    {
        for (let x = 0; x < oWidth; x++)
        {
            displayMatrix[y][x] = originalGrid.cells[y][x]
        }
    }
}

function loadGrid(grid)
{
    let selX = 0, selY = 0

    const cells = grid.cells

    const {width, height} = getDim(cells)

    const displayMatrix = createMatrix(width, height)
    copyDefaults(displayMatrix, grid)

    function calculateDisplayMatrix()
    {
        for (let y = 0; y < height; y++)
        {
            for (let x = 0; x < width; x++)
            {
                let value = grid.cells[y][x]
                if (selX == x && selY == y)
                    value = style(value, 7)
                displayMatrix[y][x] = value
            }
        }
    }

    function printDisplayMatrix()
    {
        stdout.moveCursor(0, -500)

        console.log(drawMatrix(displayMatrix))
    }

    function updateSelection()
    {
        calculateDisplayMatrix()
        printDisplayMatrix()
    }

    function onKeypress(str, key)
    {
        key = key || {}

        // console.log(key)
        
        if (key.sequence == '\x03')
            return stdin.pause()
        
        switch (key.name)
        {
            case "up":
                selY = max(0, selY-1);
                updateSelection()
                break
            case "down":
                selY = min(height-1, selY+11);
                updateSelection()
                break
            case "left":
                selX = max(0, selX-1);
                updateSelection()
                break
            case "right":
                selX = min(width-1, selX+1);
                updateSelection()
                break
        }
    }

    stdin.setRawMode( true );
    stdin.resume();

    stdin.on("keypress", onKeypress)
    updateSelection()
}

exports.loadGrid = loadGrid