import { useContext, useEffect, useState } from 'preact/hooks';
import { throttle } from 'lodash-es';
import { ResponsiveContext } from 'grommet';

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
});

const calculateViewHeight = () => {
  // iPad/iPhone full height is ~98vh because they count the space under the browser controls
  // this will calculate --vh variable for actual view port for more accuracy
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export const useWindowResize = () => {
  const [size, setSize] = useState(typeof window !== 'undefined' && getSize());

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    calculateViewHeight();
    const updateSize = throttle(() => {
      setSize(getSize());
      calculateViewHeight();
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

export const useOnScreen = (ref, rootMargin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []);
  return isIntersecting;
}

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
