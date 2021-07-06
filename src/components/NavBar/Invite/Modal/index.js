import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
import {
  Layer,
  Box,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { PrimaryButton } from 'Components/Buttons';
import { buildURL } from 'Shared/fetch';
import TagInput from 'Components/TagInput';
import StatusModalContent from 'Components/modals/StatusContent';
import CloseButton from 'Components/modals/CloseButton';
import Body from 'Components/modals/Body';
import { defaultErrorMsg } from 'Components/modals/Error';

import { closeInviteModal } from '../actions';

import headerImg from './header-img.jpg';

import style from './style.scss';

const successText = (
  <>
    <span>An invite has been sent to their inbox!</span>
    <br />
    <span>Thanks for sharing Zoolife.</span>
  </>
);

const InviteModal = ({ closeInviteModalAction }) => {
  const tagInputRef = useRef();
  const layerRef = useRef();
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

  const onClose = useCallback(() => {
    closeInviteModalAction();
  }, [closeInviteModalAction]);

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
    <Layer position="center" className={style.layer} background="white" ref={layerRef} onEsc={onClose}>
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
        <Box width="min(480px, 100vw)" className="customScrollBar grey" background="white">
          <Box
            direction="row"
            align="center"
            as="header"
            justify="end"
            height={{ min: 'unset'}}
            className={style.header}
          >
            <img src={headerImg} alt="header" />
            <CloseButton varient="grey" onClick={onClose} className={style.closeBtn} />
          </Box>

          <Body className={classnames(style.content, '')}>
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
              pad={{ top: 'medium' }}
              width={{ min: '140px' }}
            >
              <PrimaryButton
                label="Send"
                loading={loading && 'Sending...'}
                onClick={onSend}
              />
            </Box>
          </Body>
        </Box>
      )}
    </Layer>
  );
};

export default connect(null, { closeInviteModalAction: closeInviteModal })(InviteModal);
