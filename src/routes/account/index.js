import { h } from 'preact';
import {
  Box,
  Heading,
  Grommet,
  Tabs,
  Tab,
} from 'grommet';
import { useState } from 'preact/hooks';
import { merge } from 'lodash-es';

import Header from 'Components/Header';
import { hasPermission } from 'Components/Authorize';

import grommetTheme from '../../grommetTheme';
import Profile from '../profile';
import EmailSection from './MyAccount/EmailSection';
import PasswordSection from './MyAccount/PasswordSection';
import SubscriptionSection from './SubscriptionSection';

import style from './style.scss';

const tabsTheme = {
  tab: {
    active: { color: 'var(--blueMediumDark)' },
    hover: { color: 'var(--grey)' },
    color: 'var(--grey)',
    disabled: { color: 'var(--blueMediumDark)' },
    border: {
      color: 'transparent',
      active: { color: 'var(--blueMediumDark)' },
      hover: { color: 'var(--grey)' },
    },
  },
};

const Account = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <Grommet theme={merge(tabsTheme, grommetTheme)} className="full-height">
      <Header />
      <Box flex="grow" height="100%" pad={{ top: '60px' } }>
        <Tabs
          activeIndex={activeIndex}
          onActive={setActiveIndex}
          flex="grow"
          fill
          className={style.tabs}
        >
          <Tab title="My Character">
            <Box fill border={{color: '#DFDFDF', size: '1px', side: 'top'}}>
              <Profile />
            </Box>
          </Tab>
          <Tab title="Account Info" flex="grow">
            <Box fill border={{color: '#DFDFDF', size: '1px', side: 'top'}}>
              <Box
                pad={{vertical: '20px', top: '20px', bottom: '40px'}}
                width={{max: '885px'}}
                margin="auto"
                fill
              >
                <Heading fill textAlign="center" level="2">Account Information</Heading>
                <EmailSection />
                <Box pad="20px" />
                <PasswordSection />
              </Box>
            </Box>
          </Tab>
          {hasPermission('subscription:edit') && (
            <Tab title="Manage Subscription">
              <SubscriptionSection />
            </Tab>
          )}
        </Tabs>
      </Box>
    </Grommet>
  );
};

export default Account;
