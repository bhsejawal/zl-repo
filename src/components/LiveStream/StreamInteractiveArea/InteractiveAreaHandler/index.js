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

import { GlobalsContext } from '../../../../context';

import { addUserInteraction } from '../../../../redux/actions';

import CustomCursor from '../CustomCursor';
import { useCursorHook } from '../CustomCursor/hooks';

import style from './style.scss';

import { FULL_CURSOR, LOADING, DEFAULT_CURSOR_DELAY } from '../CustomCursor/constants';

const validDropTypes = ['emoji', 'cursorPin'];

const CursorPortal = ({ children }) => createPortal(children, document.body);

const InteractiveAreaHandler = ({
  userId,
  channelId,
  animal,
  color,
  emojis,
  addUserInteractionAction,
}) => {
  const { socket } = useContext(GlobalsContext);
  const ownCursorRef = useRef(null);
  const containerRef = useRef(null);
  const [cursorState, setCursorState] = useState(FULL_CURSOR);

  useCursorHook({ containerRef, ownCursorRef });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (cursorState === LOADING) {
      const timeout = setTimeout(() => setCursorState(FULL_CURSOR), DEFAULT_CURSOR_DELAY);
      return () => {
        setCursorState(FULL_CURSOR);
        clearTimeout(timeout);
      }
    }
  }, [cursorState]);

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
      room: channelId,
      userId,
      animal,
      color,
      normalizedX: normalizedX.toPrecision(3),
      normalizedY: normalizedY.toPrecision(3),
      type: 'click',
    });

    setCursorState(LOADING);
  }, [socket, animal, channelId, color, userId, cursorState]);

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

    if (type === 'cursorPin') {
      // This is under validation, so we're not supporting multiple
      // colors/animals yet
      socket.emit('userClickedStream', {
        room: channelId,
        userId,
        token: '',
        normalizedX: x.toPrecision(3),
        normalizedY: y.toPrecision(3),
        type,
      });

      return;
    }

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

        socket.emit('emoji', {
          userId,
          channelId,
          // cameraId: '',
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
      onClick={onClickHandler}
    >
      <div id="CursorsContainer" className={style.CursorsContainer} ref={containerRef}>
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
  user: { viewer: { userId, animal, color }},
  mainStream: { channelId, emojis },
}) => ({
  userId,
  animal,
  color,
  channelId,
  emojis,
}), {
  addUserInteractionAction: addUserInteraction,
})(InteractiveAreaHandler);
