import { Button } from 'grommet';
import classnames from 'classnames';

import style from './style.scss';

const getLabel = (loading, label) => (loading && typeof loading === 'boolean' && 'Loading...')
  || (loading && typeof loading === 'string' && loading)
  || label;

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
    className={classnames(className, { [style.loading]: loading })}
    label={getLabel(loading, label)}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);

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
    className={classnames(className, { [style.loading]: loading })}
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
    className={classnames(className, { [style.loading]: loading })}
    label={getLabel(loading, label)}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);
