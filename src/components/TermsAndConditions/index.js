import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import {
  Layer,
  Box,
  Heading,
  Button,
  Text,
  ResponsiveContext,
  CheckBox,
} from 'grommet';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import { closeTermsModal, setUserTermsAccepted } from './actions';

import style from './style.scss';

const termsPdfUrl = 'https://assets.zoolife.tv/BRIZI+INC+-+Terms+of+Use+v17-03-2021.pdf';
const privacyPdfUrl = 'https://assets.zoolife.tv/Brizi+-+Privacy+Policy+v17-03-2021.pdf';

const TermsAndConditions = ({
  user,
  isOpen,
  isCloseDisabled,
  onCloseAction,
  setUserTermsAcceptedAction,
}) => {
  const size = useContext(ResponsiveContext);
  const [termsAccepted, setTermsAccepted] = useState();
  const [privacyAccepted, setPrivacyAccepted] = useState();

  const {
    post,
    response,
    error,
    loading,
  } = useFetch(
    buildURL('/users/accept-terms-and-services'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onContinue = async () => {
    await post();
    if (response.ok) {
      onCloseAction();
      setUserTermsAcceptedAction();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Layer
      responsive
      onEsc={!isCloseDisabled ? onCloseAction : undefined}
      onClickOutside={!isCloseDisabled ? onCloseAction : undefined}
    >
      <Box height={size !== 'small' ? 'calc(100vh - 40px)' : '100vh'}>
        <Box
          width="large"
          direction="row"
          align="center"
          as="header"
          elevation="small"
          justify="between"
        >
          <Heading level="2" margin={{ vertical: 'medium', horizontal: 'large' }}>
            Terms &amp; Conditions
          </Heading>
          <Button
            plain
            disabled={isCloseDisabled}
            margin="medium"
            onClick={onCloseAction}
            icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
          />
        </Box>

        <Box pad={{ horizontal: 'large', vertical: 'medium' }} flex="grow">
          <iframe
            className={style.pdfContainer}
            width="100%"
            height="100%"
            src={`${termsPdfUrl}#toolbar=0`}
            title="Terms and Conditions"
          />
        </Box>

        {user?.logged && (
          <Box pad="large" elevation="small" as="footer">
            <Box direction="row">
              <CheckBox
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <Text margin={{ left: 'small' }} size="xlarge">
                I agree to Zoolife’s
                {' '}
                <a
                  native
                  target="_blank"
                  rel="noopener noreferrer"
                  href={termsPdfUrl}
                >
                  Terms &amp; Conditions
                </a>
              </Text>
            </Box>

            <Box margin={{ top: 'small' }} direction="row">
              <CheckBox
                checked={privacyAccepted}
                onChange={() => setPrivacyAccepted(!privacyAccepted)}
              />
              <Text margin={{ left: 'small' }} size="xlarge">
                I agree to Zoolife’s
                {' '}
                <a
                  native
                  target="_blank"
                  rel="noopener noreferrer"
                  href={privacyPdfUrl}
                >
                  Privacy Policy
                </a>
              </Text>
            </Box>

            <Box align="end">
              <PrimaryButton
                primary
                onClick={onContinue}
                loading={loading}
                size="large"
                disabled={!termsAccepted || !privacyAccepted}
                label="Continue"
              />
              {error && (
                <Box pad="small">
                  <Text color="status-error">
                    Something went wrong. Please try again.
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Layer>
  );
};

export default connect(
  ({
    user,
    modals: {
      terms: {
        isOpen,
        isCloseDisabled,
      },
    },
  }) => ({
    user,
    isOpen,
    isCloseDisabled,
  }),
  {
    onCloseAction: closeTermsModal,
    setUserTermsAcceptedAction: setUserTermsAccepted,
  },
)(TermsAndConditions);
