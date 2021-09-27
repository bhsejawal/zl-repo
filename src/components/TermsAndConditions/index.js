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
import { PRIVACY_PDF_URL, TERMS_PDF_URL } from './constants';

import style from './style.scss';

const TermsAndConditions = ({
  user,
  file,
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

  const title = file === 'terms' ? 'Terms & Conditions' : 'Privacy Policy';
  const pdfFile = file === 'terms' ? TERMS_PDF_URL : PRIVACY_PDF_URL;

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
            {title}
          </Heading>
          <Button
            plain
            disabled={isCloseDisabled}
            margin="medium"
            onClick={onCloseAction}
            icon={<FontAwesomeIcon style={{ fontSize: size !== 'small' ? '28px' : '20px'}} icon={faTimes} />}
          />
        </Box>

        <Box pad={{ horizontal: 'large', vertical: 'medium' }} flex="grow">
          <iframe
            className={style.pdfContainer}
            width="100%"
            height="100%"
            src={`${pdfFile}#toolbar=0`}
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
                  href={TERMS_PDF_URL}
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
                  href={PRIVACY_PDF_URL}
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
        file,
      },
    },
  }) => ({
    user,
    isOpen,
    isCloseDisabled,
    file,
  }),
  {
    onCloseAction: closeTermsModal,
    setUserTermsAcceptedAction: setUserTermsAccepted,
  },
)(TermsAndConditions);
