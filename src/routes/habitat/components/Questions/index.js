import { h } from 'preact';
import { connect } from 'react-redux';

import useFetch from 'use-http';
import { API_BASE_URL, post, buildURL} from 'Shared/fetch';
import {
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'preact/hooks';
import Loader from 'Components/Loader';
import ErrorModal from 'Components/modals/Error';
import { GlobalsContext } from 'Shared/context';

import AskQuestion from './AskQuestion';
import Question from './Question';
import DeleteMessageModal from './DeleteMessageModal';
import ReportMessageModal from './ReportMessageModal';

import style from './style.scss';

const Questions = ({ habitatId }) => {
  const { socket } = useContext(GlobalsContext);
  const [questions, setQuestions] = useState([]);
  const [showError, setShowError] = useState();
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  useEffect(() => {
    const onQuestionDeleted = ({ questionId }) => {
      setQuestions((questions) => questions.filter(({ _id }) => _id !== questionId));
    };

    socket.on('questionDeleted', onQuestionDeleted);
    return () => {
      socket.off('questionDeleted', onQuestionDeleted);
    };
  }, [socket]);

  const promptDeletion = (questionId) => {
    setSelectedQuestion(questionId);
    setShowDeletionModal(true);
  };

  const promptReport = (questionId) => {
    setSelectedQuestion(questionId);
    setShowReportModal(true);
  };

  const closeDeleteModalHandler = useCallback(() => {
    setShowDeletionModal(false);
    setSelectedQuestion(null);
  }, [setShowDeletionModal, setSelectedQuestion]);

  const closeReportModalHandler = useCallback(() => {
    setShowReportModal(false);
    setSelectedQuestion(null);
  }, [setShowReportModal, setSelectedQuestion]);

  const reportQuestion = () => {
    post(buildURL(`questions/${selectedQuestion}/report`))
      .catch((err) => console.error(err));
    closeReportModalHandler();
  }

  const deleteQuestion = () => {
    post(buildURL(`questions/${selectedQuestion}/delete`))
      .catch((err) => console.error(err));
    closeDeleteModalHandler();
  };

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
          onReportHandler={promptReport}
          onDeleteHandler={promptDeletion}
        />
      ))}
      {showError && <ErrorModal onClose={() => setShowError(false)} text="Failed to load Q&A" />}
      {showDeletionModal && (
        <DeleteMessageModal onClose={closeDeleteModalHandler} onDelete={deleteQuestion} />
      )}
      {showReportModal && (
        <ReportMessageModal
          onClose={closeReportModalHandler}
          onReport={reportQuestion}
        />
      )}
    </div>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Questions);
