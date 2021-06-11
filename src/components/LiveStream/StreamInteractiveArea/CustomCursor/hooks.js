/* eslint-disable no-param-reassign */
import { useEffect, useRef } from 'preact/hooks';

// eslint-disable-next-line import/prefer-default-export
export const useCursorHook = ({ containerRef, ownCursorRef }) => {
  const isTouchRef = useRef();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (containerRef.current && ownCursorRef?.current) {
      const onLeave = () => {
        if (!isTouchRef.current) {
          ownCursorRef.current.style.opacity = 0;
        }
      };

      const onEnter = () => {
        if (!isTouchRef.current) {
          ownCursorRef.current.style.opacity = 1;
        }
      };

      const onMove = (event) => {
        if (!isTouchRef.current) {
          ownCursorRef.current.style.top = `${event.clientY}px`;
          ownCursorRef.current.style.left = `${event.clientX}px`;
        }
      };

      const onTouch = () => {
        isTouchRef.current = true;
      }

      containerRef.current.addEventListener('mouseleave', onLeave);
      containerRef.current.addEventListener('mouseenter', onEnter);
      containerRef.current.addEventListener('mousemove', onMove);
      // we need this for touch devices to fix the bug where
      // cursor stays after touching the stream
      containerRef.current.addEventListener('touchstart', onTouch);
      const el = containerRef.current;

      return () => {
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('touchstart', onTouch);
      };
    }
  }, [ownCursorRef, containerRef]);

  useEffect(() => {
    containerRef.current.style.cursor = 'none';
    const el = containerRef.current;
    return () => {
      delete el.style.cursor;
    };
  }, [containerRef]);
};
