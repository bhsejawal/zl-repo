import { h, toChildArray } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Box, Button, Text } from 'grommet';
import classnames from 'classnames';

import style from './style.scss';

const Tabs = ({ children, className, show = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeTabContent = useMemo(
    () => toChildArray(children)[activeIndex],
    [children, activeIndex],
  );

  // TODO: maybe to move it to another component to prevent it from running on large screens
  const tabButtons = useMemo(() => (
    <Box className={style.tabControls} flex={{ shrink: 0 }} direction="row" justify="evenly">
      {toChildArray(children).map(({ props: { label, icon } }, ind) => (
        <Button plain onClick={() => setActiveIndex(ind)}>
          <Box
            pad="medium"
            align="center"
            className={classnames(
              style.tabBtn,
              { [style.active]: activeIndex === ind },
            )}
          >
            {icon}
            <Text size="medium" margin={{ top: '5px' }} color="inherit">
              {label}
            </Text>
          </Box>
        </Button>
      ))}
    </Box>
  ), [children, activeIndex]);

  if (!show) {
    return toChildArray(children)[0];
  }

  return (
    <Box fill className={className}>
      <Box flex>
        <div className={style.content}>
          {activeTabContent}
        </div>
      </Box>
      {tabButtons}
    </Box>
  );
};

export default Tabs;
