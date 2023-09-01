const { stdout, stdin } = require("process");
const { createMatrix, loadGrid } = require("./modules/bash-grid.js")

const cells = [["Hello WOrld", "Test 2"], ["Bob", "Yes we can"]]

loadGrid({
    "cells": cells
})
// stdout.moveCursor(0, -500)

// while (true)
// {

// }

  