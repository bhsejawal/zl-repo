import { useContext, useEffect, useState } from 'preact/hooks';
import { throttle } from 'lodash-es';
import { ResponsiveContext } from 'grommet';

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
});

export const useWindowResize = () => {
  const [size, setSize] = useState(typeof window !== 'undefined' && getSize());

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const updateSize = throttle(() => {
      setSize(getSize());

      // iPad/iPhone full height is ~98vh because they count the space under the browser controls
      // this will calculate --vh variabel for actual view port for more accuracy
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 400);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
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

export const useIsHabitatTabbed = () => {
  const { width: windowWidth } = useWindowResize();
  return windowWidth <= 1024;
};
