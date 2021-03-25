import { useState } from 'preact/hooks';
import { Box, Text, Heading } from 'grommet';
import useFetch from 'use-http';
import { route } from 'preact-router';
import { connect } from 'react-redux';

import { buildURL } from 'Shared/fetch';
import Header from 'Components/Header';
import Button from 'Components/Button';
import Dialog from 'Components/modals/Dialog';
import Loader from 'Components/async/LoaderModal';
import background from 'Assets/plansBackground.png';

import { setSubscriptionData } from '../../redux/actions';

const CancelSubscription = ({ setSubscriptionDataAction }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { post, loading } = useFetch(
    buildURL(),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const cancelSubscription = async () => {
    try {
      const { subscriptionStatus } = await post('/users/subscription/unsubscribe');
      setSubscriptionDataAction(subscriptionStatus);
      setShowDialog(true);
    } catch (err) {
      // TODO: display error modal;
      console.error(err);
    }
  }

  const handleDialogClose = () => {
    setShowDialog(false);
    route('/account', true);
  }

  return (
    <>
      {loading && <Loader />}
      <Header />
      <Box
        height="100vh"
        pad={{ top: '60px' } }
        background={{
          image: `url(${background})`,
          size: 'contain',
          position: 'bottom',
          repeat: 'no-repeat',
          attachment: 'fixed',
        }}
        >
        <Heading level={1} textAlign="center" fill size="25px" margin={{ top: '56px' }}>
          We&apos;ll miss you!
        </Heading>
        <Text textAlign="center" size="16px">
          Tell us how we can do better.
        </Text>
        {/* TODO: Add typeform */}
        <Box basis="3/4" justify="center">
          <Text textAlign="center" fill size="45px">[insert typeform]</Text>
        </Box>
        <Box width="small" alignSelf="center">
          <Button
            variant="primary"
            onClick={cancelSubscription}
            alignSelf="end"
          >
            Cancel
          </Button>
        </Box>
      </Box>
      {showDialog && (
        <Dialog
          title="Until next time."
          text="You will still be able to access Zoolife until your pass runs outs."
          buttonLabel="Back to Zoolife"
          onCancel={handleDialogClose}
          onConfirm={handleDialogClose}
        />)}
    </>
  );
};

export default connect(null, { setSubscriptionDataAction: setSubscriptionData})(CancelSubscription);
