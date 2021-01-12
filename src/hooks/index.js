import { useEffect, useState } from 'preact/hooks';

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
});

// eslint-disable-next-line import/prefer-default-export
export const useWindowResize = () => {
  const [size, setSize] = useState(getSize());

  useEffect(() => {
    const updateSize = () => setSize(getSize());
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};
