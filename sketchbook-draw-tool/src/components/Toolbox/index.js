import cx from 'classnames';

import styles from './index.module.css'

import { COLORS, MENU_ITEMS } from '@/constants'
const Toolbox = () => {
  return (
    <div className={styles.toolboxContainer}>
      {/* {showStrokeToolOption &&  */}
      <div className={styles.toolItem}>
        <h4 className={styles.toolText}>Stroke Color</h4>
        <div className={styles.itemContainer}>
          <div className={cx(styles.colorBox,)} style={{ backgroundColor: COLORS.BLACK }} onClick={() => updateColor(COLORS.BLACK)} />
          <div className={cx(styles.colorBox, )} style={{ backgroundColor: COLORS.RED }} onClick={() => updateColor(COLORS.RED)} />
          <div className={cx(styles.colorBox, )} style={{ backgroundColor: COLORS.GREEN }} onClick={() => updateColor(COLORS.GREEN)} />
          <div className={cx(styles.colorBox, )} style={{ backgroundColor: COLORS.BLUE }} onClick={() => updateColor(COLORS.BLUE)} />
          <div className={cx(styles.colorBox,)} style={{ backgroundColor: COLORS.ORANGE }} onClick={() => updateColor(COLORS.ORANGE)} />
          <div className={cx(styles.colorBox, )} style={{ backgroundColor: COLORS.YELLOW }} onClick={() => updateColor(COLORS.YELLOW)} />
        </div>
      </div>
      {/* } */}
      {/* {showBrushToolOption && */}
       <div className={styles.toolItem}>
        <h4 className={styles.toolText}>Brush Size</h4>
        <div className={styles.itemContainer}>
          <input type="range" min={1} max={10} step={1}  />
        </div>
      </div>
      {/* // } */}
    </div>
  )
}

export default Toolbox