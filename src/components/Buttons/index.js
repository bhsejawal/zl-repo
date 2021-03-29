import { Button, ResponsiveContext, Box } from 'grommet';
import { useContext } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
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

// currently used only for landing page
export const SecondaryButton = ({
  loading,
  label,
  size = "large",
  className,
  ...args
}) => (
  <Button
    secondary
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
    className={classnames(className, style[size], { [style.loading]: loading })}
    label={getLabel(loading, label)}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);

export const FloatingButton = ({
  className,
  ...args
}) => {
  const size = useContext(ResponsiveContext);
  const isMobile = ['xsmall', 'small'].includes(size);

  return (
    <Button
      className={classnames(className, style.floatingButton)}
      label={
        <Box
          className={style.wrapper}
          pad={{vertical: isMobile ? '8px' : '18px', horizontal: isMobile ? '20px' : '80px'}}
        >
          <span>{isMobile ? 'Start' : 'Try Zoolife Free'}</span>
          <FontAwesomeIcon icon={faChevronRight} style={{fontSize: isMobile ? '14px' : '25px'}} />
        </Box>
      }
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...args}
    />
  );
};
