import { buildURL } from 'Shared/fetch';

import facebook from './logos/facebook.svg';
import google from './logos/google.svg';

import style from './style.scss';

const SocialLoginButton = ({ variant }) => {
  if (!['facebook', 'google'].includes(variant)) {
    return null;
  }

  return (
    <a
      href={buildURL('connect', variant)}
      rel="noopener noreferrer nofollow"
      className={style.socialButton}
    >
      <img src={variant === 'facebook' ? facebook : google} alt={`Social Login using ${variant}`} />
      <span>
        {variant}
      </span>
    </a>
  );
}

export default SocialLoginButton;
