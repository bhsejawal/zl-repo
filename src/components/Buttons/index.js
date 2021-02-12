import { Button } from 'grommet';
import classnames from 'classnames';

import btnStyle from './style.scss';

export const PrimaryButton = ({ style, className, ...args }) => (
  <Button
    className={classnames(className, btnStyle.button, btnStyle.primary)}
    style={{ ...style }}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);

export const SecondaryButton = ({ style, className, ...args }) => (
  <Button
    className={classnames(className, btnStyle.button, btnStyle.secondary)}
    style={{ ...style }}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);

export const OutlineButton = ({ style, className, ...args }) => (
  <Button
    className={classnames(className, btnStyle.button, btnStyle.outline)}
    style={{ ...style }}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...args}
  />
);
