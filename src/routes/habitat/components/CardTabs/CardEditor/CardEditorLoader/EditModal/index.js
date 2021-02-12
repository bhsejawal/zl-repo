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
import { OutlineButton, SecondaryButton } from 'Components/Buttons';

import SingleIconCard from 'Cards/SingleIconCard';
import ThreeIconsCard from 'Cards/ThreeIconsCard';
import FourIconsCard from 'Cards/FourIconsCard';
import AnimalProfileCard from 'Cards/AnimalProfileCard';
import ConservationCard from 'Cards/ConservationCard';
import TwoVideosCard from 'Cards/TwoVideosCard';
import SingleVideoCard from 'Cards/SingleVideoCard';
import OriginAndHabitatCard from 'Cards/OriginAndHabitatCard';

import SingleIconCardForm from './SingleIconCardForm';
import ThreeIconsCardForm from './ThreeIconsCardForm';
import FourIconsCardForm from './FourIconsCardForm';
import AnimalProfileCardForm from './AnimalProfileCardForm';
import ConservationCardForm from './ConservationCardForm';
import TwoVideosCardForm from './TwoVideosCardForm';
import SingleVideoCardForm from './SingleVideoCardForm';
import OriginAndHabitatCardForm from './OriginAndHabitatCardForm';

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
} from '../../../constants';
import grommetTheme from '../../../../../../../grommetTheme';

import style from './style.scss';
import CardsList from './CardsList';

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
    try {
      const isValid = await formRef.current.validate();
      if (!isValid) {
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

  const onCardTypeSelect = useCallback((type, tag, data) => {
    setType(type);
    setTag(tag);
    setData(data);
  }, []);

  // this is used for input fields in the forms
  const onInputChange = useCallback(({ target }) => {
    const { prop } = target.dataset;
    setData({ ...data, [prop]: target.value });
  }, [data]);

  // this is used when update is not coming from an input field
  const onDataChange = useCallback((newData) => {
    setData({ ...data, ...newData });
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
                <Box pad="medium">
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
                      <div className="simpleSelect">
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
