import { h } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {
  Box,
  Button,
  FormField,
  Grid,
  Heading,
  ResponsiveContext,
  Text,
  TextInput,
  Grommet,
} from 'grommet';
import { route } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeDropper, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { HexColorPicker } from "react-colorful";
import { PrimaryButton } from 'Components/Buttons';
import classnames from 'classnames';

import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { getIconKeys, getIconUrl } from 'Shared/profileIcons';

import backgroundImg from './profileBackground.png';

import { useIsInitiallyLoaded, useOnClickOutside } from '../../hooks';
import { getUser, updateUser } from './api';
import grommetTheme from '../../grommetTheme';
import { updateProfile } from './actions';

import 'react-colorful/dist/index.css';
import accountPageStyle from '../account/style.scss';
import style from './style.scss';

const icons = getIconKeys();
const colors = [
  '#FFB145',
  '#FF8A00',
  '#F85C14',
  '#CE0C0F',
  '#7D0555',
  '#FFA8EC',
  '#F569A4',
  '#C930A7',
  '#A129FF',
  '#5260DD',
  '#76A6F2',
  '#529ADD',
  '#368185',
  '#76ADAA',
];

const ColorItem = ({ color, selected, onClick }) => (
  <button
    type="button"
    aria-label="color"
    className={classnames(style.circleItem, { [style.selected]: selected })}
    onClick={() => onClick(color)}
    style={{ backgroundColor: color }}
  />
);

const IconItem = ({
  icon,
  selected,
  onClick,
  color,
}) => (
  <button
    type="button"
    aria-label="color"
    className={classnames(style.circleItem, style.animalIcon, { [style.selected]: selected })}
    onClick={() => onClick(icon)}
    style={{ backgroundColor: color }}
  >
    <div className={style.icon} style={{ backgroundImage: `url('${icon}')` }} />
  </button>
);

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
}) => {
  const pickerRef = useRef();
  const size = useContext(ResponsiveContext);
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState('#FFB145');
  const [icon, setIcon] = useState(icons[0]);
  const [username, setUsername] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const isCustomColor = useMemo(() => !colors.includes(color), [color]);
  const isInitiallyLoaded = useIsInitiallyLoaded(isLoading);

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

  // use only 3 columns for extra small screen on mobile phones
  const circlesGridConfig = useMemo(() => ({
    columns: size !== 'xsmall'
      ? ['xxsmall', 'xxsmall', 'xxsmall', 'xxsmall', 'xxsmall']
      : ['xxsmall', 'xxsmall', 'xxsmall'],
    gap: { column: '25px', row: '20px' },
  }), [size]);

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
        route('/map');
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

  const onPickerBtn = () => {
    setIsPickerOpen(true);
  };

  const onPickerCloseBtn = useCallback((evt) => {
    evt.stopPropagation();
    setIsPickerOpen(false);
  }, []);

  useOnClickOutside(pickerRef, onPickerCloseBtn);

  return (
    <Box
      className={classnames(style.container, { [style.step]: step })}
      background={background}
      overflow="auto"
    >
      <Grommet
        theme={grommetTheme}
        className={style.wrapper}
      >
        <div className={style.pickSection}>
          <Box>
            <Box>
              <Text margin={{ bottom: 'small' }} size="xlarge">
                Pick your favorite colour:
              </Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Grid {...circlesGridConfig}>
                {colors.map((col) => (
                  <ColorItem
                    key={col}
                    selected={color === col}
                    color={col}
                    onClick={setColor}
                  />
                ))}

                <div className={style.colorPickerWrapper}>
                  <button
                    type="button"
                    aria-label="close picker"
                    className={classnames(
                      style.pickerBtn,
                      { [style.selected]: isCustomColor },
                    )}
                    // set color only if it's not in the list
                    style={{ backgroundColor: !isCustomColor ? undefined : color }}
                    onClick={onPickerBtn}
                  >
                    <FontAwesomeIcon
                      icon={faEyeDropper}
                      color={!isCustomColor ? 'var(--grey)' : '#fff'}
                    />
                  </button>
                  {isPickerOpen && (
                    <div ref={pickerRef} className={style.picker}>
                      <div>
                        <p>Pick a custom color:</p>
                        <Button
                          icon={<FontAwesomeIcon icon={faTimes} />}
                          onClick={onPickerCloseBtn}
                        />
                      </div>
                      <HexColorPicker color={color} onChange={setColor} />
                    </div>
                  )}
                </div>
              </Grid>
            </Box>

            <Box>
              <Text margin={{ top: 'large', bottom: 'small' }} size="xlarge">
                And your favorite animal:
              </Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Grid {...circlesGridConfig}>
                {icons.map((ico) => (
                  <IconItem
                    key={ico}
                    selected={icon === ico}
                    icon={getIconUrl(ico)}
                    onClick={() => setIcon(ico)}
                    color={color}
                  />
                ))}
              </Grid>
            </Box>
          </Box>
        </div>
        <div className={style.divider} />
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
                  {/* cheking for .svg as because the type was changed */}
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
      </Grommet>
    </Box>
  );
};

export default connect(
  ({ user }) => ({ user }),
  {
    updateProfileAction: updateProfile,
    openTermsModalAction: openTermsModal,
  },
)(Profile);
