import { formatDistanceToNow, parseISO } from "date-fns";

export const isValidUrl = (url) => {
  try {
    return !!(new URL(url.startsWith('/')
      ? `${window.location.origin}${url}`
      : url));
  } catch {
    return false;
  }
};

export const emailRegex = /^[A-Z0-9+_.-]+@[A-Z0-9.-]+\.[A-Z0-9.-]+$/gi;
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*\s).{8,50}$/gm;

export const iOSDevice = () => !!navigator.platform.match(/iPhone|iPod|iPad/);
export const androidDevice = () => !!navigator.userAgent.match(/Android/i);

export const getDeviceType = () => {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }

  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "phone";
  }

  return "desktop";
};

export const generateTitle = (part) => (part ? `${part} | Zoolife` : 'Zoolife');

export const formatAge = (dateOfBirth) => formatDistanceToNow(parseISO(dateOfBirth))
  .replace('over', '')
  .replace('about', '')
  .trim();

export const logPageView = () => {
  if (window.analytics) {
    window.analytics.page()
  }
}

export const identifyUser = (user) => {
  const { _id: userId, role } = user;
  if (window.analytics) {
    window.analytics.identify(userId, {
      role,
    })
  }
}
