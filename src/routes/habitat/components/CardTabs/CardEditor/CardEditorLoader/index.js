import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { Grommet, Layer } from 'grommet';

import Loader from 'Components/async/Loader';
import grommetTheme from '../../../../../../grommetTheme';

const EditModal = lazy(() => import('./EditModal'));

const CardEditorLoader = ({ open, card, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <Grommet theme={grommetTheme}>
      <Layer margin="20px" onClickOutside={onClose}>
        <Suspense fallback={<Loader />}>
          <EditModal
            card={card}
            onClose={onClose}
          />
        </Suspense>
      </Layer>
    </Grommet>
  );
};

export default CardEditorLoader;
