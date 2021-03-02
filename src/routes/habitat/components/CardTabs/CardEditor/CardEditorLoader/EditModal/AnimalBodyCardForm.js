import { h } from 'preact';
import { forwardRef, memo, useImperativeHandle } from 'preact/compat';
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'preact/hooks';
import { isEmpty, omit } from 'lodash-es';
import {
  Box,
  Heading,
  Button,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons';

import ImageSelector from 'Components/ImageSelector';
import CollapsibleCard from 'Components/CollapsibleCard';

import style from './style.scss';

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

const REMOVE_PART = 'REMOVE_PART';
const ADD_PART = 'ADD_PART';
const UPDATE_PART = 'UPDATE_PART';

const partsReducer = (parts, { type, payload = {} }) => {
  switch (type) {
    case REMOVE_PART: {
      const { part } = payload;
      return parts.filter((p) => p !== part);
    }
    case ADD_PART: {
      return [
        ...parts,
        {
          id: Symbol('id'),
          x: 50,
          y: 50,
          title: '',
          text: '',
        },
      ]
    }
    case UPDATE_PART: {
      return parts.map((part) => (part.id === payload.id ? payload : part));
    }
    default: {
      return parts;
    }
  }
};

const PartInputCard = memo(({
  part,
  errors,
  label,
  className,
  style: propStyle,
  onRemove,
  onChange,
}) => {
  const onRemoveHandler = (evt) => {
    evt.stopPropagation();
    onRemove(part);
  };

  const onChangeHandler = ({ target }) => {
    const { prop } = target.dataset;
    onChange({ ...part, [prop]: target.value });
  };

  return (
    <Box pad={{ vertical: 'small' }}>
      <CollapsibleCard
        className={className}
        style={propStyle}
        key={part.id}
        label={label}
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
          <Box margin={{ bottom: '20px' }}>
            <Heading margin={{ top: '0', bottom: '5px' }} level="5">Location (%):</Heading>
            <Box direction="row" justify="start">
              <input
                className="simpleInput"
                type="number"
                style={{ width: '60px' }}
                data-prop="x"
                value={part.x}
                min="0"
                // using 94 because with 100% it would go outside of the image
                max="94"
                onChange={onChangeHandler}
              />
              &nbsp;
              <input
                className="simpleInput"
                type="number"
                style={{ width: '60px' }}
                data-prop="y"
                value={part.y}
                min="0"
                // using 94 because with 100% it would go outside of the image
                max="94"
                onChange={onChangeHandler}
              />
            </Box>
          </Box>

          <Box margin={{ bottom: '20px' }}>
            <Heading margin={{ top: '0', bottom: '5px' }} level="5">Title:</Heading>
            <TextInput
              reverse
              value={part.title}
              data-prop="title"
              onChange={onChangeHandler}
              maxLength="20"
              icon={(
                <span style={{ color: errors?.title && 'var(--red)' }}>
                  {part.title?.length ?? 0}
                  /20
                </span>
              )}
            />
            {errors?.title && (
              <Box>
                <Text color="status-error">{errors?.title}</Text>
              </Box>
            )}
          </Box>
        </Box>

        <Box margin={{ bottom: '20px' }}>
          <Heading margin={{ top: '0', bottom: '5px' }} level="5">Description:</Heading>
          <div className={style.textAreaWrapper}>
            <TextArea
              value={part.text}
              className={style.textarea}
              rows="5"
              data-prop="text"
              onChange={onChangeHandler}
              maxLength="80"
            />
            <span className={style.bottomRight}>
              {part.text?.length ?? 0}
              /80
            </span>
          </div>
          {errors?.text && (
            <Box>
              <Text color="status-error">{errors?.text}</Text>
            </Box>
          )}
        </Box>
      </CollapsibleCard>
    </Box>
  )
});

const AnimalBodyCardForm = forwardRef(({
  img,
  parts,
  onInputChange,
  onDataChange,
}, ref) => {
  const imgSelectorRef = useRef();
  const [errors, dispatchErrAction] = useReducer(errorsReducer, {});
  const [localParts, dispatchPartsAction] = useReducer(partsReducer, parts);

  // we are using this approach to be able to
  // pass functions to our parts card that will never change
  // and therefore reduce number of renders
  useEffect(() => {
    if (parts !== localParts) {
      onDataChange({ parts: localParts });

      localParts.forEach(({ title, text }, ind) => {
        if (!title) {
          dispatchErrAction({
            type: SET_ERROR,
            payload: { ind, prop: 'title', msg: 'Title is required' },
          });
        } else {
          dispatchErrAction({
            type: REMOVE_ERROR,
            payload: { ind, prop: 'title' },
          })
        }

        if (!text) {
          dispatchErrAction({
            type: SET_ERROR,
            payload: { ind, prop: 'text', msg: 'Title is required' },
          });
        } else {
          dispatchErrAction({
            type: REMOVE_ERROR,
            payload: { ind, prop: 'text' },
          })
        }
      });
    }
  }, [localParts, parts, onDataChange]);

  const addNewPart = useCallback(() => {
    dispatchPartsAction({ type: ADD_PART });
  }, []);

  const removePart = useCallback((part) => {
    dispatchPartsAction({ type: REMOVE_PART, payload: { part } });
  }, []);

  const onImgChange = useCallback(
    (img) => onDataChange({ img }),
    [onDataChange],
  );

  const onPartFormChange = useCallback((newPart) => {
    dispatchPartsAction({ type: UPDATE_PART, payload: newPart });
  }, []);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const cardsValid = Object.values(errors).every(isEmpty);
      const isImgValid = await imgSelectorRef.current.validate();
      return isImgValid && cardsValid;
    },
  }));

  return (
    <>
      <Box margin={{ bottom: '20px' }}>
        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Photo:</Heading>
        <ImageSelector
          required
          prop="img"
          url={img}
          ref={imgSelectorRef}
          placeholder="https://"
          constraints={{
            acceptedFormats: ['png', 'jpg', 'jpeg'],
            maxResolution: 1000,
            minResolution: 500,
            aspectRatio: '1:1',
            maxFileSize: 100_000,
          }}
          onBlur={onInputChange}
          onChange={onImgChange}
        />
      </Box>

      {parts.map((part, ind) => (
        <PartInputCard
          part={part}
          ind={ind}
          errors={errors[ind]}
          label={`Body Part ${ind + 1}`}
          // style={{ marginBottom: ind < parts.length - 1 ? '20px' : undefined }}
          onRemove={parts.length > 1 ? removePart : undefined}
          onChange={onPartFormChange}
        />
      ))}

      <Box pad="medium" align="center">
        <Button label="Add New Body Part" onClick={addNewPart} />
      </Box>
    </>
  );
});

export default AnimalBodyCardForm;
