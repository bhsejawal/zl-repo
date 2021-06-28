import { ResponsiveContext } from 'grommet';
import { buildURL } from 'Shared/fetch';
import { useContext } from 'preact/hooks';
import classnames from 'classnames';
import { connect } from 'react-redux';

import facebook from './logos/facebook.svg';
import google from './logos/google.svg';

import style from './style.scss';

const SocialLoginButton = ({ variant, referralData }) => {
  const size = useContext(ResponsiveContext);
  const isSmallScreen = ['xsmall', 'small'].includes(size);
  if (!['facebook', 'google'].includes(variant)) {
    return null;
  }
  const queryParams = new URLSearchParams();

  Object.entries(referralData).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });
  queryParams.append('platform', variant);

  const origin = window.location.pathname;
  queryParams.append('origin', origin);

  return (
    <a
      native
      href={buildURL('connect', variant, `?${queryParams}`)}
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

export default connect(({ user: { referralData }}) => ({ referralData }))(SocialLoginButton);
