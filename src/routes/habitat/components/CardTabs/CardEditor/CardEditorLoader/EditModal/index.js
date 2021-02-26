import { h } from 'preact';
import {
  useCallback,
  useReducer,
  useRef,
  useState,
} from 'preact/hooks';
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
import { OutlineButton, SecondaryButton } from 'Components/Buttons';
import classnames from 'classnames';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';

import SingleIconCard from 'Cards/SingleIconCard';
import ThreeIconsCard from 'Cards/ThreeIconsCard';
import FourIconsCard from 'Cards/FourIconsCard';
import AnimalProfileCard from 'Cards/AnimalProfileCard';
import ConservationCard from 'Cards/ConservationCard';
import TwoVideosCard from 'Cards/TwoVideosCard';
import SingleVideoCard from 'Cards/SingleVideoCard';
import OriginAndHabitatCard from 'Cards/OriginAndHabitatCard';
import AnimalBodyCard from 'Cards/AnimalBodyCard';
import QuizCard from 'Cards/QuizCard';

import SingleIconCardForm from './SingleIconCardForm';
import ThreeIconsCardForm from './ThreeIconsCardForm';
import FourIconsCardForm from './FourIconsCardForm';
import AnimalProfileCardForm from './AnimalProfileCardForm';
import ConservationCardForm from './ConservationCardForm';
import TwoVideosCardForm from './TwoVideosCardForm';
import SingleVideoCardForm from './SingleVideoCardForm';
import OriginAndHabitatCardForm from './OriginAndHabitatCardForm';
import AnimalBodyCardForm from './AnimalBodyCardForm';
import QuizCardForm from './QuizCardForm';

import CardsList from './CardsList';

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
  SINGLE_ICON_CARD_TYPE,
  THREE_ICONS_CARD_TYPE,
  FOUR_ICONS_CARD_TYPE,
  ANIMAL_PROFILE_CARD_TYPE,
  CONSERVATION_CARD_TYPE,
  TWO_VIDEOS_CARD_TYPE,
  SINGLE_VIDEO_CARD_TYPE,
  ORIGIN_AND_HABITAT_CARD_TYPE,
  ANIMAL_BODY_CARD_TYPE,
  QUIZ_CARD_TYPE,
} from '../../../constants';
import { SET_CARD_DATA, UPDATE_CARD_DATA } from './types';
import grommetTheme from '../../../../../../../grommetTheme';

import style from './style.scss';

const margins = {
  top: '20px',
  bottom: '20px',
  right: '20px',
  left: '20px',
};

const dataReducer = (data, { type, payload = {} }) => {
  if (type === SET_CARD_DATA) {
    return payload;
  }

  if (type === UPDATE_CARD_DATA) {
    return { ...data, ...payload };
  }

  return data;
};

const EditModal = ({
  card: {
    _id: cardId,
    data: cardData,
    tag: cardTag,
    type: cardType,
  } = {},
  habitatId,
  activeTab,
  onClose,
  addCardAction,
  updateCardAction,
  deleteCardAction,
}) => {
  const formRef = useRef();
  const [type, setType] = useState(cardType);
  const [tag, setTag] = useState(cardTag || QUICK_LOOK);
  const [data, dispatchData] = useReducer(dataReducer, cardData);
  const [error, setError] = useState();
  const [deleteActive, setDeleteActive] = useState(false);

  const { post, get } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const onPublish = async () => {
    try {
      const isValid = await formRef.current.validate();
      if (!isValid) {
        setError(true);
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }

    // if card is undefined, then it means it's new
    // otherwise it's edit
    if (!cardData) {
      try {
        setError(undefined);

        if (type === QUIZ_CARD_TYPE) {
          const { questions } = data;
          const { questionIds } = await post('admin/trivia/questions', { questions });
          // TODO: we need to read cameraId (or habitatId) from redux
          const { card: createdCard } = await createCard(
            habitatId,
            type,
            activeTab,
            tag,
            { questionIds },
          );
          // eslint-disable-next-line no-underscore-dangle
          const cardData = await get(`cards/${createdCard._id}/questions`);
          createdCard.data = cardData;
          addCardAction(createdCard);
        } else {
          // TODO: we need to read cameraId (or habitatId) from redux
          const { card: createdCard } = await createCard(habitatId, type, activeTab, tag, data);
          addCardAction(createdCard);
        }

        onClose();
      } catch (err) {
        console.error(err);
        setError(true);
      }
    } else {
      try {
        setError(undefined);

        if (type === QUIZ_CARD_TYPE) {
          const { questions } = data;
          const { questionIds } = await post('admin/trivia/questions', { questions });
          await updateCardApi(cardId, tag, { questionIds });
          const cardData = await get(`cards/${cardId}/questions`);
          updateCardAction(cardId, tag, cardData);
        } else {
          await updateCardApi(cardId, tag, data);
          updateCardAction(cardId, tag, data);
        }

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

  const onCardTypeSelect = useCallback((type, tag, data) => {
    setType(type);
    setTag(tag);
    dispatchData({ type: SET_CARD_DATA, payload: data });
  }, []);

  // this is used for input fields in the forms
  const onInputChange = useCallback(({ target }) => {
    const { prop } = target.dataset;
    dispatchData({ type: UPDATE_CARD_DATA, payload: { [prop]: target.value } })
  }, []);

  // this is used when update is not coming from an input field
  const onDataChange = useCallback((newData) => {
    dispatchData({ type: UPDATE_CARD_DATA, payload: newData });
  }, []);

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
            <Button
              plain
              margin="small"
              onClick={onClose}
              icon={<FontAwesomeIcon size="lg" icon={faTimes} />}
            />
          </Box>

          <Box flex="grow" justify="center" align="center">
            {!data && (
              <CardsList activeTab={activeTab} onContinue={onCardTypeSelect} />
            )}

            {deleteActive && (
              <Box pad="xlarge">
                <Heading textAlign="center" margin={{ top: '0' }} level="2">
                  Are you sure you want to delete this card?
                </Heading>
                <Box direction="row" justify="center">
                  <OutlineButton
                    label="Go Back"
                    margin={{ right: '10px' }}
                    onClick={() => setDeleteActive(false)}
                  />
                  <SecondaryButton primary label="Delete" onClick={onDelete} />
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
                <Box width="medium" height={{ max: '545px' }} pad={{ vertical: 'medium' }}>
                  <Heading margin={{ bottom: '20px', top: '0', left: '50px' }} level="2">Edit Card</Heading>

                  <div className={classnames(style.form, 'customScrollBar grey')}>
                    {type !== QUIZ_CARD_TYPE && (
                      <Box margin={{ bottom: '20px' }}>
                        <Heading margin={{ top: '0', bottom: '5px' }} level="5">Card Tag:</Heading>
                        <div className="simpleSelect">
                          <select onChange={onTagChange}>
                            <option
                              selected={tag === QUICK_LOOK}
                              value={QUICK_LOOK}
                            >
                              {QUICK_LOOK}
                            </option>
                            <option
                              selected={tag === FOOD_AND_DIET}
                              value={FOOD_AND_DIET}
                            >
                              {FOOD_AND_DIET}
                            </option>
                            <option
                              selected={tag === ORIGIN_AND_HABITAT}
                              value={ORIGIN_AND_HABITAT}
                            >
                              {ORIGIN_AND_HABITAT}
                            </option>
                            <option
                              selected={tag === THE_ANIMAL_BODY}
                              value={THE_ANIMAL_BODY}
                            >
                              {THE_ANIMAL_BODY}
                            </option>
                            <option
                              selected={tag === CONSERVATION}
                              value={CONSERVATION}
                            >
                              {CONSERVATION}
                            </option>
                            <option
                              selected={tag === BEHAVIOR}
                              value={BEHAVIOR}
                            >
                              {BEHAVIOR}
                            </option>
                            <option
                              selected={tag === FAMILY_LIFE}
                              value={FAMILY_LIFE}
                            >
                              {FAMILY_LIFE}
                            </option>
                          </select>

                          <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
                        </div>
                      </Box>
                    )}

                    {type === SINGLE_ICON_CARD_TYPE && (
                      <SingleIconCardForm
                        ref={formRef}
                        title={data.title}
                        text={data.text}
                        img={data.img}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === THREE_ICONS_CARD_TYPE && (
                      <ThreeIconsCardForm
                        ref={formRef}
                        title={data.title}
                        img1={data.img1}
                        img2={data.img2}
                        img3={data.img3}
                        text1={data.text1}
                        text2={data.text2}
                        text3={data.text3}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === FOUR_ICONS_CARD_TYPE && (
                      <FourIconsCardForm
                        ref={formRef}
                        title={data.title}
                        text={data.text}
                        img1={data.img1}
                        img2={data.img2}
                        img3={data.img3}
                        img4={data.img4}
                        icon1Txt={data.icon1Txt}
                        icon2Txt={data.icon2Txt}
                        icon3Txt={data.icon3Txt}
                        icon4Txt={data.icon4Txt}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === ANIMAL_PROFILE_CARD_TYPE && (
                      <AnimalProfileCardForm
                        ref={formRef}
                        img={data.img}
                        name={data.name}
                        title={data.title}
                        sex={data.sex}
                        dateOfBirth={data.dateOfBirth}
                        text1={data.text1}
                        text2={data.text2}
                        text3={data.text3}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === CONSERVATION_CARD_TYPE && (
                      <ConservationCardForm
                        ref={formRef}
                        status={data.status}
                        title={data.title}
                        text={data.text}
                        btnLabel={data.btnLabel}
                        btnLink={data.btnLink}
                        onInputChange={onInputChange}
                      />
                    )}

                    {type === TWO_VIDEOS_CARD_TYPE && (
                      <TwoVideosCardForm
                        ref={formRef}
                        video1Url={data.video1Url}
                        text1={data.text1}
                        video2Url={data.video2Url}
                        text2={data.text2}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === SINGLE_VIDEO_CARD_TYPE && (
                      <SingleVideoCardForm
                        ref={formRef}
                        videoUrl={data.videoUrl}
                        title={data.title}
                        text={data.text}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === ORIGIN_AND_HABITAT_CARD_TYPE && (
                      <OriginAndHabitatCardForm
                        ref={formRef}
                        title={data.title}
                        text={data.text}
                        location={data.location}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === ANIMAL_BODY_CARD_TYPE && (
                      <AnimalBodyCardForm
                        ref={formRef}
                        img={data.img}
                        parts={data.parts}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}

                    {type === QUIZ_CARD_TYPE && (
                      <QuizCardForm
                        ref={formRef}
                        questions={data.questions}
                        onInputChange={onInputChange}
                        onDataChange={onDataChange}
                      />
                    )}
                  </div>
                </Box>
                <Box height="520px" margin={{left: '11px'}} background="var(--lightGrey)" width="1px" />
                <Box pad={{vertical: 'medium', horizontal: '65px'}}>
                  {type === SINGLE_ICON_CARD_TYPE && (
                    <SingleIconCard
                      tag={tag}
                      img={data.img}
                      title={data.title}
                      text={data.text}
                    />
                  )}

                  {type === THREE_ICONS_CARD_TYPE && (
                    <ThreeIconsCard
                      tag={tag}
                      title={data.title}
                      img1={data.img1}
                      img2={data.img2}
                      img3={data.img3}
                      text1={data.text1}
                      text2={data.text2}
                      text3={data.text3}
                    />
                  )}

                  {type === FOUR_ICONS_CARD_TYPE && (
                    <FourIconsCard
                      tag={tag}
                      title={data.title}
                      text={data.text}
                      img1={data.img1}
                      img2={data.img2}
                      img3={data.img3}
                      img4={data.img4}
                      icon1Txt={data.icon1Txt}
                      icon2Txt={data.icon2Txt}
                      icon3Txt={data.icon3Txt}
                      icon4Txt={data.icon4Txt}
                    />
                  )}

                  {type === ANIMAL_PROFILE_CARD_TYPE && (
                    <AnimalProfileCard
                      tag={tag}
                      img={data.img}
                      name={data.name}
                      title={data.title}
                      sex={data.sex}
                      dateOfBirth={data.dateOfBirth}
                      text1={data.text1}
                      text2={data.text2}
                      text3={data.text3}
                    />
                  )}

                  {type === CONSERVATION_CARD_TYPE && (
                    <ConservationCard
                      tag={tag}
                      status={data.status}
                      title={data.title}
                      text={data.text}
                      btnLabel={data.btnLabel}
                      btnLink={data.btnLink}
                    />
                  )}

                  {type === TWO_VIDEOS_CARD_TYPE && (
                    <TwoVideosCard
                      tag={tag}
                      video1Url={data.video1Url}
                      text1={data.text1}
                      video2Url={data.video2Url}
                      text2={data.text2}
                    />
                  )}

                  {type === SINGLE_VIDEO_CARD_TYPE && (
                    <SingleVideoCard
                      tag={tag}
                      videoUrl={data.videoUrl}
                      title={data.title}
                      text={data.text}
                    />
                  )}

                  {type === ORIGIN_AND_HABITAT_CARD_TYPE && (
                    <OriginAndHabitatCard
                      tag={tag}
                      img={data.img}
                      title={data.title}
                      text={data.text}
                    />
                  )}

                  {type === ANIMAL_BODY_CARD_TYPE && (
                    <AnimalBodyCard
                      tag={tag}
                      img={data.img}
                      parts={data.parts}
                    />
                  )}

                  {type === QUIZ_CARD_TYPE && (
                    <QuizCard questions={data.questions} answers={data.answers} />
                  )}

                  <Box direction="row" justify={cardData ? 'between' : 'center'} pad={{top: '20px'}}>
                    {cardData && (
                      <OutlineButton
                        style={{minWidth: 'calc((100%/2) - 5px)'}}
                        label="Delete"
                        onClick={() => setDeleteActive(true)}
                      />
                    )}
                    <SecondaryButton
                      style={{minWidth: cardData && 'calc((100%/2) - 5px)'}}
                      label="Publish"
                      onClick={onPublish}
                    />
                  </Box>
                  {error && (
                    <Box>
                      <Text size="14px" textAlign="center" color="status-error" margin={{ top: '10px'}}>
                        There was an error.
                        <br />
                        Please check your input and try again.
                      </Text>
                    </Box>
                  )}
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
      habitatInfo: {
        _id: habitatId,
      },
    },
  }) => ({
    activeTab,
    habitatId,
  }),
  {
    addCardAction: addCard,
    updateCardAction: updateCard,
    deleteCardAction: deleteCard,
  },
)(EditModal);
