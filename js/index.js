//array of all lines to check for collision
let lines = [];

let currentPoint = {
  x: 5,
  y: 5,
  dist: 0,
  visited: false,
  parent: null,
}
let endPoint = {
  x: 90,
  y: 90
}

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

const redrawLines = () => {
  lines.map(line => {
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(line[0][0], line[0][1])
    ctx.lineTo(line[1][0], line[1][1])
    ctx.stroke()
    ctx.closePath()
  })
}

const redrawSquares = (coords) => {
  const drawMovingRect = (coords) => {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }
  const drawEndRect = (endCoords) => {
    ctx.strokeStyle = "#0000FF";
    ctx.strokeRect(endCoords.x, endCoords.y, 5, 5)
  }
  drawEndRect(endPoint)
  drawMovingRect(coords || currentPoint)
}

const redrawFrame = (agentCoords) => {
  redrawLines()
  redrawSquares(agentCoords || null)
}

const canvasDrawingCode = () => {

  //stores current line
  let currentLine = []

  //keeping track of whether a line is being started or ended 
  let clicked = false


  const getMousePosition = (event) => {
    let rectangle = canvas.getBoundingClientRect();
    return [event.pageX - rectangle.left, event.pageY - rectangle.top]
  }

  const canvasMouseMove = (event => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000'
    const mousePos = getMousePosition(event)
    redrawFrame()
    ctx.beginPath()
    ctx.moveTo(currentLine[0][0], currentLine[0][1])
    ctx.lineTo(mousePos[0], mousePos[1])
    ctx.stroke()
    ctx.closePath()
  })


  const canvasClick = (event => {
    ctx.lineWdith = 5;
    ctx.strokeStyle = '#000000'
    const mousePos = getMousePosition(event)
    if (clicked) {
      canvas.removeEventListener('mousemove', canvasMouseMove)
      currentLine.push(mousePos)
      lines.push(currentLine)
      currentLine = []
      clicked = false
    } else {
      currentLine.push(mousePos)
      canvas.addEventListener('mousemove', canvasMouseMove)
      clicked = true
    }
  })

  canvas.addEventListener('click', canvasClick)

}

canvasDrawingCode()

const pathFind = (start) => {
  let started = start

  const drawMovingRect = (coords) => {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }

  const drawEndRect = (coords) => {
    ctx.strokeStyle = "#0000FF";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }

  //generates neighboring nodes that haven't been visited
  const generateNeighbors = (baseNode) => {
    let neighboringNodesArr = [{
      x: baseNode.x + 5,
      y: baseNode.y,
      dist: baseNode.dist + 1,
      parent: baseNode
    }, {
      x: baseNode.x - 5,
      y: baseNode.y,
      dist: baseNode.dist + 1,
      parent: baseNode
    }, {
      x: baseNode.x,
      y: baseNode.y + 5,
      dist: baseNode.dist + 1,
      parent: baseNode
    }, {
      x: baseNode.x + 5,
      y: baseNode.y - 5,
      dist: baseNode.dist + 1,
      parent: baseNode
    }]

    let resultArr = []

    neighboringNodesArr.map(node => {
      if (checkForOutOfBounds(node) && !checkClosedNode(node) && !checkCollision(node)) {
        resultArr.push(node)
      }
    })
    return resultArr
  }

  const checkForOutOfBounds = (node) => {
    return ((node.x >= 0 && node.x <= canvas.width) && (node.y >= 0 && node.y <= canvas.height))
  }

  const checkForEnd = (node) => {
    return ((node.x <= (endPoint.x + 5) && node.x >= (endPoint.x - 5)) && (node.y >= (endPoint.y - 5) && node.y <= (endPoint.y + 5)))
  }

  //returns true if node collides with line (within 5 px) and walls based on canvas width and height
  const checkCollision = (node) => {
    let collide = false
    lines.map(lineCoords => {
      const dist = Math.sqrt(lineCoords[0][0] * lineCoords[1][0] + lineCoords[0][1] * lineCoords[1][1])
      const nodeDist = Math.sqrt(lineCoords[0][0] * node.x + lineCoords[0][1] * node.y)
      if ((nodeDist >= dist + 5 && nodeDist <= dist - 5) && (node.x >= 0 && node.x <= canvas.width) && (node.y >= 0 && node.y <= canvas.height)) {
        collide = true;
      }
    })
    return collide
  }

  //array of visited nodes
  let closedNodes = [];
  //checks node against array of visited nodes returns true if node has been visited
  const checkClosedNode = (node) => {
    for (let i = 0; i < closedNodes.length; i++) {
      if (closedNodes[i].x === node.x && closedNodes[i].y === node.y && closedNodes[i].dist <= node.dist) {
        return true
      } else if (closedNodes[i].x === node.x && closedNodes[i].y === node.y && closedNodes[i].dist > node.dist) {
        closedNodes[i] = node
        return false
      }
    }
    closedNodes.push(node)
    return false
  }

  let grid = []

  initGrid = () => {
    grid = []
    for (let i = 0; i < canvas.width; i++) {
      for (let j = 0; j < canvas.height; j++) {
        grid.push({
          x: i,
          y: j,
          dist: undefined,
          parent: null,
          visited: false
        })
      }
    }
  }


  const generatePath = ((startNode) => {
    let availabileTiles = []

    const generateGrid = (gridNode) => {
      let neighbors = generateNeighbors(gridNode)
      if (neighbors.length >= 1) {
        console.log(neighbors)
        neighbors.map(neighbor => {
          neighbor.parent = gridNode
          availabileTiles.push(neighbor)
          generateGrid(neighbor)
        })
      }
      availabileTiles.sort((tile, newTile) => {
        return tile.dist - newTile.dist
      })
    }
    availabileTiles.forEach(node => {
      if (checkForEnd(node) && closedNodes.length) {
        console.log('end found')
        console.log('final node', node)
        let resultArr = []
        while (node.parent) {
          resultArr.push(node)
          node = node.parent
        }
        console.log(resultArr)
        return resultArr
      }
    })

    return generateGrid(startNode)
    // const gridSurvey = (node) => {
    //   if (checkForEnd(node) && closedNodes.length) {
    //     console.log('end found')
    //     console.log('final node', node)
    //     let resultArr = []
    //     while (node.parent) {
    //       resultArr.push(node)
    //       node = node.parent
    //     }
    //     console.log(resultArr)
    //     return resultArr
    //   }
    // let neighbors = generateNeighbors(node)
    // neighbors.map(neighbor => {
    //   neighbor.parent = node
    //   availabileTiles.push(neighbor)
    // })
    // neighbors.map(newNode => {
    //   grid.map(gridNode => {
    //     if (gridNode.x === newNode.x && gridNode.y === newNode.y) {
    //       if (!gridNode.visited) {
    //         gridNode.visited = true
    //         gridNode.dist = newNode.dist
    //         gridNode.parent = node
    //       }
    //     }
    //   })
    //   gridSurvey(newNode)
    // })
    // }
  })

  const moveRectOnPath = ((path) => {
    count = 0;
    console.log(path)
    path.map(point => {
      count += 500
      setTimeout(redrawFrame(point), count)
    })
  })

  if (!started) {
    drawMovingRect(currentPoint)
    drawEndRect(endPoint)
  } else {
    let path = generatePath(currentPoint)
    console.log(path)
    moveRectOnPath(path)
  }
}

let startButton = document.getElementById('startButton')
startButton.addEventListener('click', () => pathFind(true))

pathFind(false)