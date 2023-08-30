const readline = require('readline');
const { stdout, stdin } = require("process");

readline.emitKeypressEvents(stdin);

function createMatrix(x, y)
{
    const matrix = new Array(y);
    for (let i = 0; i < arr.length; i++) {
        matrix[i] = new Array(x);
    } 
    return matrix
}

exports.createMatrix = createMatrix

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

    stdin.on("keypress", onKeypress)
    console.log("Listening")
}

exports.loadGrid = loadGrid