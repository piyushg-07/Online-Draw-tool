const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const isDev = app.settings.env === 'development'
const URL = isDev ? 'http://localhost:3000' : 'https://online-draw-tool.onrender.com'
app.use(cors({origin: URL}))
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: URL });

io.on("connection", (socket) => {
  console.log("server connected")

  socket.on('beginPath', (arg) => {
    socket.broadcast.emit('beginPath', arg)
  })

  socket.on('drawLine', (arg) => {
    socket.broadcast.emit('drawLine', arg)
  })


  socket.on('drawSquare', (shapeData) => {
    socket.broadcast.emit('drawSquare', shapeData);
  });

  socket.on('drawCircle', (shapeData) => {
    socket.broadcast.emit('drawCircle', shapeData);
  });

  socket.on('drawArrowLine', (shapeData) => {
    socket.broadcast.emit('drawArrowLine', shapeData);
  });

  socket.on('drawDiamond', (shapeData) => {
    socket.broadcast.emit('drawDiamond', shapeData);
  });

  socket.on('changeConfig', (arg) => {
    socket.broadcast.emit('changeConfig', arg)
  })
});

app.get("/", (req, res) => {
  res.send("Sketchbook DrawTool");
});

httpServer.listen(5000, () => {
  console.log("Server running on Port:5000");
});