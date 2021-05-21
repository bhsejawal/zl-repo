import { Button } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const getLabel = (loading, label) => {
  if (loading && typeof loading === 'boolean') {
    return <FontAwesomeIcon icon={faSpinner} spin style={{verticalAlign: 'middle', fontSize: '16px'}} />;
  }
  if (loading && typeof loading === 'string') {
    return loading;
  }

  return label;
}
export const PrimaryButton = ({
  loading,
  label,
  size = "large",
  className,
  ...args
}) => (
  <Button
    primary
    size={size}
    className={classnames(className, style[size], { [style.loading]: loading })}
    label={getLabel(loading, label)}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);

export const OutlineButton = ({
  loading,
  label,
  size = "large",
  className,
  ...args
}) => (
  <Button
    size={size}
    className={classnames(className, style[size], style.outline, { [style.loading]: loading })}
    label={getLabel(loading, label)}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);

export const FloatingButton = ({ className, onClick }) => (
  <button type="button" onClick={onClick} className={classnames(className, style.floatingButton)}>
    <div className={style.wrapper}>
      <span />
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  </button>
);

export const LandingPrimary = ({
  className,
  children,
  onClick,
  type = 'button',
}) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    onClick={onClick}
    className={classnames(className, style.landingPrimary)}
  >
    {children}
  </button>
);

export const LandingSecondary = ({
  className,
  children,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classnames(className, style.landingSecondary)}
  >
    {children}
  </button>
);
