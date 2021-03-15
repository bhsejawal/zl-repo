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

export const generateTitle = (part) => (part ? `${part} | Zoolife` : 'Zoolife');

export const formatAge = (dateOfBirth) => formatDistanceToNow(parseISO(dateOfBirth))
  .replace('over', '')
  .trim();
