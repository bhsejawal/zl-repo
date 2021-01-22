import { h } from 'preact';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/pro-solid-svg-icons';
import {
  Box,
  Text,
  Layer,
  Button,
  Heading,
  Grommet,
} from 'grommet';
import { useCallback, useRef, useState } from 'preact/hooks';

import defaultImg from '../../../../../../../assets/quick-look-card-img.svg';

import { addCard, updateCard, deleteCard } from './actions';
import {
  createCard,
  updateCard as updateCardApi,
  deleteCard as deleteCardApi,
} from './api';
import {
  BEHAVIOR,
  CONSERVATION,
  FAMILY_LIFE,
  FOOD_AND_DIET,
  ORIGIN_AND_HABITAT,
  QUICK_LOOK,
  THE_ANIMAL_BODY,
} from '../../../constants';
import grommetTheme from '../../../../../../../grommetTheme';

import Card1 from '../../../cards/Card1';
import Card1Form from './Card1Form';

import style from './style.scss';

const margins = {
  top: '20px',
  bottom: '20px',
  right: '20px',
  left: '20px',
};

const EditModal = ({
  card: {
    _id: cardId,
    data: cardData,
    tag: cardTag,
    type: cardType,
  } = {},
  activeTab,
  onClose,
  addCardAction,
  updateCardAction,
  deleteCardAction,
}) => {
  const formRef = useRef();
  const [type, setType] = useState(cardType);
  const [tag, setTag] = useState(cardTag || QUICK_LOOK);
  const [data, setData] = useState(cardData);
  const [error, setError] = useState();
  const [deleteActive, setDeleteActive] = useState(false);

  const onPublish = async () => {
    const isValid = formRef.current.validate();
    if (!isValid) {
      return;
    }

    // if card is undefined, then it means it's new
    // otherwise it's edit
    if (!cardData) {
      try {
        setError(undefined);
        // TODO: we need to read cameraId (or habitatId) from redux
        const { card: createdCard } = await createCard(null, type, activeTab, tag, data);
        addCardAction(createdCard);
        onClose();
      } catch (err) {
        console.error(err);
        setError(true);
      }
    } else {
      try {
        setError(undefined);
        await updateCardApi(cardId, tag, data);
        updateCardAction(cardId, tag, data);
        onClose();
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }
  };

  const onDelete = async () => {
    try {
      setError(undefined);
      await deleteCardApi(cardId);
      deleteCardAction(cardId);
      onClose();
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const createType1Card = () => {
    // initial data that should be updated
    setType('type1');
    setData({});
  };

  const onDataChange = useCallback(({ target }) => {
    const { prop } = target.dataset;
    setData({ ...data, [prop]: target.value });
  }, [data]);

  const onTagChange = ({ target }) => {
    setTag(target.value);
  };

  return (
    <Grommet theme={grommetTheme}>
      <Layer margin={margins} onClickOutside={onClose}>
        <Box fill style={{ minWidth: '650px', minHeight: '600px' }}>
          <Box
            direction="row"
            align="center"
            justify="end"
            as="header"
          >
            <Button onClick={onClose} icon={<FontAwesomeIcon icon={faTimes} />} />
          </Box>

          <Box flex="grow" justify="center" align="center">
            {!data && (
              <Button label="Create Type 1 Card" onClick={createType1Card} />
            )}

            {deleteActive && (
              <Box pad="xlarge">
                <Heading textAlign="center" margin={{ top: '0' }} level="2">
                  Are you sure you want to delete this card?
                </Heading>
                <Box direction="row" justify="center">
                  <Button
                    label="Go Back"
                    margin={{ right: '10px' }}
                    onClick={() => setDeleteActive(false)}
                  />
                  <Button primary label="Delete" onClick={onDelete} />
                </Box>
                <Box margin="medium">
                  {error && (
                    <Text size="14px" textAlign="center" color="status-error">
                      There was an error. Please try again.
                    </Text>
                  )}
                </Box>
              </Box>
            )}

            {data && !deleteActive && (
              <Box fill align="stretch" direction="row">
                <Box pad="medium">
                  {type === 'type1' && (
                    <Card1
                      tag={tag}
                      img={data.img || defaultImg}
                      title={data.title || 'A Quick Look'}
                      text={data.text || 'We share 99% of our DNA with these majestic creatures. Explore the world of the Western Lowland Gorillas!'}
                    />
                  )}

                  <Box direction="row" justify="center" pad="small">
                    {cardData && (
                      <Button
                        margin={{ right: '10px' }}
                        label="Delete"
                        onClick={() => setDeleteActive(true)}
                      />
                    )}
                    <Button label="Publish" primary onClick={onPublish} />
                  </Box>
                  {error && (
                    <Box>
                      <Text size="14px" textAlign="center" color="status-error">
                        There was an error. Please try again.
                      </Text>
                    </Box>
                  )}
                </Box>

                <Box height={{ max: '545px' }} pad={{ vertical: 'medium' }}>
                  <Heading margin={{ bottom: '20px', top: '0', left: '24px' }} level="2">Edit Card</Heading>

                  <div className={style.form}>
                    <Box margin={{ bottom: '20px' }}>
                      <Heading margin={{ top: '0', bottom: '5px' }} level="5">Card Tag:</Heading>
                      <div className={style.tagSelect}>
                        <select onChange={onTagChange}>
                          <option selected={tag === QUICK_LOOK} value={QUICK_LOOK}>
                            {QUICK_LOOK}
                          </option>
                          <option selected={tag === FOOD_AND_DIET} value={FOOD_AND_DIET}>
                            {FOOD_AND_DIET}
                          </option>
                          <option selected={tag === ORIGIN_AND_HABITAT} value={ORIGIN_AND_HABITAT}>
                            {ORIGIN_AND_HABITAT}
                          </option>
                          <option selected={tag === THE_ANIMAL_BODY} value={THE_ANIMAL_BODY}>
                            {THE_ANIMAL_BODY}
                          </option>
                          <option selected={tag === CONSERVATION} value={CONSERVATION}>
                            {CONSERVATION}
                          </option>
                          <option selected={tag === BEHAVIOR} value={BEHAVIOR}>
                            {BEHAVIOR}
                          </option>
                          <option selected={tag === FAMILY_LIFE} value={FAMILY_LIFE}>
                            {FAMILY_LIFE}
                          </option>
                        </select>

                        <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
                      </div>
                    </Box>

                    {type === 'type1' && (
                      <Card1Form
                        ref={formRef}
                        title={data.title}
                        text={data.text}
                        img={data.img}
                        onDataChange={onDataChange}
                      />
                    )}
                  </div>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Layer>
    </Grommet>
  );
};

export default connect(
  ({
    habitat: {
      cards: {
        activeTab,
      },
    },
  }) => ({
    activeTab,
  }),
  {
    addCardAction: addCard,
    updateCardAction: updateCard,
    deleteCardAction: deleteCard,
  },
)(EditModal);
