import { route } from 'preact-router';
import { useMemo } from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Grid,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';

import { PrimaryButton } from 'Components/Buttons';
import { buildURL, post } from 'Shared/fetch';

import { setUserData } from '../../redux/actions';

import style from './style.module.scss';

const FreemiumOnboarding = ({
  allHabitats,
  freeHabitat,
  isFreemiumOnboarded,
  setUserDataAction,
}) => {
  const selectedHabitat = useMemo(() => allHabitats.find(
    ({ _id }) => _id === freeHabitat,
  ), [allHabitats, freeHabitat]);

  const paidHabitats = allHabitats.filter(({ _id }) => _id !== freeHabitat).slice(0, 10);

  const goToHabitat = async () => {
    if (!isFreemiumOnboarded) {
      try {
        const { user } = await post(buildURL('/users/freemiumOnboarding'));
        setUserDataAction(user);
      } catch (err) {
        console.error('Failed to update user entered freemium onboarded flag', err)
      }
    }

    route(`/h/${selectedHabitat?.zoo?.slug}/${selectedHabitat?.slug}`, true);
  }

  if (!selectedHabitat) {
    return null;
  }

  return (
    <Box className={style.gradientBackground} align="center">
      <Box
        background="white"
        className={style.freeHabitatContainer}
        align="center"
        justify="center"
        fill="horizontal"
        pad={{ horizontal: '43.8px' }}
      >
        <Box className={style.imageWrapper}>
          <img src={selectedHabitat.profileImage} alt="free habitat" />
        </Box>
        <Heading level="4" color="var(--charcoal)">Your free habitat:</Heading>
        <Heading level="2" color="var(--logoBlue)" textAlign="center">{selectedHabitat.title}</Heading>
        <Box pad={{ horizontal: '77px' }} margin={{ top: '44px' }} justify="center" align="center">
          <PrimaryButton label="Enter Habitat" onClick={goToHabitat} />
        </Box>
      </Box>

      <Box className={style.unlockContainer} fill="horizontal" margin={{ top: '30px' }}>
        <Box
          className={style.unlockTitleContainer}
          direction="row"
          align="center"
          justify="center"
        >
          <FontAwesomeIcon icon={faLockAlt} />
          <Text size="xlarge" color="var(--charcoal)">
            Upgrade to unlock all animals.
          </Text>
        </Box>
        <Grid
          className={style.paidHabitatsContainer}
          rows={['auto', 'auto']}
          columns={['auto', 'auto', 'auto', 'auto', 'auto']}
        >
          {paidHabitats.map(({ profileImage }) => (
            <Box>
              <img src={profileImage} alt="habitat" />
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default connect((
  { allHabitats, user: { subscription: { freeHabitat }, isFreemiumOnboarded } },
) => (
  { allHabitats, freeHabitat, isFreemiumOnboarded }
), {
  setUserDataAction: setUserData,
})(FreemiumOnboarding);
