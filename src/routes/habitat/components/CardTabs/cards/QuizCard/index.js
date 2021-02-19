import { h } from 'preact';
import { Heading } from 'grommet';
import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';

import { API_BASE_URL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import gorilla from 'Assets/gorilla.png';

import CardWrapper from '../components/CardWrapper';

import style from './style.scss';

const QuizCard = ({
  cardId,
  correctAnswers: correctAnswersArg,
  questions = [],
  answers: answersArg = 0,
}) => {
  const [answers, setAnswers] = useState(answersArg);
  const [selectedAnswerInd, setSelectedAnswerInd] = useState();
  const [correctAnswerInd, setCorrectAnswerInd] = useState();
  const [correctAnswers, setCorrectAnswers] = useState(correctAnswersArg || 0);
  const isDone = questions.length <= answers;

  // TODO: handle error - we still don't have UI for that
  const { post, get } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const onClick = async (ind) => {
    setSelectedAnswerInd(ind);

    const { correct: correctAnswerInd } = await post('v2/trivia/answer', {
      // eslint-disable-next-line no-underscore-dangle
      questionId: questions[answers]._id,
      answer: ind,
    });

    setCorrectAnswerInd(correctAnswerInd);

    if (questions.length - 1 === answers) {
      const { correctAnswers: res } = await get(`cards/${cardId}/trivia/status`);
      setCorrectAnswers(res);
    }
  };

  useEffect(() => {
    setAnswers(answersArg);
  }, [answersArg]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof correctAnswer === 'boolean') {
      const timeout = setTimeout(() => {
        setCorrectAnswerInd(undefined);
        setSelectedAnswerInd(undefined);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      }
    }
  }, [correctAnswerInd]);

  const onNext = () => {
    setAnswers(answers + 1);
    setSelectedAnswerInd(undefined);
    setCorrectAnswerInd(undefined);
  };

  const onRetry = async () => {
    try {
      await post(`cards/${cardId}/trivia/replay`);
      setAnswers(0);
    } catch (err) {
      console.error(err);
      // TODO: handle error
    }
  };

  return (
    <CardWrapper>
      <div className={style.wrapper}>
        <div className={style.top}>
          <Heading level="4" margin="0" className={style.title}>
            {isDone
              ? 'Results'
              : `Question ${answers + 1} of ${questions.length}`}
          </Heading>
          <p>
            {isDone
              ? 'Here’s how you did:'
              : questions[answers].question}
          </p>
        </div>

        <div className={style.middle}>
          {isDone ? (
            <div className={style.status}>
              {/* TODO: replace with animal photo when we have habitat info */}
              <img className={style.animal} src={gorilla} alt="animal" />
              <Heading level="1" color="var(--turquoise)" margin={{ bottom: 'small' }}>
                {`${correctAnswers}/${questions.length}`}
              </Heading>
              <p>Thanks for learning about gorillas with ZooLife!</p>
            </div>
          ) : (
            <>
              <button
                className={classnames(style.btn, {
                  [style.disabled]: selectedAnswerInd,
                  [style.dimmed]: selectedAnswerInd && selectedAnswerInd !== 1,
                })}
                type="button"
                onClick={() => onClick(1)}
              >
                <span>{questions[answers].answer1}</span>
                <div className={style.circle}>
                  {correctAnswerInd && (
                    correctAnswerInd === 1 ? (
                      <FontAwesomeIcon icon={faCheckCircle} size="lg" color="var(--sage)" />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} size="lg" color="var(--redDark)" />
                    )
                  )}
                </div>
              </button>

              <button
                className={classnames(style.btn, {
                  [style.disabled]: selectedAnswerInd,
                  [style.dimmed]: selectedAnswerInd && selectedAnswerInd !== 2,
                })}
                type="button"
                onClick={() => onClick(2)}
              >
                <span>{questions[answers].answer2}</span>
                <div className={style.circle}>
                  {correctAnswerInd && (
                    correctAnswerInd === 2 ? (
                      <FontAwesomeIcon icon={faCheckCircle} size="lg" color="var(--sage)" />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} size="lg" color="var(--redDark)" />
                    )
                  )}
                </div>
              </button>

              {questions[answers].answer3 && (
                <button
                  className={classnames(style.btn, {
                    [style.disabled]: selectedAnswerInd,
                    [style.dimmed]: selectedAnswerInd && selectedAnswerInd !== 3,
                  })}
                  type="button"
                  onClick={() => onClick(3)}
                >
                  <span>{questions[answers].answer3}</span>
                  <div className={style.circle}>
                    {correctAnswerInd && (
                      correctAnswerInd === 3 ? (
                        <FontAwesomeIcon icon={faCheckCircle} size="lg" color="var(--sage)" />
                      ) : (
                        <FontAwesomeIcon icon={faTimesCircle} size="lg" color="var(--redDark)" />
                      )
                    )}
                  </div>
                </button>
              )}
            </>
          )}
        </div>

        <div>
          {isDone ? (
            <PrimaryButton
              margin={{ vertical: 'medium' }}
              label="Retry Quiz"
              onClick={onRetry}
            />
          ) : (
            <PrimaryButton
              margin={{ vertical: 'medium' }}
              label="Next Question"
              disabled={!selectedAnswerInd || !correctAnswerInd}
              onClick={onNext}
            />
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default QuizCard;
