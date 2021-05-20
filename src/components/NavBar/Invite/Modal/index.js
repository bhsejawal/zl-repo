import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import {
  Layer,
  Box,
  Button,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';

import { PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';
import TagInput from 'Components/TagInput';
import StatusModalContent from 'Components/modals/StatusContent';
import { defaultErrorMsg } from 'Components/modals/Error';
import { useWindowResize } from '../../../../hooks';

import headerImg from './header-img.jpg';

import style from './style.scss';

const successText = (
  <>
    <span>An invite has been sent to their inbox!</span>
    <br />
    <span>Thanks for sharing Zoolife.</span>
  </>
);

const InviteModal = ({ onClose }) => {
  const tagInputRef = useRef();
  const { width } = useWindowResize();
  const [emails, setEmails] = useState([]);
  const [sent, setSent] = useState();
  const [error, setError] = useState();
  const {
    post,
    loading,
    error: requestError,
    response,
  } = useFetch(
    buildURL('/email/invite'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  useEffect(() => {
    if (requestError) {
      setError(true);
    }
  }, [requestError]);

  const onErrorClose = useCallback(() => {
    setError(false);
  }, []);

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

  const onAdd = useCallback(
    (email) => setEmails([...emails, email]),
    [emails],
  );

  const onRemove = useCallback(
    ({ index }) => setEmails(emails.filter((v, ind) => index !== ind)),
    [emails],
  );

  return (
    <Layer position="center" className={style.layer} onEsc={onClose}>
      {sent && (
        <StatusModalContent
          type="success"
          text={successText}
          onClose={onClose}
        />
      )}

      {error && (
        <StatusModalContent
          type="error"
          text={defaultErrorMsg}
          onClose={onErrorClose}
        />
      )}

      {!sent && !error && (
        <Box width="min(480px, 100vw)">
          <Box
            direction="row"
            align="center"
            as="header"
            justify="end"
            overflow="hidden"
            className={style.header}
          >
            <img src={headerImg} alt="header" width={width > 410 ? '410' : width} />
            <Button
              className={style.closeBtn}
              plain
              margin="small"
              onClick={onClose}
              icon={<FontAwesomeIcon size="lg" color="--var(grey)" icon={faTimes} />}
            />
          </Box>

          <Box
            pad={{ vertical: '0', horizontal: 'large' }}
            margin={{ top: '35px'}}
            className={style.content}
          >
            <Text size="xlarge">
              These days, we all need a nature escape.
            </Text>
            <Heading margin={{ top: '13px', bottom: '33px' }} level="3">
              Send your friends a free trial.
            </Heading>

            <TagInput
              label="Friend’s Email(s):"
              name="emails"
              ref={tagInputRef}
              value={emails}
              onAdd={onAdd}
              onValidate={onValidate}
              onRemove={onRemove}
            />
            {error && (
              <Box pad={{ horizontal: 'small' }}>
                <Text color="status-error">There was an error. Please try again.</Text>
              </Box>
            )}

            <Box
              alignSelf="center"
              pad={{ top: 'medium', bottom: 'large' }}
              width={{ min: '140px' }}
            >
              <PrimaryButton
                label="Send"
                loading={loading && 'Sending...'}
                onClick={onSend}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Layer>
  );
};

export default InviteModal;
