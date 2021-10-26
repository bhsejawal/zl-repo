import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { connect } from 'react-redux';
import { Heading, Text, Box } from 'grommet';

import HabitatMobileCard from './HabitatMobileCard';
import background from './mapFooter.png';
import headerImage from './mapHeader.png';

import style from '../style.scss';

const Map = ({ allHabitats, onShowTrailer }) => {
  const onlineHabitats = useMemo(() => allHabitats.filter(
    (habitat) => (habitat.online && !habitat.liveTalk),
  ), [allHabitats]);

  const liveTalkHabitats = useMemo(() => allHabitats.filter(
    (habitat) => (habitat.liveTalk),
  ), [allHabitats]);

  const offlineHabitats = useMemo(() => allHabitats.filter(
    (habitat) => (!habitat.liveTalk && !habitat.online),
  ), [allHabitats]);

  return (
    <Box className={style.map}>
      <img src={background} className={style.bottomImage} alt="Map Top" />
      <img src={headerImage} className={style.headerImage} alt="Map Background" />
      <Box pad={{ horizontal: "20px", top: '90px', bottom: '20px' }} style={{ zIndex: 2 }} height={{ min: 'fit-content'}} >
        <Box
          background="white"
          style={{ borderRadius: '10px'}}
          pad={{ horizontal: '30px' }}
          height={{ min: 'fit-content'}}
        >
          <Heading level="2">Explore the animal kingdom.</Heading>
          <Text size="xlarge" color="var(--charcoal)">Start by selecting an animal</Text>
          {liveTalkHabitats.length > 0 && (
            <Box height={{ min: 'fit-content'}}>
              <Heading level="3">Live Talks</Heading>
              <Box height={{ min: 'fit-content'}}>
                {liveTalkHabitats.map((habitat) => (
                  <HabitatMobileCard habitat={habitat} onShowTrailer={onShowTrailer} />
                ))}
              </Box>
            </Box>
          )}
          {onlineHabitats.length > 0 && (
            <Box height={{ min: 'fit-content'}}>
              <Heading level="3">Online</Heading>
              <Box flexGrow="1" height={{ min: 'fit-content'}}>
                {onlineHabitats.map((habitat) => (
                  <HabitatMobileCard habitat={habitat} onShowTrailer={onShowTrailer} />
                ))}
              </Box>
            </Box>
          )}
          {offlineHabitats.length > 0 && (
            <Box height={{ min: 'fit-content'}} >
              <Heading level="3">Offline</Heading>
              <Box height={{ min: 'fit-content'}}>
                {offlineHabitats.map((habitat) => (
                  <HabitatMobileCard habitat={habitat} isOffline onShowTrailer={onShowTrailer} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
};
export default connect(
  ({
    allHabitats,
  }) => ({
    allHabitats,
  }),
)(Map);
