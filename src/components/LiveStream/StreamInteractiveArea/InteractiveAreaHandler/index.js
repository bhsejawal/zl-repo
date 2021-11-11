import {
  useCallback,
  useRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { createPortal } from 'preact/compat';

import { GlobalsContext } from 'Shared/context';
import { buildURL, post } from 'Shared/fetch';
import ClickMessageTip from 'Components/ClickMessageTip';

import { addUserInteraction, updateUserProperty } from '../../../../redux/actions';

import CustomCursor from '../CustomCursor';
import { useCursorHook } from '../CustomCursor/hooks';

import style from './style.scss';

import { FULL_CURSOR, LOADING } from '../CustomCursor/constants';
import {getConfig} from '../../../../helpers';
import { useIsMobileSize } from '../../../../hooks';

const validDropTypes = ['emoji'];

const CursorPortal = ({ children }) => createPortal(children, document.body);

const InteractiveAreaHandler = ({
  cameraId,
  userId,
  habitatId,
  animal,
  color,
  emojis,
  configs,
  streamStarted,
  isStreamClicked,
  addUserInteractionAction,
  updateUserPropertyAction,
}) => {
  const { socket } = useContext(GlobalsContext);
  const ownCursorRef = useRef(null);
  const containerRef = useRef(null);
  const [cursorState, setCursorState] = useState(FULL_CURSOR);
  const isMobileSize = useIsMobileSize();

  useCursorHook({ containerRef, ownCursorRef });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (cursorState === LOADING) {
      const timeout = setTimeout(() => setCursorState(FULL_CURSOR), getConfig(configs, 'ptu.votingTime').configValue);
      return () => {
        setCursorState(FULL_CURSOR);
        clearTimeout(timeout);
      }
    }
  }, [cursorState, configs]);

  useEffect(() => {
    if (socket) {
      socket.on('propagateClick', (clickData) => addUserInteractionAction({ ...clickData }));

      //  type is here to support cross emotes from twitch, we can remove this later
      socket.on('emoji', (emoteData) => addUserInteractionAction({ ...emoteData, type: 'emoji' }));
    }

    return () => {
      if (socket) {
        socket.off('propagateClick', (clickData) => addUserInteractionAction({ ...clickData }));
      }
    };
  }, [socket, addUserInteractionAction]);

  const onClickHandler = useCallback((evt) => {
    if (cursorState === LOADING) {
      return;
    }

    const { clientX, clientY } = evt;
    const { top: topSpacing, left: leftSpacing } = containerRef.current.getBoundingClientRect();

    const normalizedX = (clientX - leftSpacing) / containerRef.current.offsetWidth;
    const normalizedY = (clientY - topSpacing) / containerRef.current.offsetHeight;

    socket.emit('userClickedStream', {
      habitatId,
      cameraId,
      userId,
      animal,
      color,
      normalizedX: normalizedX.toPrecision(3),
      normalizedY: normalizedY.toPrecision(3),
      type: 'click',
    });

    setCursorState(LOADING);
    if (!isStreamClicked) {
      post(buildURL('users/steps'), { step: 'isStreamClicked', value: true })
        .then((data) => updateUserPropertyAction(data))
        .catch((err) => console.error('Error while updating stream click indicator', err));
    }
  }, [
    socket,
    animal,
    habitatId,
    color,
    userId,
    cameraId,
    cursorState,
    isStreamClicked,
    updateUserPropertyAction,
  ]);

  const availableEmojis = useMemo(
    () => emojis.reduce((acc, { items = [] } = {}) => [...acc, ...items], []),
    [emojis],
  );

  const onDrop = (evt) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('type');

    if (!validDropTypes.includes(type)) {
      return;
    }

    const url = evt.dataTransfer.getData('text');

    const { offsetHeight, offsetWidth } = containerRef.current;
    const { top: topSpacing, left: leftSpacing } = containerRef.current.getBoundingClientRect();
    const x = (evt.clientX - leftSpacing) / offsetWidth;
    const y = (evt.clientY - topSpacing) / offsetHeight;

    if (type === 'emoji') {
      const path = (new URL(url)).pathname;
      const decodedUrl = decodeURI(url);
      if (availableEmojis.includes(decodedUrl)) {
        addUserInteractionAction({
          x: x * 100,
          y: y * 100,
          type,
          path,
        });

        socket.emit('userDroppedEmoji', {
          userId,
          habitatId,
          cameraId,
          path,
          x: x * 100,
          y: y * 100,
        });
      }
      return;
    }

    console.warn('Interactive Handler does not have support for the dropped element');
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
  };

  return (
    //  eslint-disable-next-line
    <div
      className={style.CursorArea}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseDown={onClickHandler}
    >
      <div
        id="CursorsContainer"
        className={style.CursorsContainer}
        ref={containerRef}
      >
        {streamStarted && !isStreamClicked && (
          <div className={style.clickIndicator}>
            <ClickMessageTip align={{ bottom: 'top' }} text={`${isMobileSize ? 'Tap' : 'Click'} to move!`} />
          </div>
        )}

        <CursorPortal>
          <div ref={ownCursorRef} className={style.ownCursor} >
            <CustomCursor cursorState={cursorState} color={color} animal={animal} />
          </div>
        </CursorPortal>
      </div>
    </div>
  );
};

export default connect(({
  user: {
    userId,
    profile: {
      animalIcon: animal,
      color,
    },
    isStreamClicked,
  },
  habitat: {
    habitatInfo: {
      _id: habitatId,
      emojiDrops: emojis = [],
      selectedCamera: { configs, _id: cameraId },
      streamStarted,
    },
  },
}) => ({
  userId,
  cameraId,
  animal,
  color,
  habitatId,
  emojis,
  configs,
  isStreamClicked,
  streamStarted,
}), {
  addUserInteractionAction: addUserInteraction,
  updateUserPropertyAction: updateUserProperty,
})(InteractiveAreaHandler);
