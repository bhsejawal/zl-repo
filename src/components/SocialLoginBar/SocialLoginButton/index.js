import { ResponsiveContext } from 'grommet';
import { buildURL } from 'Shared/fetch';
import { useContext } from 'preact/hooks';
import classnames from 'classnames';

import facebook from './logos/facebook.svg';
import google from './logos/google.svg';

import style from './style.scss';

const SocialLoginButton = ({ variant }) => {
  const size = useContext(ResponsiveContext);
  const isSmallScreen = ['xsmall', 'small'].includes(size);
  if (!['facebook', 'google'].includes(variant)) {
    return null;
  }

  return (
    <a
      href={buildURL('connect', variant)}
      rel="noopener noreferrer nofollow"
      className={classnames(style.socialButton, {[style.roundButton]: isSmallScreen})}
    >
      <img src={variant === 'facebook' ? facebook : google} alt={`Social Login using ${variant}`} />
      <span>
        {variant}
      </span>
    </a>
  );
}

export default SocialLoginButton;
