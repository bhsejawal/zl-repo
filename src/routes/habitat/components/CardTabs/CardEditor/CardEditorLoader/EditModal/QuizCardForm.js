import { h } from 'preact';
import { memo, forwardRef, useImperativeHandle } from 'preact/compat';
import { useCallback, useEffect, useReducer } from 'preact/hooks';
import {
  Box,
  Text,
  Heading,
  TextArea,
  TextInput,
  Button,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-light-svg-icons';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { isEmpty, omit } from 'lodash-es';

import CollapsibleCard from 'Components/CollapsibleCard';
import { PrimaryButton } from 'Components/Buttons';

import style from './style.scss';

const QuestionCard = memo(({
  ind,
  question,
  errors,
  label,
  className,
  style: propStyle,
  onRemove,
  onChange,
  onCardOpen,
}) => {
  const onRemoveHandler = (evt) => {
    evt.stopPropagation();
    onRemove(question);
  };

  const onChangeHandler = ({ target }) => {
    const { prop } = target.dataset;
    onChange({ ...question, [prop]: target.value });
  };

  const onOpen = useCallback(() => onCardOpen(ind), [onCardOpen, ind]);

  return (
    <Box pad={{ vertical: 'small' }}>
      <CollapsibleCard
        className={className}
        style={propStyle}
        // eslint-disable-next-line no-underscore-dangle
        key={question._id}
        label={label}
        onOpen={onOpen}
        icon={(
          <Button
            plain
            title={!onRemove ? 'At least one card is required' : undefined}
            disabled={!onRemove}
            onClick={onRemoveHandler}
          >
            <FontAwesomeIcon
              style={{ opacity: !onRemove ? '.3' : undefined }}
              icon={faTrashAlt}
            />
          </Button>
        )}
      >
        <Box margin={{ bottom: '20px' }}>
          <Heading margin={{ top: '0', bottom: '5px' }} level="5">Question:</Heading>
          <div className={style.textAreaWrapper}>
            <TextArea
              value={question.question}
              className={style.textarea}
              rows="5"
              data-prop="question"
              onChange={onChangeHandler}
              maxLength="90"
            />
            <span className={style.bottomRight}>
              {question.question?.length ?? 0}
              /90
            </span>
          </div>
          {errors?.question && (
            <Box>
              <Text color="status-error">{errors?.question}</Text>
            </Box>
          )}
        </Box>

        <Box margin={{ bottom: '20px' }}>
          <Heading margin={{ top: '0', bottom: '5px' }} level="5">Answer 1:</Heading>
          <TextInput
            reverse
            value={question.answer1}
            data-prop="answer1"
            onChange={onChangeHandler}
            maxLength="50"
            icon={(
              <span style={{ color: errors?.title && 'var(--red)' }}>
                {question.answer1?.length ?? 0}
                /50
              </span>
            )}
          />
          {errors?.answer1 && (
            <Box>
              <Text color="status-error">{errors?.answer1}</Text>
            </Box>
          )}
        </Box>

        <Box margin={{ bottom: '20px' }}>
          <Heading margin={{ top: '0', bottom: '5px' }} level="5">Answer 2:</Heading>
          <TextInput
            reverse
            value={question.answer2}
            data-prop="answer2"
            onChange={onChangeHandler}
            maxLength="50"
            icon={(
              <span style={{ color: errors?.title && 'var(--red)' }}>
                {question.answer2?.length ?? 0}
                /50
              </span>
            )}
          />
          {errors?.answer2 && (
            <Box>
              <Text color="status-error">{errors?.answer2}</Text>
            </Box>
          )}
        </Box>

        <Box margin={{ bottom: '20px' }}>
          <Heading margin={{ top: '0', bottom: '5px' }} level="5">Answer 3:</Heading>
          <TextInput
            reverse
            value={question.answer3}
            data-prop="answer3"
            onChange={onChangeHandler}
            maxLength="50"
            icon={(
              <span style={{ color: errors?.title && 'var(--red)' }}>
                {question.answer3?.length ?? 0}
                /50
              </span>
            )}
          />
          {errors?.answer3 && (
            <Box>
              <Text color="status-error">{errors?.answer3}</Text>
            </Box>
          )}
        </Box>

        <div className="simpleSelect">
          <select data-prop="correctAnswer" onChange={onChangeHandler}>
            <option value="1" selected={question.correctAnswer === 1}>1</option>
            <option value="2" selected={question.correctAnswer === 2}>2</option>
            {question.answer3 && <option value="3" selected={question.correctAnswer === 3}>3</option>}
          </select>
          <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
        </div>
      </CollapsibleCard>
    </Box>
  )
});

const SET_ERROR = 'SET_ERROR';
const REMOVE_ERROR = 'REMOVE_ERROR';

const errorsReducer = (state, { type, payload }) => {
  switch (type) {
    case SET_ERROR: {
      const { ind, prop, msg } = payload;
      return {
        ...state,
        [ind]: { ...(state[ind] || {}), [prop]: msg },
      };
    }
    case REMOVE_ERROR: {
      const { ind, prop } = payload;
      return {
        ...state,
        [ind]: omit(state[ind], [prop]),
      };
    }
    default: {
      return state;
    }
  }
};

const REMOVE_QUESTION = 'REMOVE_QUESTION';
const ADD_QUESTION = 'ADD_QUESTION';
const UPDATE_QUESTION = 'UPDATE_QUESTION';

// TODO: we can move this to index.js and simplify this and AnimalBodyCard
const questionsReducer = (questions, { type, payload = {} }) => {
  switch (type) {
    case REMOVE_QUESTION: {
      const { question } = payload;
      return questions.filter((q) => q !== question);
    }
    case ADD_QUESTION: {
      return [
        ...questions,
        {
          // TODO: question data
        },
      ]
    }
    case UPDATE_QUESTION: {
      // eslint-disable-next-line no-underscore-dangle
      return questions.map((question) => (question._id === payload._id ? payload : question));
    }
    default: {
      return questions;
    }
  }
};

const SingleIconCardForm = forwardRef(({ questions, onDataChange }, ref) => {
  const [errors, dispatchErrAction] = useReducer(errorsReducer, {});
  const [localQuestions, dispatchQuestionsAction] = useReducer(questionsReducer, questions);

  useImperativeHandle(ref, () => ({
    validate: async () => Object.values(errors).every(isEmpty),
  }));

  // we are using this approach to be able to
  // pass functions to our parts card that will never change
  // and therefore reduce number of renders
  useEffect(() => {
    if (questions !== localQuestions) {
      onDataChange({ questions: localQuestions });

      localQuestions.forEach((question, ind) => {
        ['question', 'answer1', 'answer2'].forEach((prop) => {
          if (!question[prop]) {
            dispatchErrAction({
              type: SET_ERROR,
              payload: { ind, prop, msg: 'This field is required' },
            });
          } else {
            dispatchErrAction({
              type: REMOVE_ERROR,
              payload: { ind, prop },
            });
          }
        });
      });
    }
  }, [localQuestions, questions, onDataChange]);

  const addNewCard = useCallback(() => {
    dispatchQuestionsAction({ type: ADD_QUESTION });
  }, []);

  const removeCard = useCallback((question) => {
    dispatchQuestionsAction({ type: REMOVE_QUESTION, payload: { question } });
  }, []);

  const onCardFormChange = useCallback((newCard) => {
    dispatchQuestionsAction({ type: UPDATE_QUESTION, payload: newCard });
  }, []);

  const onCardOpen = useCallback((ind) => {
    onDataChange({ answers: ind });
  }, [onDataChange]);

  return (
    <>
      {questions.map((question, ind) => (
        <QuestionCard
          question={question}
          ind={ind}
          errors={errors[ind]}
          label={`Question ${ind + 1}`}
          // style={{ marginBottom: ind < parts.length - 1 ? '20px' : undefined }}
          onRemove={questions.length > 1 ? removeCard : undefined}
          onChange={onCardFormChange}
          onCardOpen={onCardOpen}
        />
      ))}

      <Box pad="medium" align="center">
        <PrimaryButton label="Add New Question" onClick={addNewCard} />
      </Box>
    </>
  );
});

export default SingleIconCardForm;
