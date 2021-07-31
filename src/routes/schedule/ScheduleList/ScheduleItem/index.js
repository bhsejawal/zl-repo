import { useContext } from 'preact/hooks';
import {
  Box,
  Text,
  Grid,
  ResponsiveContext,
  Heading,
} from 'grommet';
import { format, isSameDay } from 'date-fns';
import { Link } from 'preact-router';

import BaseHabitatCard from 'Components/HabitatCard/HabitatCardBase';
import { PrimaryButton } from 'Components/Buttons';
import { useIsMobileSize } from '../../../../hooks';

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
  wideImage,
  online,
  liveTalk,
  onClick,
}) => {
  const size = useContext(ResponsiveContext);
  const isSmallScreen = useIsMobileSize();

  if (isSmallScreen) {
    return (
      <Box className={style.mobile}>
        <BaseHabitatCard image={wideImage} logo={zooLogo} online={online} liveTalk={liveTalk}>
          <Box flex="grow">
            <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)}>
              <Heading level="4" margin="0px">{animal}</Heading>
            </Link>
            <Text size="medium" margin={{ top: 'small' }}>
              {description}
            </Text>
          </Box>
          <Box>
            {liveTalks.map((liveTalk) => (
              <Box flex="grow">
                <Box className={style.textBox}>
                  <Text size="xlarge" margin={{ bottom: 'xsmall', top: 'medium' }}>{liveTalk.title}</Text>
                  <Text margin={{ bottom: 'small' }}>{liveTalk.description}</Text>
                </Box>
                {liveTalk.sessions.map(({ startTime, sessionId }) => (
                  <div>
                    <PrimaryButton
                      size="small"
                      label={format(Date.parse(startTime), 'hh:mm aa')}
                      onClick={() => onClick(sessionId)}
                    />
                  </div>
                ))}
              </Box>
            ))}
          </Box>
        </BaseHabitatCard>
      </Box>
    );
  }

  const calcTime = (liveTalk) => {
    const { startTime: start, stopTime: end } = liveTalk.sessions[0];
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = `${(endTime - startTime) / (1000 * 60)} MINS`;
    const date = isSameDay(startTime, new Date()) ? 'Today' : `${format(startTime, 'EEE MMM d HH:mm aa')}`;

    return (
      <Text size="10px" weight={700} className={style.date}>
        {`${duration} | ${date}`.toUpperCase()}
      </Text>
    );
  }

  return (
    <Box className={style.scheduleItem}>
      <Box direction="row" className={style.header}>
        <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)} className={style.imageWrapper}>
          <HabitatImage image={habitatImage} />
          {/* We need to load this from the habitats, size contraints should be defined on api */}
          <div className={style.logo}>
            <img src={zooLogo} alt="" />
          </div>
        </Link>
        <Box justify="center" margin={{ left: 'medium' }} className={style.textWrapper}>
          <Link href={encodeURI(`/h/${zooSlug}/${habitatSlug}`)}>
            <Heading level="3" margin="0px">{animal}</Heading>
          </Link>
          <Text size="xlarge" margin={{ top: 'small' }} >
            {description}
          </Text>
        </Box>
      </Box>

      <Box className={style.body}>
        <Grid columns={size === 'large' && liveTalks.length > 1 ? ['50%', '50%'] : ['auto']}>
          {liveTalks.map((liveTalk, index) => (
            <Box
              flex="grow"
              pad={{
                right: size === 'large' && liveTalks.length > 1 && index === 0 ? '10px' : undefined,
                left: size === 'large' && index === 1 ? '10px' : undefined,
                top: size !== 'large' && index === 1 ? '20px' : undefined,
              }}
            >
              <Box className={style.textBox}>
                <Heading level="4" margin="0px">{liveTalk.title}</Heading>
                {calcTime(liveTalk)}
                <Text size="xlarge">
                  {liveTalk.description}
                </Text>
              </Box>
              <Grid gap ="xsmall" margin={{ top: 'auto' }} height="xxsmall" columns={['auto', 'auto', 'auto']} rows="xxsmall">
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
    </Box>
  );
};

export default ScheduleItem;
