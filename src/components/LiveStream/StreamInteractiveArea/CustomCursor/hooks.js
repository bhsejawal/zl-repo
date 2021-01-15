/* eslint-disable no-param-reassign */
import { useEffect } from 'preact/hooks';
// eslint-disable-next-line import/prefer-default-export
export const useCursorHook = ({ containerRef, ownCursorRef }) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (containerRef.current && ownCursorRef?.current) {
      const onLeave = () => {
        ownCursorRef.current.style.opacity = 0;
      };

      const onEnter = () => {
        ownCursorRef.current.style.opacity = 1;
      };

      const onMove = (event) => {
        ownCursorRef.current.style.top = `${event.clientY}px`;
        ownCursorRef.current.style.left = `${event.clientX}px`;
      };

      containerRef.current.addEventListener('mouseleave', onLeave);
      containerRef.current.addEventListener('mouseenter', onEnter);
      containerRef.current.addEventListener('mousemove', onMove);

      return () => {
        containerRef.current.removeEventListener('mouseleave', onLeave);
        containerRef.current.removeEventListener('mouseenter', onEnter);
        containerRef.current.removeEventListener('mousemove', onMove);
      };
    }
  }, [ownCursorRef, containerRef]);

  useEffect(() => {
    containerRef.current.style.cursor = 'none';
    return () => {
      delete containerRef.current.style.cursor;
    };
  }, [containerRef]);
};
