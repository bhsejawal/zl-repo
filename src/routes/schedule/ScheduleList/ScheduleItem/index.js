import { useContext, useMemo } from 'preact/hooks';
import {
  Box,
  Image,
  Text,
  Grid,
  ResponsiveContext,
  Heading,
} from 'grommet';
import { format } from 'date-fns';

import { PrimaryButton } from 'Components/Buttons';

import HabitatImage from './HabitatImage';

import torontozoo from './torontozoo.png'
import habitat from './HabitatImage/habitatAvatar.png';

import style from './style.scss';

const ScheduleItem = ({
  animal,
  liveTalks,
  zooImage = torontozoo,
  habitatImage = habitat,
}) => {
  const size = useContext(ResponsiveContext);
  const columns = useMemo(() => (size === 'large' ? ['medium', 'medium'] : ['auto']), [size]);

  return (
    <Box
      pad="large"
      className={style.scheduleItem}
      margin={{top: 'medium'}}
      width={ size === 'large' ? { max: '980px'} : 'large'}
      responsive
      wrap
    >
      {/* We need to load this from the habitats, size contraints should be defined on api */}
      <Image src={zooImage} width="140" className={style.zooImage} />
      <Box direction="row" style={{ zIndex: 1 }}>
        <HabitatImage image={habitatImage} />
        <Box justify="center" margin={{ left: 'medium' }}>
          <Text size="xlarge" weight={900}>{animal}</Text>
          {/* We need to load this from the habitats */}
          <Text size="16px" margin={{ top: 'small' }}>
            These birds are full of personality! Learn more about them with our programs:
          </Text>
        </Box>
      </Box>
      <Grid columns={columns}>
        {liveTalks.map((liveTalk) => (
          <Box pad="small" flex="grow" margin={{ top: 'small' }}>
            <Box className={style.textBox}>
              <Heading level="4" margin="0px">{liveTalk.title}</Heading>
              <Text size="xlarge">
                Join our expert nutritionist as the penguins enjoy their daily breakfast!
              </Text>
            </Box>
            <Grid gap ="xsmall" margin={{ top: "medium"}} height="xxsmall" columns={['auto', 'auto', 'auto']} rows="xxsmall">
              {liveTalk.sessions.map((session) => (
                <PrimaryButton
                  label={format(Date.parse(session.startTime), 'hh:mm aa')}
                  className={style.sessionButton}
                />
              ))}
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default ScheduleItem;
