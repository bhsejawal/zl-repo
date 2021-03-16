import { h } from 'preact';
import {
  Box,
  Heading,
  Grommet,
  Tabs,
  Tab,
  Image,
  Button,
} from 'grommet';
import { connect } from 'react-redux';
import { useState } from 'preact/hooks';
import { merge } from 'lodash-es';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';

import grommetTheme from '../../grommetTheme';
import Profile from '../profile';
import EmailSection from './MyAccount/EmailSection';
import PasswordSection from './MyAccount/PasswordSection';

import style from './style.scss';

const tabsTheme = {
  tab: {
    active: { color: '#507EDE' },
    hover: { color: '#757575' },
    color: '#757575',
    disabled: { color: '#507EDE' },
    border: {
      color: 'transparent',
      active: { color: '#507EDE' },
      hover: { color: '#757575' },
    },
  },
};

const Account = ({ profile }) => {
  const { animalIcon, color } = profile;
  const [activeIndex, setActiveIndex] = useState(2);
  const { post } = useFetch(
    buildURL(),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  // TODO: these methods, and the buttons uses them
  // Are place holders that should be replaced once
  // we work on #177150051
  const cancelSubscription = async () => {
    try {
      await post('/users/subscription/unsubscribe');
    } catch (err) {
      console.error(err);
    }
  }

  const retainUser = async () => {
    // Define how we're going to get the discount from
    try {
      await post('/users/subscription/retain', { discount: 50 });
    } catch (err) {
      console.error(err);
    }
  }

  const updateSubscription = async () => {
    // Update this once we implement the manage subscription
    // Price ID should be sent based on what card the user clicked on
    try {
      await post('/users/subscription/6038074e28ce911198c70e0f/price_1INfVrGhk8ejMhuhRjfXkoH3');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Box flex="grow">
      <Grommet theme={merge(tabsTheme, grommetTheme)} full>
        <Tabs
          activeIndex={activeIndex}
          onActive={setActiveIndex}
          height="100%"
          flex="grow"
          className={style.tabs}
        >
          <Box direction="row" justify="center" align="center" margin={{right: '20px', left: '10px'}}>
            <Box width="30px" height="30px" margin={{right: '10px'}}>
              <Image
                style={{backgroundColor: color, borderRadius: '50%'}}
                fit="cover"
                src={animalIcon}
              />
            </Box>
          </Box>

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
          <Tab title="Manage Subscription">
            <Box pad="medium">
              Manage Subscription Tab
              <Button label="Cancel Subscription" onClick={cancelSubscription} />
              <Button label="Retain User" onClick={retainUser} />
              <Button label="Update Subscription" onClick={updateSubscription} />
            </Box>
          </Tab>
        </Tabs>
      </Grommet>
    </Box>
  );
};

export default connect(
  ({ user: { profile = {}, email, userId } }) => ({ profile, email, userId }),
)(Account);
