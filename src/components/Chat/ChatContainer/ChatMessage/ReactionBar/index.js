import { Box, Grid } from 'grommet';
import { useMemo } from 'preact/hooks';

import { useIsHabitatTabbed } from '../../../../../hooks';

import images from './assets';

import style from './style.module.scss';

const ReactionBar = ({ onClick }) => {
  const isTabbedView = useIsHabitatTabbed();
  const gridLayout = useMemo(() => ({
    columns: isTabbedView ? ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'] : ['auto', 'auto'],
    rows: isTabbedView ? ['auto'] : ['auto', 'auto'],
    gap: isTabbedView ? '10px' : '5px',
  }), [isTabbedView])
  return (
    <Box
      pad={{ horizontal: !isTabbedView ? '0px' : '5px' }}
      overflow="auto"
    >
      <Grid
        rows={gridLayout.rows}
        columns={gridLayout.columns}
        gap={gridLayout.gap}
        fill
        alignSelf="center"
        justify="center"
      >
        {Object.keys(images).map((img) => (
          <Box pad="5px" className={style.reactionIcon}>
            {/* eslint-disable-next-line */}
            <img
              src={images[img]}
              onClick={() => onClick(img)}
              alt={`react with ${img}`}
            />
          </Box>
        ))}
      </Grid>
    </Box>
  )
};

export default ReactionBar;
