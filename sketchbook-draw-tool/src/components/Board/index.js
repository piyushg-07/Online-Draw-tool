import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { MENU_ITEMS } from "@/constants";
import { actionItemClick } from '@/slice/menuSlice';

import { socket } from "@/socket";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  const shouldDraw = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  const redrawCanvas = (context) => {
    if (drawHistory.current[historyPointer.current]) {
      context.putImageData(drawHistory.current[historyPointer.current], 0, 0);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Create a new canvas with white background
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newContext = newCanvas.getContext('2d');
    newContext.fillStyle = 'white';
    newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
    newContext.drawImage(canvas, 0, 0);

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = newCanvas.toDataURL();
      const anchor = document.createElement('a');
      anchor.href = URL;
      anchor.download = 'sketch.jpg';
      anchor.click();
    } else if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1;
      if (historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1;
      const imageData = drawHistory.current[historyPointer.current];
      context.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const changeConfig = (color, size) => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    const handleChangeConfig = (config) => {
      changeConfig(config.color, config.size);
    };
    changeConfig(color, size);
    socket.on('changeConfig', handleChangeConfig);

    return () => {
      socket.off('changeConfig', handleChangeConfig);
    };
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x, y) => {
      context.beginPath();
      context.moveTo(x, y);
    };

    const drawLine = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };

    const drawSquare = (x, y, startX, startY) => {
      const width = x - startX;
      const height = y - startY;
      redrawCanvas(context); // Redraw canvas to clear the previous preview
      context.strokeRect(startX, startY, width, height);
    };

    const drawDiamond = (x, y, startX, startY) => {
      const width = x - startX;
      const height = y - startY;
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;

      redrawCanvas(context); // Redraw canvas to clear the previous preview

      context.beginPath();
      context.moveTo(centerX, startY); // Top
      context.lineTo(startX, centerY); // Left
      context.lineTo(centerX, startY + height); // Bottom
      context.lineTo(startX + width, centerY); // Right
      context.closePath();

      context.stroke();
    };

    const drawCircle = (x, y, startX, startY) => {
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      redrawCanvas(context); // Redraw canvas to clear the previous preview
      context.beginPath();
      context.arc(startX, startY, radius, 0, Math.PI * 2);
      context.stroke();
    };

    const drawStraightLine = (x, y, startX, startY) => {
      redrawCanvas(context); // Redraw canvas to clear the previous preview
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(x, y);
      context.stroke();
    };

    const ArrowLine = (x, y, startX, startY) => {
      redrawCanvas(context); // Redraw canvas to clear the previous preview
      const arrowSize = 10; // Size of the arrowhead
      const angle = Math.atan2(y - startY, x - startX);

      // Draw the line
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(x, y);
      context.stroke();

      // Draw the arrowhead
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-arrowSize, -arrowSize / 2);
      context.lineTo(-arrowSize, arrowSize / 2);
      context.closePath();
      context.fillStyle = context.strokeStyle; // Arrowhead color matches line color
      context.fill();
      context.restore();
    };

    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      startX.current = e.clientX || e.touches[0].clientX;
      startY.current = e.clientY || e.touches[0].clientY;
      beginPath(startX.current, startY.current);
      socket.emit('beginPath', { x: startX.current, y: startY.current });
    };

    const handleMouseMove = (e) => {
      if (!canvasRef.current || !shouldDraw.current) return;
      const x = e.clientX || e.touches[0].clientX;
      const y = e.clientY || e.touches[0].clientY;
      if (activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER) {
        drawLine(x, y);
        socket.emit('drawLine', { x, y });
      } else {
        const shapeData = { x, y, startX: startX.current, startY: startY.current };
        switch (activeMenuItem) {
          case MENU_ITEMS.SQUARE:
            drawSquare(x, y, startX.current, startY.current);
            socket.emit('drawSquare', shapeData);
            break;
          case MENU_ITEMS.CIRCLE:
            drawCircle(x, y, startX.current, startY.current);
            socket.emit('drawCircle', shapeData);
            break;
          case MENU_ITEMS.LINE:
            drawStraightLine(x, y, startX.current, startY.current);
            socket.emit('drawLine', shapeData);
            break
            case MENU_ITEMS.ArrowLine:
              ArrowLine(x, y, startX.current, startY.current);
              socket.emit('drawArrowLine', shapeData);
              break;
            case MENU_ITEMS.Diamond:
              drawDiamond(x, y, startX.current, startY.current);
              socket.emit('drawDiamond', shapeData);
              break;
            default:
              break;
          }
        }
      };
  
      const handleMouseUp = (e) => {
        shouldDraw.current = false;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        drawHistory.current.push(imageData);
        historyPointer.current = drawHistory.current.length - 1;
      };
  
      const handleBeginPath = (path) => {
        beginPath(path.x, path.y);
      };
  
      const handleDrawLine = (path) => {
        drawLine(path.x, path.y);
      };
  
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
  
      canvas.addEventListener('touchstart', handleMouseDown);
      canvas.addEventListener('touchmove', handleMouseMove);
      canvas.addEventListener('touchend', handleMouseUp);
  
      socket.on('beginPath', handleBeginPath);
      socket.on('drawLine', handleDrawLine);
      socket.on('drawSquare', (shapeData) => {
        const { x, y, startX, startY } = shapeData;
        drawSquare(x, y, startX, startY);
      });
      socket.on('drawCircle', (shapeData) => {
        const { x, y, startX, startY } = shapeData;
        drawCircle(x, y, startX, startY);
      });
      socket.on('drawLine', (shapeData) => {
        const { x, y, startX, startY } = shapeData;
        drawStraightLine(x, y, startX, startY);
      });
      socket.on('drawArrowLine', (shapeData) => {
        const { x, y, startX, startY } = shapeData;
        ArrowLine(x, y, startX, startY);
      });
      socket.on('drawDiamond', (shapeData) => {
        const { x, y, startX, startY } = shapeData;
        drawDiamond(x, y, startX, startY);
      });
  
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
  
        canvas.removeEventListener('touchstart', handleMouseDown);
        canvas.removeEventListener('touchmove', handleMouseMove);
        canvas.removeEventListener('touchend', handleMouseUp);
  
        socket.off('beginPath', handleBeginPath);
        socket.off('drawLine', handleDrawLine);
        socket.off('drawSquare');
        socket.off('drawCircle');
        socket.off('drawLine');
        socket.off('drawArrowLine');
        socket.off('drawDiamond');
      };
    }, [activeMenuItem]);
  
    useEffect(() => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (drawHistory.current.length > 0) {
        redrawCanvas(context);
      }
    }, [activeMenuItem]);
  
    return (
      <canvas ref={canvasRef}></canvas>
    );
  };
  
  export default Board;
  