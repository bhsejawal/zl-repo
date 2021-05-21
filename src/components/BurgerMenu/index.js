import { h, toChildArray } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import { Drop, Button, Box } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-light-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const BurgerMenu = ({ id, className, children }) => {
  const ref = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = useCallback(() => setShowMenu(!showMenu), [showMenu]);
  const closeMenu = useCallback(() => setShowMenu(false), []);

  return (
    <div id={id} ref={ref} className={classnames(style.menuContainer, className)}>
      <Button plain className={style.burgerBtn} onMouseDown={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      {showMenu && (
        <Drop
          align={{ top: 'bottom' }}
          pad={{ bottom: '20px' }}
          target={ref.current}
          elevation="xlarge"
          className={style.menuDrop}
          width="100%"
          round="false"
          onClickOutside={closeMenu}
        >
          {toChildArray(children).map((child = null) => (
            child?.props?.clickable ? (
              <Button margin={{ vertical: '10px' }} className={style.item} plain onClick={toggleMenu}>
                {child}
              </Button>
            ) : (
              <Box margin={{ vertical: '10px' }}>
                {child}
              </Box>
            )
          ))}
        </Drop>
      )}
    </div>
  );
};

export default BurgerMenu;
