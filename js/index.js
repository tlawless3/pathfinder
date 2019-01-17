const canvasDrawingCode = () => {
  let canvas = document.getElementById('canvas')
  let ctx = canvas.getContext('2d')

  //array of all lines to check for collision
  let lines = [];

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

  const canvasMouseMove = (event => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawLines()
    ctx.beginPath()
    ctx.moveTo(currentLine[0][0], currentLine[0][1])
    ctx.lineTo(event.pageX, event.pageY)
    ctx.stroke()
    ctx.closePath()
  })


  const canvasClick = (event => {
    ctx.lineWdith = 5;
    if (clicked) {
      canvas.removeEventListener('mousemove', canvasMouseMove)
      currentLine.push([event.pageX, event.pageY])
      lines.push(currentLine)
      currentLine = []
      clicked = false
    } else {
      currentLine.push([event.pageX, event.pageY])
      canvas.addEventListener('mousemove', canvasMouseMove)
      clicked = true
    }
  })

  canvas.addEventListener('click', canvasClick)

}

canvasDrawingCode()