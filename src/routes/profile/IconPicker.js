import classnames from 'classnames';
import {
  Box,
  Button,
  Grid,
  ResponsiveContext,
  Text,
} from 'grommet';
import {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeDropper, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { HexColorPicker } from 'react-colorful';
import { getIconKeys, getIconUrl } from 'Shared/profileIcons';
import { useOnClickOutside } from '../../hooks';

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

const replacementColor = '#477652';

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
  color,
  selected,
  onClick,
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

const IconPicker = ({
  icon,
  color,
  setColor,
  setIcon,
  showColorPicker,
}) => {
  const size = useContext(ResponsiveContext);
  const pickerRef = useRef();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const isCustomColor = useMemo(() => !colors.includes(color), [color]);

  // use only 3 columns for extra small screen on mobile phones
  const circlesGridConfig = useMemo(() => ({
    columns: size !== 'xsmall'
      ? ['xxsmall', 'xxsmall', 'xxsmall', 'xxsmall', 'xxsmall']
      : ['xxsmall', 'xxsmall', 'xxsmall'],
    gap: { column: '25px', row: '20px' },
  }), [size]);

  const onPickerBtn = () => {
    setIsPickerOpen(true);
  };

  const onPickerCloseBtn = useCallback((evt) => {
    evt.stopPropagation();
    setIsPickerOpen(false);
  }, []);

  useOnClickOutside(pickerRef, onPickerCloseBtn);

  return (
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

          {showColorPicker && (
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
          )}

          {!showColorPicker && (
            <ColorItem
              key={replacementColor}
              selected={color === replacementColor}
              color={replacementColor}
              onClick={setColor}
            />
          )}
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
  );
};

export default IconPicker;
