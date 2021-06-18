import { h } from 'preact';
import { useState } from 'preact/hooks';
import {
  Layer,
  Box,
  Heading,
  TextArea,
  Text,
} from 'grommet';
import useFetch from 'use-http';
import { connect } from 'react-redux';

import Loader from 'Components/Loader';
import Header from 'Components/modals/Header';
import Body from 'Components/modals/Body';
import { PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';

import { closeContactUsModal } from './ContactUs/actions';

import StatusContent from './StatusContent';

const ContactUsModal = ({ closeContactUsModalAction }) => {
  const [content, setContent] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    post,
    loading,
    response,
    error,
  } = useFetch(buildURL('contactus'), { credentials: 'include' });
  const submitHandler = async () => {
    if (content.length > 500 || content.length === 0) {
      return;
    }
    setHasSubmitted(true);

    const {
      userAgent,
      platform,
      vendor,
    } = window.navigator;

    await post({
      content,
      userAgent,
      platform,
      vendor,
    });
  }

  const closeModalHandler = () => {
    setContent('');
    closeContactUsModalAction();
  }

  return (
    <Layer position="center" style={{ borderRadius: '10px' }}>
      {!hasSubmitted && (
        <Box width="580px">
          <Header onClose={closeModalHandler}>
            Contact Us
          </Header>

          <Body>
            <Heading level="4" margin={{ top: '0' }}>
              How can we help you? We&apos;ll get back to you as soon as possible through email.
            </Heading>
            <Box height="190px" margin={{ top: '5px' }}>
              <TextArea
                fill
                resize={false}
                value={content}
                onChange={(evt) => setContent(evt.target.value)}
              />
            </Box>
            <Box>
              <Text textAlign="end" color={content.length > 500 ? 'status-error' : ''}>
                {content.length ?? 0}
                /500
              </Text>
            </Box>
            <Box alignSelf="end" margin={{ top: '30px' }}>
              <PrimaryButton
                label="Submit"
                disabled={content.length > 500 || content.length === 0}
                onClick={submitHandler}
              />
            </Box>
          </Body>
        </Box>
      )}
      {error && (
        <Box>
          <StatusContent
            type="error"
            text="Something went wrong, please, try again."
            onClose={closeModalHandler}
          />
        </Box>

      )}
      {hasSubmitted && response?.ok && (
        <Box>
          <StatusContent
            type="success"
            text="Your message has been sent. We'll reach out through email as soon as possible."
            onClose={closeModalHandler}
          />
        </Box>
      )}
      {hasSubmitted && loading && (
        <Loader fill />
      )}
    </Layer>
  );
};

export default connect(null, { closeContactUsModalAction: closeContactUsModal })(ContactUsModal);
