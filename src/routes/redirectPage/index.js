import {
  Box,
  Text,
  Image,
  Heading,
} from 'grommet';

import background from 'Assets/redirectBackground.png';
import zoolifeLogo from 'Assets/zoolife.svg';

import style from './style.scss';

const RedirectPage = () => (
  <Box
    fill
    className={style.gradient}
  >
    <Box
      background={{
        image: `url(${background})`,
        size: 'cover',
        position: 'bottom',
        repeat: 'no-repeat',
        attachment: 'fixed',
      }}
      fill
    >
      <Box height="24px" width="72.5%" alignSelf="start" pad="large">
        <Image src={zoolifeLogo} alignSelf="start" />
        <Heading level="1"> Our animals are too big for mobile.</Heading>
        <Text size="16px">We&apos;ve sent a link to your email to explore on desktop or tablet.</Text>
      </Box>
    </Box>
  </Box>
);

export default RedirectPage;
