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
import { Link } from 'preact-router';

import { PrimaryButton } from 'Components/Buttons';

import HabitatImage from './HabitatImage';

import style from './style.scss';

const ScheduleItem = ({
  animal,
  liveTalks,
  zooLogo,
  habitatImage,
  description,
  habitatSlug,
  zooSlug,
  onClick,
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
      <Image src={zooLogo} width="140" className={style.zooImage} />
      <Box direction="row" style={{ zIndex: 1 }}>
        <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)}>
          <HabitatImage image={habitatImage} />
        </Link>
        <Box justify="center" margin={{ left: 'medium' }}>
          <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)}>
            <Heading level="3" margin="0px">{animal}</Heading>
          </Link>
          <Text size="xlarge" margin={{ top: 'small' }}>
            {description}
          </Text>
        </Box>
      </Box>
      <Grid columns={columns}>
        {liveTalks.map((liveTalk) => (
          <Box pad="small" flex="grow" margin={{ top: 'small' }}>
            <Box className={style.textBox}>
              <Heading level="4" margin="0px">{liveTalk.title}</Heading>
              <Text size="xlarge">
                {liveTalk.description}
              </Text>
            </Box>
            <Grid gap ="xsmall" margin={{ top: "medium"}} height="xxsmall" columns={['auto', 'auto', 'auto']} rows="xxsmall">
              {liveTalk.sessions.map(({ startTime, sessionId }) => (
                <PrimaryButton
                  label={format(Date.parse(startTime), 'hh:mm aa')}
                  className={style.sessionButton}
                  onClick={() => onClick(sessionId)}
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
