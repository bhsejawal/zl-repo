import { h } from 'preact';
import { connect } from 'react-redux';

import useFetch from 'use-http';
import { API_BASE_URL} from 'Shared/fetch';
import { useCallback, useState, useEffect } from 'preact/hooks';
import Loader from 'Components/Loader';
import ErrorModal from 'Components/modals/Error';

import AskQuestion from './AskQuestion';
import Question from './Question';

import style from './style.scss';

const Questions = ({ habitatId }) => {
  const [questions, setQuestions] = useState([]);
  const [showError, setShowError] = useState();

  const {
    response,
    error,
    get,
    loading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const getData = useCallback(async () => {
    await get(`/questions/${habitatId}`);

    if (response.ok) {
      const { questions: list } = response.data;
      setQuestions(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitatId]);

  useEffect(() => {
    getData();
  }, [getData, habitatId]);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  if (loading) {
    return (
      <div className={style.questionsContainer}>
        <Loader height="485px" />
      </div>
    );
  }

  return (
    <div className={style.questionsContainer}>
      <AskQuestion onSend={getData} />
      {questions.map(({
        _id,
        user,
        text,
        createdAt,
        comments,
      }) => (
        <Question
          questionId={_id}
          username={user.username}
          animalIcon={user.animalIcon}
          color={user.color}
          content={text}
          createdAt={createdAt}
          comments={comments}
        />
      ))}
      {showError && <ErrorModal onClose={() => setShowError(false)} text="Failed to load Q&A" />}
    </div>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Questions);
