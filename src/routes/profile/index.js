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
import { isEmpty } from 'lodash-es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeDropper, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { HexColorPicker } from "react-colorful";
import { PrimaryButton } from 'Components/Buttons';
import classnames from 'classnames';

import { openTermsModal } from 'Components/TermsAndConditions/actions';

import backgroundImg from '../../assets/profileBackground.svg';
import animal1 from '../../assets/profileIcons/animal1.svg';
import animal2 from '../../assets/profileIcons/animal2.svg';
import animal3 from '../../assets/profileIcons/animal3.svg';
import animal4 from '../../assets/profileIcons/animal4.svg';
import animal5 from '../../assets/profileIcons/animal5.svg';
import animal6 from '../../assets/profileIcons/animal6.svg';
import animal7 from '../../assets/profileIcons/animal7.svg';
import animal8 from '../../assets/profileIcons/animal8.svg';
import animal9 from '../../assets/profileIcons/animal9.svg';
import animal10 from '../../assets/profileIcons/animal10.svg';
import animal11 from '../../assets/profileIcons/animal11.svg';
import animal12 from '../../assets/profileIcons/animal12.svg';
import animal13 from '../../assets/profileIcons/animal13.svg';
import animal14 from '../../assets/profileIcons/animal14.svg';
import animal15 from '../../assets/profileIcons/animal15.svg';

import { useIsInitiallyLoaded, useOnClickOutside } from '../../hooks';
import { getUser, updateUser } from './api';
import grommetTheme from '../../grommetTheme';
import { updateProfile } from './actions';

import 'react-colorful/dist/index.css';
import accountPageStyle from '../account/style.scss';

import style from './style.scss';

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
const icons = [
  animal1,
  animal2,
  animal3,
  animal4,
  animal5,
  animal6,
  animal7,
  animal8,
  animal9,
  animal10,
  animal11,
  animal12,
  animal13,
  animal14,
  animal15,
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

const IconItem = ({ icon, selected, onClick }) => (
  <button
    type="button"
    aria-label="color"
    className={classnames(style.circleItem, style.animalIcon, { [style.selected]: selected })}
    onClick={() => onClick(icon)}
  >
    <div className={style.icon} style={{ backgroundImage: `url('${icon}')` }} />
  </button>
);

const background = {
  image: `url('${backgroundImg}')`,
  size: 'unset',
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
  const [icon, setIcon] = useState(animal1);
  const [nickname, setNickname] = useState();
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
  }, [color, icon, nickname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { profile } = await getUser();
        if (!isEmpty(profile)) {
          setColor(profile.color);
          setIcon(profile.animalIcon);
          setNickname(profile.nickname);
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

  const onNicknameChange = ({ target }) => {
    setNickname(target.value);
  };

  const onClickHandler = async () => {
    try {
      if (nickname.match(/\s/)) {
        setErrorMsg('Nickname cannot have spaces');
        return;
      }
      setIsLoading(true);
      await updateUser(color, icon, nickname);
      updateProfileAction(color, icon, nickname);

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
    >
      <Grommet
        theme={grommetTheme}
        className={style.wrapper}
      >
        <div className={style.pickSection}>
          <Box>
            <Box>
              <Text margin={{ bottom: 'small' }}>
                Pick your favourite colour:
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
              <Text margin={{ top: 'large', bottom: 'small' }}>
                And your favourite animal:
              </Text>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Grid {...circlesGridConfig}>
                {icons.map((ico) => (
                  <IconItem
                    key={ico}
                    selected={icon === ico}
                    icon={ico}
                    onClick={setIcon}
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
              <Heading size="20px" level="4" color="var(--grey)" margin={{ bottom: 'xsmall', top: '0' }}>
                Step 2 of 2
              </Heading>
            )}
            <Heading size="45px" level="1" margin={{ top: '0' }}>
              {step ? 'Create your character:' : 'My Character:'}
            </Heading>
            <Text size="16px">This is how the Zoolife community will see you.</Text>

            <div className={style.largeImgWrapper}>
              {isInitiallyLoaded && (
                <div className={style.largeImg} style={{ backgroundColor: color }}>
                  <img src={icon} alt="avatar" />
                </div>
              )}
              {!isInitiallyLoaded && <FontAwesomeIcon icon={faSpinner} size="2x" spin />}
            </div>

            <FormField height="120px" margin={{ bottom: '0' }} error={errorMsg} label="Your Nickname:" htmlFor="nickname">
              <TextInput id="nickname" value={nickname} onChange={onNicknameChange} />
            </FormField>

            <Box align="start" margin={{ top: 'small' }}>
              <PrimaryButton
                className={!step ? accountPageStyle.updateButton : undefined}
                loading={isLoading}
                label={step ? 'Enter Zoolife!' : 'Save Changes'}
                onClick={onClickHandler}
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
