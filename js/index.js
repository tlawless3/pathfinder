//array of all lines to check for collision
let lines = [];


const canvasDrawingCode = () => {
  let canvas = document.getElementById('canvas')
  let ctx = canvas.getContext('2d')

  //stores current line
  let currentLine = []

  //keeping track of whether a line is being started or ended 
  let clicked = false

  const redrawLines = () => {
    lines.map(line => {
      ctx.beginPath()
      ctx.moveTo(line[0][0], line[0][1])
      ctx.lineTo(line[1][0], line[1][1])
      ctx.stroke()
      ctx.closePath()
    })
  }

  const getMousePosition = (event) => {
    let rectangle = canvas.getBoundingClientRect();
    return [event.pageX - rectangle.left, event.pageY - rectangle.top]
  }

  const canvasMouseMove = (event => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mousePos = getMousePosition(event)
    redrawLines()
    ctx.beginPath()
    ctx.moveTo(currentLine[0][0], currentLine[0][1])
    ctx.lineTo(mousePos[0], mousePos[1])
    ctx.stroke()
    ctx.closePath()
  })


  const canvasClick = (event => {
    ctx.lineWdith = 5;
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