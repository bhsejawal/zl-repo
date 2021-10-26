import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import { Layer, Box, Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import CloseButton from 'Components/modals/CloseButton';

import { closeModalAlbum } from '../actions';
import grommetTheme from '../../../../../../grommetTheme';
import Album from '../../../Album';

import style from './style.scss';

const fullLayerTheme = deepMerge(grommetTheme, {
  layer: {
    container: {
      extend: {
        maxWidth: 'auto',
        maxHeight: 'auto',
      },
    },
  },
});

const AlbumModal = ({ closeAction }) => {
  // close on unmount
  useEffect(() => () => {
    closeAction();
  }, [closeAction]);

  return (
    <Grommet theme={fullLayerTheme}>
      <Layer full onEsc={closeAction} background={{ color: '#F4F4F4' }}>
        <Box fill className={style.container}>
          <CloseButton onClick={closeAction} className={style.close} />
          <Box fill>
            <Album mobile />
          </Box>
        </Box>
      </Layer>
    </Grommet>
  );
};

export default connect(
  null,
  { closeAction: closeModalAlbum },
)(AlbumModal);
