import { useContext, useEffect, useState } from 'preact/hooks';
import { throttle } from 'lodash-es';
import { ResponsiveContext } from 'grommet';

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
});

// eslint-disable-next-line import/prefer-default-export
export const useWindowResize = () => {
  const [size, setSize] = useState(getSize());

  useEffect(() => {
    const updateSize = throttle(() => setSize(getSize()), 400);
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export const useOnClickOutside = (ref, handler) => {
  useEffect(
    () => {
      const listener = (evt) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(evt.target)) {
          return;
        }

        handler(evt);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    [ref, handler],
  );
};

// this will return false only before initial fetch
export const useIsInitiallyLoaded = (isFetching) => {
  const [loaded, setLoaded] = useState();

  useEffect(() => {
    if (loaded !== undefined && !isFetching) {
      setLoaded(true);
    } else if (isFetching) {
      setLoaded(false);
    }
  }, [isFetching]);

  return !isFetching && loaded;
};

export const useIsMobileSize = () => {
  const size = useContext(ResponsiveContext);
  return ['small', 'xsmall'].includes(size);
};
