import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'grommet';

import CardEditorLoader from '../../CardEditor/CardEditorLoader';

import style from './style.scss';

const CreateCardButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const onBtnClick = () => {
    setModalOpen(true);
  };

  const onClose = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <>
      <div className={style.card}>
        <div>
          <Button
            onClick={onBtnClick}
            icon={<FontAwesomeIcon icon={faPlus} color="var(--lightBlue)" />}
            label="New"
            color="var(--lightBlue)"
          />
        </div>
      </div>

      {/* TODO: maybe we should even elevate this to the top level with portals */}
      <CardEditorLoader
        open={modalOpen}
        onClose={onClose}
      />
    </>
  );
};

export default CreateCardButton
