import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { changeColor, changeBrushSize } from '@/slice/toolboxSlice';
import { COLORS, MENU_ITEMS } from '@/constants';

const Toolbox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const showStrokeToolOption = [MENU_ITEMS.PENCIL, MENU_ITEMS.SQUARE, MENU_ITEMS.CIRCLE, MENU_ITEMS.LINE, MENU_ITEMS.TEXT, MENU_ITEMS.ArrowLine,MENU_ITEMS.Diamond].includes(activeMenuItem);
  const showBrushToolOption = [MENU_ITEMS.PENCIL, MENU_ITEMS.ERASER, MENU_ITEMS.SQUARE, MENU_ITEMS.CIRCLE, MENU_ITEMS.LINE, MENU_ITEMS.TEXT, MENU_ITEMS.ArrowLine, MENU_ITEMS.Diamond].includes(activeMenuItem);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);

  const updateBrushSize = (e) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size: e.target.value }));
  };

  const updateColor = (newColor) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
  };


  return (
    <div style={toolboxContainerStyle}>
      {showStrokeToolOption &&
        <div style={toolItemStyle}>
          <h4 style={toolTextStyle}>Stroke Color</h4>
          <div style={itemContainerStyle}>
            {Object.values(COLORS).slice(0, -1).map((colorValue, index) => (
              <div
                key={index}
                style={{
                  ...colorBoxStyle,
                  backgroundColor: colorValue,
                  ...(color === colorValue && activeColorBoxStyle),
                }}
                onClick={() => updateColor(colorValue)}
              />
            ))}
          </div>
        </div>
      }
      {showBrushToolOption &&
        <div style={toolItemStyle}>
          <h4 style={toolTextStyle}>Brush Size</h4>
          <div style={itemContainerStyle}>
            <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} value={size} />
          </div>
        </div>
      }
    </div>
  );
};

export default Toolbox;

const toolboxContainerStyle = {
  padding: '1rem',
  position: 'absolute',
  top: '15%',
  left: '2%',
  width: '16rem',
  borderRadius: '0.5rem',
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)',
  border: '1px solid #ccc',
  backgroundColor: 'rgba(249, 249, 249, 0.8)', // Change the alpha value here (0.8 for 80% opacity)
};

const toolItemStyle = {
  marginBottom: '1rem',
};

const toolTextStyle = {
  fontSize: '0.6875rem',
  color: '#333',
};

const itemContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '0.5rem',
};

const colorBoxStyle = {
  height: '0.9375rem',
  width: '0.9375rem',
  marginRight: '0.25rem',
  borderRadius: '0.125rem',
  cursor: 'pointer',
};

const activeColorBoxStyle = {
  border: '1.5px solid #999',
  padding: '0.5rem',
  boxShadow: '0 0.15rem 0.25rem rgba(0, 0, 0, 0.2)',
};
