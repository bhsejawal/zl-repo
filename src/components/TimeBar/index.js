import { h } from 'preact';
import { route } from 'preact-router';
import { Box, Text } from 'grommet';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { PrimaryButton } from 'Components/Buttons';
import { updateSubscription } from '../../redux/actions';

import style from './style.scss';

const TimeBar = ({
  validUntil,
  isTrial,
  updateSubscriptionAction,
  path,
}) => {
  const [time, setTime] = useState(null);
  const isPlanPage = path === '/plans';

  useEffect(() => {
    if (validUntil) {
      const now = new Date();
      const until = new Date(validUntil);
      const diff = until - now;

      if (diff > 1000) {
        setTime(new Date(diff));
        updateSubscriptionAction({ active: true });
      } else {
        setTime(null);
      }
    }
  }, [updateSubscriptionAction, validUntil]);

  useEffect(() => {
    let timeout;

    if (isTrial && time) {
      const until = new Date(validUntil);
      const diff = until - new Date();
      timeout = setTimeout(() => {
        if (diff > 1000) {
          setTime(new Date(diff - 1000));
        } else {
          setTime(null);
          updateSubscriptionAction({ active: false })
        }
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [isTrial, time, updateSubscriptionAction, validUntil]);

  if (!isTrial) {
    return null;
  }

  return (
    <Box
      className={style.timeBar}
      pad={{vertical: '14px', horizontal: '15px'}}
      direction="row"
      align="center"
      justify="center"
    >
      <Text size="20px" className={style.text}>
        <span>You Have &nbsp;</span>
        <Text size="25px" color="#f38e25">{time ? time.toISOString().slice(14, 19) : '00:00'}</Text>
        <span>&nbsp; left in your free trial.&nbsp;</span>
        {
          time === null && isPlanPage
            ? <span>Select a pass to continue exploring!</span>
            : <span>Want more?</span>
        }
        {!(isPlanPage && !time) && (
          <PrimaryButton
            margin={{left: '15px'}}
            size="small"
            label={isPlanPage && time ? 'Back to Trial' : 'Select a Plan'}
            onClick={() => route(isPlanPage && time ? '/map' : '/plans')}
          />
        )}

      </Text>
    </Box>
  );
};

export default connect(
  ({
    user: {
      subscription: { validUntil, productId },
    },
  }) => ({
    validUntil,
    isTrial: productId === 'TRIAL',
  }),
  { updateSubscriptionAction: updateSubscription },
)(TimeBar);
