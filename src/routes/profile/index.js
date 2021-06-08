import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Box,
  Button,
  FormField,
  Heading,
  Text,
  TextInput,
  Layer,
} from 'grommet';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { PrimaryButton } from 'Components/Buttons';
import classnames from 'classnames';
import useFetch from 'use-http';

import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { getIconKeys, getIconUrl } from 'Shared/profileIcons';
import { buildURL } from 'Shared/fetch';
import { logPageViewGA } from 'Shared/ga';
import backgroundImg from './profileBackground.png';

import { useIsInitiallyLoaded, useWindowResize } from '../../hooks';
import { getUser, updateUser } from './api';
import { updateProfile } from './actions';
import { setSubscriptionData } from '../../redux/actions';
import { logPageView } from '../../helpers';

import 'react-colorful/dist/index.css';
import accountPageStyle from '../account/style.scss';
import style from './style.scss';
import IconPicker from './IconPicker';

const background = {
  image: `url('${backgroundImg}')`,
  size: '25vw',
  position: 'bottom left',
  repeat: 'no-repeat',
  attachment: 'fixed',
};

const Profile = ({
  step,
  user,
  updateProfileAction,
  openTermsModalAction,
  setSubscriptionDataAction,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState('#FFB145');
  const [icon, setIcon] = useState(getIconKeys()[0]);
  const [username, setUsername] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [showModal, setShowModal] = useState();
  const isInitiallyLoaded = useIsInitiallyLoaded(isLoading);
  const { width } = useWindowResize();
  const isSmallScreen = width <= 800; // this threshold is based on the component layout

  const {
    post,
    response,
  } = useFetch(buildURL('/users/subscription/startTrial'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (user && !user?.termsAccepted) {
      openTermsModalAction();
    }
  }, [user, openTermsModalAction]);

  useEffect(() => {
    setErrorMsg(undefined);
  }, [color, icon, username]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { profile, username } = await getUser();
        setUsername(username);
        if (profile?.color) {
          setColor(profile.color);
        }
        if (profile?.animalIcon) {
          setIcon(profile.animalIcon);
        }
      } catch (err) {
        // TODO: display an error somewhere when we have UI designs for it
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const onUsernameChange = ({ target }) => {
    setUsername(target.value);
  };

  const onClickHandler = async () => {
    try {
      if (username.match(/\s/)) {
        setErrorMsg('Username cannot have spaces');
        return;
      }

      if (username.length > 20) {
        setErrorMsg('Username should be between 1 and 20 characters')
        return;
      }

      setIsLoading(true);
      await updateUser(color, icon, username);
      updateProfileAction(color, icon, username);

      if (step) {
        if (user.role === 'user' && !user.subscription?.productId) {
          const subscriptionData = await post();
          if (response.ok) {
            setSubscriptionDataAction(subscriptionData);
            logPageView('/trialStarted');
            logPageViewGA('/trialStarted');
            route('/map');
          }

          if (response.data?.error) {
            setErrorMsg(response.data.error);
          }
        } else {
          route('/map');
        }
      }
    } catch (err) {
      console.error(err);
      if (err.body?.error) {
        setErrorMsg(err.body.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      className={classnames(style.container, { [style.step]: step })}
      background={background}
      overflow="auto"
    >
      <Box
        className={style.wrapper}
      >
        {!isSmallScreen && (
          <>
            <div className={style.pickSection}>
              <IconPicker
                icon={icon}
                color={color}
                setColor={setColor}
                setIcon={setIcon}
                showColorPicker={true}
              />
            </div>
            <div className={style.divider} />
          </>
        )}
        <div className={style.characterSection}>
          <Box>
            {step && (
              <Heading level="4" color="var(--grey)" margin={{ bottom: 'xsmall', top: '0' }}>
                Step 2 of 2
              </Heading>
            )}
            <Heading level="2" margin={{ top: '0' }}>
              {step ? 'Create your character:' : 'My Character:'}
            </Heading>
            <Text size="xlarge">This is how the Zoolife community will see you.</Text>

            <div className={style.largeImgWrapper}>
              {isInitiallyLoaded && (
                <div className={style.largeImg} style={{ backgroundColor: color }}>
                  {isSmallScreen && (
                    <Button
                      plain
                      margin="medium"
                      onClick={() => setShowModal(true)}
                      icon={<FontAwesomeIcon icon={faPencil} />}
                    />
                  )}
                  {/* checking for .svg as because the type was changed */}
                  {/* old version had Webpack generated path */}
                  {/* we can remove this in future */}
                  {/* NOTE: this will not work locally which is fine */}
                  <img src={icon.endsWith('.svg') ? icon : getIconUrl(icon)} alt="avatar" />
                </div>
              )}
              {!isInitiallyLoaded && <FontAwesomeIcon icon={faSpinner} size="2x" spin />}
            </div>

            <FormField height="120px" margin={{ bottom: '0' }} error={errorMsg} label="Your Username:" htmlFor="username">
              <TextInput id="username" value={username} onChange={onUsernameChange} />
            </FormField>

            <Box align="start" margin={{ top: 'small' }}>
              <PrimaryButton
                className={!step ? accountPageStyle.updateButton : undefined}
                loading={isLoading}
                label={step ? 'Enter Zoolife!' : 'Save Changes'}
                onClick={onClickHandler}
                disabled={username?.length === 0}
              />
            </Box>
          </Box>
        </div>
      </Box>
      {isSmallScreen && showModal && (
        <Layer background="rgba(0, 0, 0, 0.65)">
          <div className={style.modalContainer}>
            <Button
              className={style.close}
              plain
              onClick={() => setShowModal(false)}
              icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
            />
            <div className={style.pickSection}>
              <IconPicker
                icon={icon}
                color={color}
                setColor={setColor}
                setIcon={setIcon}
              />
              <Box align="end" margin={{ top: '30px' }}>
                <PrimaryButton
                  loading={isLoading}
                  label="Apply"
                  onClick={() => setShowModal(false)}
                />
              </Box>
            </div>
          </div>
        </Layer>
      )}
    </Box>
  );
};

export default connect(
  ({ user }) => ({ user }),
  {
    updateProfileAction: updateProfile,
    openTermsModalAction: openTermsModal,
    setSubscriptionDataAction: setSubscriptionData,
  },
)(Profile);
