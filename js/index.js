//array of all lines to check for collision
let lines = [];

let currentPoint = {
  x: 5,
  y: 5,
  dist: 0
}
let endPoint = {
  x: 20,
  y: 20
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
      dist: baseNode.dist + 1
    }, {
      x: baseNode.x - 5,
      y: baseNode.y,
      dist: baseNode.dist + 1
    }, {
      x: baseNode.x,
      y: baseNode.y + 5,
      dist: baseNode.dist + 1
    }, {
      x: baseNode.x + 5,
      y: baseNode.y - 5,
      dist: baseNode.dist + 1
    }]

    let resultArr = []

    neighboringNodesArr.map(node => {
      if (checkForOutOfBounds(node) && !checkClosedNode(node) && checkCollision(node)) {
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
    let collide = true
    lines.map(lineCoords => {
      const dist = Math.sqrt(lineCoords[0][0] * lineCoords[1][0] + lineCoords[0][1] * lineCoords[1][1])
      const nodeDist = Math.sqrt(lineCoords[0][0] * node.x + lineCoords[0][1] * node.y)
      if ((nodeDist >= dist + 5 && nodeDist <= dist - 5) && (node.x >= 0 && node.x <= canvas.width) && (node.y >= 0 && node.y <= canvas.height)) {
        collide = false;
      }
    })
    return collide
  }

  //array of visited nodes
  let closedNodes = [];
  //checks node against array of visited nodes returns true if node has been visited
  const checkClosedNode = (node) => {
    for (let i = 0; i < closedNodes.length; i++) {
      if (closedNodes[i].x === node.x && closedNodes[i].y === node.y && closedNodes[i].dist < node.dist) {
        return true
      }
    }
    closedNodes.push(node)
    return false
  }

  const generatePath = ((node, iterativeArr) => {
    let resultArr = iterativeArr ? iterativeArr : []
    const neighboringNodes = generateNeighbors(node)
    for (let i = 0; i < neighboringNodes.length; i++) {
      let newNode = neighboringNodes[i]
      if (checkForEnd(newNode)) {
        resultArr.push(newNode)
        return resultArr.reverse()
      } else if (checkCollision(newNode)) {
        resultArr.push(newNode)
        return generatePath(newNode, resultArr)
      }
    }
  })

  const moveRectOnPath = (path) => {
    count = 0;
    path.map(point => {
      count += 500
      setTimeout(redrawFrame(point), count)
    })
  }

  if (!started) {
    drawMovingRect(currentPoint)
    drawEndRect(endPoint)
  } else {
    console.log(generatePath(currentPoint))
    moveRectOnPath(generatePath(currentPoint))
  }
}

let startButton = document.getElementById('startButton')
startButton.addEventListener('click', () => pathFind(true))

pathFind(false)