//array of all lines to check for collision
let lines = [];

let currentPoint = {
  x: 5,
  y: 5,
  dist: 0
}
let endPoint = {
  x: 790,
  y: 590
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

const redrawSquares = () => {
  const drawMovingRect = (coords) => {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }
  const drawEndRect = (coords) => {
    ctx.strokeStyle = "#0000FF";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }
  drawEndRect(endPoint)
  drawMovingRect(currentPoint)
}

const redrawFrame = () => {
  redrawLines()
  redrawSquares()
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

const pathFind = () => {
  let started = false

  const drawMovingRect = (coords) => {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }

  const drawEndRect = (coords) => {
    ctx.strokeStyle = "#0000FF";
    ctx.strokeRect(coords.x, coords.y, 5, 5)
  }

  const generateNeighbors = (baseNode) => {
    return [{
      x: baseNode.x + 5,
      y: baseNode.y,
      dist: baseNode.dist += 1
    }, {
      x: baseNode.x - 5,
      y: baseNode.y,
      dist: baseNode.dist += 1
    }, {
      x: baseNode.x,
      y: baseNode.y + 5,
      dist: baseNode.dist += 1
    }, {
      x: baseNode.x + 5,
      y: baseNode.y - 5,
      dist: baseNode.dist += 1
    }]
  }

  const checkForEnd = (node) => {
    return ((node.x <= endpoint.x + 5 && node.x <= endpoint.x - 5) && (node.y >= endpoint.y - 5 && node.x <= endpoint.y + 5))
  }

  //returns true if node collides with line (within 5 px)
  const checkCollision = (node) => {
    lines.map(lineCoords => {
      const dist = Math.sqrt(lineCoords[0][0] * lineCoords[1][0] + lineCoords[0][1] * lineCoords[1][1])
      const nodeDist = Math.sqrt(lineCoords[0][0] * node.x + lineCoords[0][1] * node.y)
      return (nodeDist >= dist + 5 && nodeDist <= dist - 5)
    })
  }

  const pathFind = (node) => {
    let resultArr = [];
    let closedcNodes = [];
    const neighboringNodes = generateNeighbors(node)
    neighboringNodes.map(newNode => {
      if (checkForEnd(newNode)) {
        resultArr.push(newNode)
        return resultArr.reverses()
      } else if (!checkCollision(newNode)) {
        resultArr.push(newNode)
      }
    })
  }

  if (!started) {
    drawMovingRect(currentPoint)
    drawEndRect(endPoint)
  }
}

pathFind()