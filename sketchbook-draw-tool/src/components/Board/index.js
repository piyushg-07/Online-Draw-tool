import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { MENU_ITEMS } from "@/constants";
import { actionItemClick } from '@/slice/menuSlice'
const Board = () => {
  const dispatch = useDispatch()
  const canvasRef = useRef(null)

  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu)
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem])

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')


    canvas.width = window.innerWidth
    canvas.height = window.innerHeight



  }, [])

  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default Board