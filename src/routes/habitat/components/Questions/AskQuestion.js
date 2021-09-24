import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import useFetch from 'use-http';
import classnames from 'classnames';

import { PrimaryButton } from 'Components/Buttons';
import { API_BASE_URL } from 'Shared/fetch';
import AnimalIcon from 'Components/AnimalIcon';
import ErrorModal from 'Components/modals/Error';
import CloseButton from 'Components/modals/CloseButton';

import style from './style.scss';

const AskQuestion = ({ habitatId, onSend }) => {
  const [text, setText] = useState('');
  const [showError, setShowError] = useState();
  const [expand, setExpand] = useState();

  const { post, response, error } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const addQuestion = async () => {
    await post(`/questions/${habitatId}`, { text });
    if (response.ok) {
      setText('');
      onSend();
    }
  }

  return (
    <div className={classnames(style.askContainer, { [style.expand]: expand })}>
      {expand && <CloseButton className={style.close} onClick={() => setExpand(false)} />}
      <h4>{expand ? 'Start a Discussion' : 'Ask questions and start discussions below!'}</h4>
      {!expand && <p>Zoolife experts and community members will help you find the answers.</p>}

      <div className={style.inputWrapper}>
        {!expand && <AnimalIcon width={35} />}
        <textarea
          placeholder={expand ? 'Start typing your thoughts...' : 'Start a discussion...'}
          onFocus={() => setExpand(true)}
          value={text}
          onChange={({ target: { value }}) => setText(value)}
          maxLength="1000"
        />
        <PrimaryButton
          label={expand ? 'Post Discussion' : 'Post'}
          size={expand ? 'large' : 'medium'}
          onClick={addQuestion}
        />
      </div>
      {showError && <ErrorModal onClose={() => setShowError(false)} text={response?.data?.message || 'Failed to start discussion'} />}
    </div>);
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(AskQuestion);
