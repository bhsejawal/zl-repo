import { memo } from 'preact/compat';

import { Tip, Box, Text } from 'grommet';

import yearly from './assets/yearly.svg';
import day from './assets/day.svg';
import host from './assets/host.svg';
import monthly from './assets/monthly.svg';
import partner from './assets/partner.svg';
import classPass from './assets/class.svg';
import style from './style.scss';

const badges = Object.freeze({
  yearly: {
    img: yearly,
    text: 'Annual Member',
  },
  day: {
    img: day,
    text: 'Day Member',
  },
  host: {
    img: host,
    text: 'Animal Expert',
  },
  monthly: {
    img: monthly,
    text: 'Monthly Member',
  },
  partner: {
    img: partner,
    text: 'Zoo Partner',
  },
  class: {
    img: classPass,
    text: 'Class Member',
  },
});

const UserBadge = ({ badge }) => {
  if (!badge || !badges[badge]) {
    return null;
  }

  return (
    <Tip
      content={(
        <Box pad={{ vertical: '5px', horizontal: '8px'}}>
          <Text size="small" weight={700}>{badges[badge].text}</Text>
        </Box>
      )}
      plain
      dropProps={{
        background: 'white',
        align: { bottom: 'top' },
        margin: 'xsmall',
      }}>
      <div className={style.userBadge}>
        <img src={badges[badge].img} alt="badge" />
      </div>
    </Tip>
  )
}

export default memo(UserBadge);
