import { Box, Text } from 'grommet';

import style from './style.scss';

const PreviewTag = () => (
  <Box
    background="#24412B"
    className={style.previewTag}
    pad="xsmall"
  >
    <Text weight={700} size="10px">PREVIEW</Text>
  </Box>
)

export default PreviewTag;
