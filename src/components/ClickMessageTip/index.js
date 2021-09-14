import { useEffect, useRef, useState } from 'preact/compat';
import { Box, Drop } from 'grommet';

import style from './style.scss';

const ClickMessageTip = ({
  children,
  text,
  disable,
  align,
}) => {
  const targetRef = useRef();
  const [, setShowDrop] = useState(false);

  useEffect(() => setShowDrop(!!targetRef.current), [children]);

  if (disable) {
    return children;
  }

  return (
    <Box className={style.clickMessageTip}>
      <Box ref={targetRef} className={style.pulse}>
        {children}
      </Box>
      {targetRef.current && (
        <Drop
          key={text}
          plain
          align={align}
          target={targetRef.current}
        >
          <Box pad="35px">
            <Box className={style.content}>
              {text}
            </Box>
          </Box>
        </Drop>
      )}
    </Box>
  );
};

export default ClickMessageTip;
