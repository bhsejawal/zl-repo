import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'preact/hooks';
import {
  Box,
  Heading,
  Anchor,
  Text,
} from 'grommet';
import { route } from 'preact-router';
import useFetch from 'use-http';

import TagInput from 'Components/TagInput';
import { PrimaryButton } from 'Components/Buttons';
import Error from 'Components/modals/Error';
import Success from 'Components/modals/Success';

import { buildURL } from 'Shared/fetch';
import { useIsMobileSize } from '../../hooks';

import style from './style.scss';

const Welcome = () => {
  const tagInputRef = useRef();
  const [emails, setEmails] = useState([]);
  const [sent, setSent] = useState();
  const [error, setError] = useState();
  const isSmallScreen = useIsMobileSize();

  const {
    post,
    loading,
    error: requestError,
    response,
  } = useFetch(
    buildURL('/email/invite'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onSend = async () => {
    if (emails.length === 0) {
      const input = tagInputRef.current.querySelector('input');
      // we need to focus the input and then blur it
      // to invoke the validation, and make it display an error
      input.focus();
      requestAnimationFrame(() => {
        input.blur();
      });
      return;
    }

    await post({ emails, sourceUrl: window.location.pathname });
    if (response.ok) {
      setSent(true);
    }
  };

  const onValidate = useCallback(({ target, value }) => {
    if (value === '') {
      throw new Error('This field is required.');
    } else if (target && target.validity?.typeMismatch) {
      throw new Error('Invalid email.');
    }
  }, []);

  const onSuccessClose = useCallback(() => {
    setEmails([]);
    setSent();
    route('/map');
  }, [setEmails, setSent]);

  const onAdd = useCallback(
    (email) => setEmails([...emails, email]),
    [emails],
  );

  const onRemove = useCallback(
    ({ index }) => setEmails(emails.filter((v, ind) => index !== ind)),
    [emails],
  );

  useEffect(() => {
    if (requestError) {
      setError(true);
    }
  }, [requestError]);

  const onErrorClose = useCallback(() => {
    setError(false);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      route('/map', true);
    }
  }, [isSmallScreen]);

  if (isSmallScreen) {
    return null;
  }

  return (
    <>
      <Box className={style.welcomeWrapper} fill direction="row">
        <Box pad={{ left: '80px', top: '100px' }}>
          <Box width={{ max: "360px", min: "360px" }}>
            <Heading level="1">
              Welcome to the Zoolife family!
            </Heading>
            <Heading level="4">
              Send your friends a free trial.
            </Heading>
            <Box width={{ max: '325px'}} align="center">
              <TagInput
                  label="Friend’s Email(s):"
                  name="emails"
                  ref={tagInputRef}
                  value={emails}
                  onAdd={onAdd}
                  onValidate={onValidate}
                  onRemove={onRemove}
                />
            </Box>
            <Box direction="row" margin={{ top: '40px' }}>
              <Box margin={{ right: '20px' }}>
                <PrimaryButton
                  label="Send"
                  loading={loading && 'Sending...'}
                  onClick={onSend}
                  disabled={!emails.length}
                />
              </Box>
              <Box justify="center">
                <Anchor color="var(--charcoal)" href="/map">
                  <Text
                    size="xlarge"
                    weight={400}
                    style={{ textDecorationLine: 'underline', lineHeight: '16px' }}
                  >
                    Take me to Zoolife.
                  </Text>
                </Anchor>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box align="end" justify="center" fill>
          <Box alignSelf="end">
            <img src="https://assets.zoolife.tv/zoolifeMap.png" alt="" width="853" height="567" />
          </Box>
        </Box>
      </Box>
      {sent && (
        <Success
          text="An invite has been sent to their inbox! Thanks for sharing Zoolife."
          onClose={onSuccessClose}
        />
      )}
      {error && (
        <Error
          text="Something went wrong. Please, try again"
          onClose={onErrorClose}
        />
      )}
    </>
  )
}

export default Welcome;
