import { h } from 'preact';
import {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'preact/hooks';
import { Menu, ResponsiveContext } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCog,
  faCogs,
  faLaughWink,
  faPowerOff,
  faImage,
} from '@fortawesome/pro-solid-svg-icons';

import StreamEditModalLoader from './EditModal/Loader';

import style from './style.scss';
import {
  EMOJI_SECTION,
  OVERLAY_SECTION,
  POWER_SECTION,
  CONFIGURATIONS,
  OFFLINE_IMAGE,
} from './constants';

const AdminButton = () => {
  const [openSection, setOpenSection] = useState();
  const size = useContext(ResponsiveContext);

  const onClose = useCallback(() => {
    setOpenSection(undefined);
  }, []);

  const items = useMemo(() => {
    const itemsArr = [{
      className: style.item,
      label: 'Power',
      icon: (
        <FontAwesomeIcon
          className={style.icon}
          icon={faPowerOff}
          size="lg"
        />
      ),
      onClick: () => setOpenSection(POWER_SECTION),
    }];

    if (size === 'large') {
      itemsArr.push({
        className: style.item,
        label: 'Emoji Drop',
        icon: (
          <FontAwesomeIcon
            className={style.icon}
            icon={faLaughWink}
            size="lg"
          />
        ),
        onClick: () => setOpenSection(EMOJI_SECTION),
      }, {
        className: style.item,
        label: 'Photo Overlay',
        icon: (
          <FontAwesomeIcon
            className={style.icon}
            icon={faCamera}
            size="lg"
          />
        ),
        onClick: () => setOpenSection(OVERLAY_SECTION),
      }, {
        className: style.item,
        label: 'Configuration',
        icon: (
          <FontAwesomeIcon
            className={style.icon}
            icon={faCogs}
            size="lg"
          />
        ),
        onClick: () => setOpenSection(CONFIGURATIONS),
      }, {
        className: style.item,
        label: 'Offline Image',
        icon: (
          <FontAwesomeIcon
            className={style.icon}
            icon={faImage}
            size="lg"
          />
        ),
        onClick: () => setOpenSection(OFFLINE_IMAGE),
      });
    }

    return itemsArr;
  }, [size]);

  return (
    <>
      <Menu
        plain
        className={style.adminButton}
        dropAlign={{ right: 'left' }}
        dropProps={{ margin: '0 0 0 -10px' }}
        icon={<FontAwesomeIcon icon={faCog} size="lg" color="white" />}
        items={items}
      />

      <StreamEditModalLoader openSection={openSection} onClose={onClose} />
    </>
  );
};

export default AdminButton;
