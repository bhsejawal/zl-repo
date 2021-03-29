import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Menu } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCog,
  faLaughWink,
  faPowerOff,
} from '@fortawesome/pro-solid-svg-icons';

import StreamEditModalLoader from './EditModal/Loader';

import style from './style.scss';
import { EMOJI_SECTION, OVERLAY_SECTION, POWER_SECTION } from './constants';

const AdminButton = () => {
  const [openSection, setOpenSection] = useState();

  const onClose = useCallback(() => {
    setOpenSection(undefined);
  }, []);

  return (
    <>
      <StreamEditModalLoader openSection={openSection} onClose={onClose} />

      <Menu
        plain
        className={style.adminButton}
        dropAlign={{ right: 'left' }}
        dropProps={{ margin: '0 0 0 -10px' }}
        icon={<FontAwesomeIcon icon={faCog} size="lg" color="white" />}
        items={[{
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
        }, {
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
        }]}
      />
    </>
  );
};

export default AdminButton;
