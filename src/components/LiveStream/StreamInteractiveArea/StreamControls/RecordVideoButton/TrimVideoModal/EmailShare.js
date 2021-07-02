import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import ErrorModal from 'Components/modals/Error';

const EmailShare = ({ videoURL, className, logShare }) => {
  const [showEmailSuccess, setShowEmailSuccess] = useState();
  const [showEmailError, setShowEmailError] = useState();
  const {
    error,
    post,
    response,
    loading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    if (error) {
      setShowEmailError(true);
    } else if (response.ok) {
      setShowEmailSuccess(true);
      setTimeout(setShowEmailSuccess, 2000);
    }
  }, [error, response, response.ok]);

  const sendEmail = async () => {
    await post('/email/snapshot', { imageUrl: videoURL });
    logShare('email');
  };

  return (
    <>
      <button
        onClick={sendEmail}
        type="button"
        className={className}
        disabled={loading || showEmailSuccess}
      >
        {!loading && <FontAwesomeIcon icon={showEmailSuccess ? faCheck : faEnvelope} />}
        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
      </button>
      {showEmailError && <ErrorModal onClose={() => setShowEmailError(false)} />}
    </>
  );
};

export default EmailShare;
