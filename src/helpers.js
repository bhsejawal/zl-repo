import { formatDistanceToNowStrict, parseISO, intervalToDuration } from "date-fns";

const FREEMIUM_PRODUCT_ID = 'FREEMIUM';
const TRIAL_PRODUCT_ID = 'TRIAL';

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

export const isDev = () => process.env.PREACT_APP_ENVIRONMENT === 'development';

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

export const generateTitle = (part) => (part ? `Zoolife - ${part}` : 'Zoolife');

export const formatAge = (dateOfBirth) => formatDistanceToNowStrict(
  parseISO(dateOfBirth),
  { addSuffix: false, roundingMethod: 'floor' },
);

export const logPageView = (page) => {
  if (typeof window !== 'undefined') {
    const context = {
      referrer: '',
      page: {
        referrer: '',
      },
    };

    if (window.analytics) {
      if (page) {
        window.analytics.page({
          path: `${page}`,
          url: `${page}`,
          ...context,
        });
      } else {
        window.analytics.page();
      }
    }
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

export const logAndGetCampaignData = () => {
  try {
    const { referrer } = document;
    const { searchParams } = new URL(document.location);
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    const referralData = {
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
    };

    const storedReferralData = JSON.parse(localStorage.getItem('referralData')) ?? {};
    const {
      utmSource: localUTMSource,
      utmMedium: localUTMMedium,
      utmCampaign: localUTMCampaign,
    } = storedReferralData;

    const hasLocalUTMData = localUTMSource && localUTMMedium && localUTMCampaign;
    const hasNewUTMData = utmSource && utmCampaign && utmMedium;

    if (!hasLocalUTMData && hasNewUTMData) {
      localStorage.setItem('referralData', JSON.stringify(referralData));
      return referralData;
    }

    return storedReferralData;
  } catch (err) {
    console.error('Error setting up referral data on local storage', err);
    return {};
  }
}

export const getCampaignData = () => {
  try {
    return JSON.parse(localStorage.getItem('referralData')) || {};
  } catch (err) {
    console.error('Error getting referral data on local storage', err);
    return {};
  }
}

export const getConfig = (configs = [], key) => (
  configs.find(({ configKey }) => configKey === key) || {}
);

export const handleDownloadMediaURL = (url) => {
  const { pathname } = new URL(url);
  const host = isDev() ? 'zoolife.brizi.tech' : document.location.host;
  return `https://${host}${pathname}`;
}

export const loadPage = (path, keepQueryString) => {
  window.location.href = `${path}${keepQueryString ? window.location.search : ''}`;
};

export const formatSecondsToVideoDuration = (timeInSeconds) => {
  const {
    hours,
    minutes,
    seconds,
  } = intervalToDuration({ start: 0, end: timeInSeconds * 1000});
  return `${hours > 0 ? `${(`0${hours}`).slice(-2)}:` : ''}${(`0${minutes}`).slice(-2)}:${(`0${seconds}`).slice(-2)}`;
};

export const isHabitatUnlocked = (userSubscription, habitatId) => {
  const { productId, freeHabitat } = userSubscription;
  return ![FREEMIUM_PRODUCT_ID, TRIAL_PRODUCT_ID].includes(productId)
    || (productId === FREEMIUM_PRODUCT_ID && freeHabitat === habitatId);
}
