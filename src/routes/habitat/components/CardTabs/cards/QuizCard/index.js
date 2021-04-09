import { h } from 'preact';
import { Heading, Text } from 'grommet';
import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { API_BASE_URL } from 'Shared/fetch';
import { PrimaryButton } from 'Components/Buttons';
import CardWrapper from '../components/CardWrapper';
import { QUIZ_CARD_TYPE } from '../../constants';

import style from './style.scss';

const QuizCard = ({
  cardId,
  correctAnswers: correctAnswersArg,
  questions = [],
  answers: answersArg = 0,
  profileImage,
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
    <CardWrapper tag={QUIZ_CARD_TYPE} hideTag>
      <div className={style.wrapper}>
        <div className={style.top}>
          <Heading level="4" margin="0" className={style.title}>
            {isDone
              ? 'Results'
              : `Question ${answers + 1} of ${questions.length}`}
          </Heading>
          <Text size="large" textAlign="center">
            {isDone
              ? 'Here’s how you did:'
              : questions[answers].question}
          </Text>
        </div>

        <div className={style.middle}>
          {isDone ? (
            <div className={style.status}>
              {/* TODO: replace with animal photo when we have habitat info */}
              <img className={style.animal} src={profileImage} alt="animal" />
              <Heading level="1" color="var(--hunterGreenMediumLight)" margin={{ bottom: '20px' }}>
                {`${correctAnswers}/${questions.length}`}
              </Heading>
              <Text size="large" textAlign="center">Thanks for learning with Zoolife!</Text>
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
                <Text size="medium">{questions[answers].answer1}</Text>
                <div className={style.circle}>
                  {correctAnswerInd && (
                    correctAnswerInd === 1 ? (
                      <FontAwesomeIcon icon={faCheckCircle} size="lg" color="var(--sage)" />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} size="lg" color="var(--red)" />
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
                <Text size="medium">{questions[answers].answer2}</Text>
                <div className={style.circle}>
                  {correctAnswerInd && (
                    correctAnswerInd === 2 ? (
                      <FontAwesomeIcon icon={faCheckCircle} size="lg" color="var(--sage)" />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} size="lg" color="var(--red)" />
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
                  <Text size="medium">{questions[answers].answer3}</Text>
                  <div className={style.circle}>
                    {correctAnswerInd && (
                      correctAnswerInd === 3 ? (
                        <FontAwesomeIcon icon={faCheckCircle} size="lg" color="var(--sage)" />
                      ) : (
                        <FontAwesomeIcon icon={faTimesCircle} size="lg" color="var(--red)" />
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
              style={{ background: 'white' }}
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

export default connect(
  ({ habitat: { habitatInfo: { profileImage } }}) => ({ profileImage }),
)(QuizCard);
