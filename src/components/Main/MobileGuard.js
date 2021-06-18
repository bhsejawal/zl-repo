import { cloneElement, toChildArray } from 'preact';
import { route } from 'preact-router';
import { useEffect, useMemo } from 'preact/hooks';

import { getDeviceType, isDev } from '../../helpers';

const MobileGuard = ({ children, ...props }) => {
  const deviceType = useMemo(() => getDeviceType(), []);

  useEffect(() => {
    if (deviceType === 'phone' && !isDev()) {
      route('/mobile', true);
    }
  }, [deviceType]);

  if (deviceType === 'phone' && !isDev()) {
    return null;
  }

  return toChildArray(children)
    .map((child) => child && cloneElement(child, props));
};

export default MobileGuard;
