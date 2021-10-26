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
import classnames from 'classnames';

import { hasPermission } from 'Components/Authorize';

import { useIsMobileSize } from '../../hooks';
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
  const isMobileSize = useIsMobileSize();

  return (
    <Grommet theme={merge(tabsTheme, grommetTheme)} className="full-height">
      <Box fill>
        <Box fill>
          <Tabs
            activeIndex={activeIndex}
            onActive={setActiveIndex}
            className={classnames(style.tabs, {[style.mobile]: isMobileSize})}
            flex
          >
            <Tab title="My Character">
              <Box fill border={{color: '#DFDFDF', size: '1px', side: 'top'}}>
                <Profile />
              </Box>
            </Tab>
            <Tab title="Account Info">
              <Box
                fill
                overflow="auto"
                border={{ color: '#DFDFDF', size: '1px', side: 'top' }}
                style={{ display: 'block' }}
              >
                <Box
                  width={{max: 'min(885px, calc(100vw - 40px))'}}
                  margin="auto"
                  fill="horizontal"
                  pad={{ vertical: '20px', top: '20px', bottom: '40px' }}
                >
                  <Heading fill textAlign="center" level="2" margin={isMobileSize ? '0 10px 20px' : undefined}>Account Information</Heading>
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
      </Box>
    </Grommet>
  );
};

export default Account;
