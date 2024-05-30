import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencil,
  faEraser,
  faSquare,
  faCircle,
  faMinus,
  faFont,
  faRotateLeft,
  faRotateRight,
  faFileArrowDown,
  faArrowAltCircleRight,
  faRhombus,
  faDiamond
} from '@fortawesome/free-solid-svg-icons';

import styles from './index.module.css';

import { menuItemClick, actionItemClick } from '@/slice/menuSlice';

import { COLORS, MENU_ITEMS } from '@/constants';

const Menu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

  const handleMenuClick = (itemName) => {
    dispatch(menuItemClick(itemName));
  };

  const handleActioItemClick = (itemName) => {
    dispatch(actionItemClick(itemName));
  };

  return (
    <div className={styles.menuContainer}>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL })}
        onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
      >
        <FontAwesomeIcon icon={faPencil} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.ERASER })}
        onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
      >
        <FontAwesomeIcon icon={faEraser} className={styles.icon} />
      </div>

      {/* Icons for additional tools */}
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.SQUARE })}
        onClick={() => handleMenuClick(MENU_ITEMS.SQUARE)}
      >
        <FontAwesomeIcon icon={faSquare} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.Diamond })}
        onClick={() => handleMenuClick(MENU_ITEMS.Diamond)}
      >
        <FontAwesomeIcon icon={faDiamond} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.CIRCLE })}
        onClick={() => handleMenuClick(MENU_ITEMS.CIRCLE)}
      >
        <FontAwesomeIcon icon={faCircle} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.ArrowLine })}
        onClick={() => handleMenuClick(MENU_ITEMS.ArrowLine)}
      >
        <FontAwesomeIcon icon={faArrowAltCircleRight} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.LINE })}
        onClick={() => handleMenuClick(MENU_ITEMS.LINE)}
      >
        <FontAwesomeIcon icon={faMinus} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.TEXT })}
        onClick={() => handleMenuClick(MENU_ITEMS.TEXT)}
      >
        <FontAwesomeIcon icon={faFont} className={styles.icon} />
      </div>

      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.UNDO })}
        onClick={() => handleActioItemClick(MENU_ITEMS.UNDO)}
      >
        <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.REDO })}
        onClick={() => handleActioItemClick(MENU_ITEMS.REDO)}
      >
        <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.DOWNLOAD })}
        onClick={() => handleActioItemClick(MENU_ITEMS.DOWNLOAD)}
      >
        <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
      </div>

    </div>
  );
};

export default Menu;
