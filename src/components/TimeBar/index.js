import { h } from 'preact';
import { route } from 'preact-router';
import { Box, Text } from 'grommet';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import classnames from 'classnames';

import { PrimaryButton } from 'Components/Buttons';
import { openInviteModal } from 'Components/NavBar/Invite/actions';

import { updateSubscription } from '../../redux/actions';
import { useIsMobileSize } from '../../hooks';

import style from './style.scss';

const format = (timestamp) => {
  const secondMs = 1000;
  const minuteMs = secondMs * 60;
  const hourMs = minuteMs * 60;
  const dayMs = hourMs * 24;
  const result = [];

  const days = Math.floor(timestamp / dayMs);
  const daysMs = days * dayMs;

  const hours = Math.floor((timestamp - daysMs) / hourMs);
  const hoursMs = hours * hourMs;

  const minutes = Math.floor((timestamp - (daysMs + hoursMs)) / minuteMs);
  const minutesMs = minutes * minuteMs;

  const seconds = Math.floor((timestamp - (daysMs + hoursMs + minutesMs)) / secondMs);

  if (days > 0) {
    result.push(`${days}d`);
  }
  if (days > 0 || hours > 0) {
    result.push(`${hours}h`);
  }

  const leadingZero = (number) => `${number < 10 ? '0' : ''}${number}`;

  result.push(`${leadingZero(minutes)}m:${leadingZero(seconds)}s`);

  return result.join(':');
}

const TimeBar = ({
  validUntil,
  isTrial,
  path,
  role,
  className,
  updateSubscriptionAction,
  openInviteModalAction,
}) => {
  const [timestamp, setTimestamp] = useState(null);
  const isPlanPage = path === '/plans';
  const isLandingPage = path === '/';
  const isMobileSize = useIsMobileSize();
  const isPlanPageAndExpired = isPlanPage && !timestamp;

  useEffect(() => {
    if (validUntil) {
      const diff = new Date(validUntil) - new Date();

      if (diff > 1000) {
        setTimestamp(diff);
        updateSubscriptionAction({ active: true });
      } else {
        setTimestamp(null);
      }
    }
  }, [updateSubscriptionAction, validUntil]);

  useEffect(() => {
    let timeout;

    if (isTrial && timestamp) {
      timeout = setTimeout(() => {
        if (timestamp > 1000) {
          setTimestamp(timestamp - 1000);
        } else {
          setTimestamp(null);
          updateSubscriptionAction({ active: false })
        }
      }, 1000);

      if (!isMobileSize && Math.floor(timestamp / 1000) === 120) {
        openInviteModalAction();
      }
    }

    return () => clearTimeout(timeout);
  }, [isTrial, openInviteModalAction, timestamp,
    updateSubscriptionAction, validUntil, isMobileSize]);

  if (!isTrial || isLandingPage || role !== 'user') {
    return null;
  }

  return (
    <Box
      className={classnames(style.timeBar, className)}
      pad={{vertical: '14px', horizontal: '15px'}}
      align="center"
      justify="center"
    >
      <Box
        width={{ max: '800px', width: '100%' }}
        direction="row"
        align="center"
        justify="evenly"
      >
        <Text
          size={isMobileSize ? '14px' : '16px'}
          textAlign={isPlanPageAndExpired ? 'center' : undefined}
        >
          {timestamp && (
            <>
              {!isMobileSize && <span>You Have&nbsp;</span>}
              <Text size="16px" weight={700}>
                {format(timestamp)}
                &nbsp;
              </Text>
              <span>left in your free trial.</span>
            </>
          )}
          {!timestamp && <span>Your free trial has ended.</span> }
          {!isMobileSize && <span>&nbsp;Want more?</span>}
        </Text>
        {!isPlanPageAndExpired && (
          <PrimaryButton
            margin={{left: '15px'}}
            size={isMobileSize ? 'small' : 'medium'}
            label={isPlanPage && timestamp ? 'Back to Trial' : 'Select a Plan'}
            onClick={() => route(isPlanPage && timestamp ? '/map' : '/plans')}
          />
        )}
      </Box>
    </Box>
  );
};

export default connect(
  ({
    user: {
      subscription: { validUntil, productId },
      role,
    },
  }) => ({
    validUntil,
    isTrial: productId === 'TRIAL',
    role,
  }),
  {
    updateSubscriptionAction: updateSubscription,
    openInviteModalAction: openInviteModal,
  },
)(TimeBar);
