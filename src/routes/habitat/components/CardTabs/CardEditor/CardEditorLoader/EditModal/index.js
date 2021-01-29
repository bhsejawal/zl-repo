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
import { subMonths } from 'date-fns';

// NOTE: we are currently unable set human readable name because of this bug
// https://github.com/webpack-contrib/file-loader/issues/367#issuecomment-593931637
// eslint-disable-next-line max-len
// import defaultImg from 'file-loader?name=placeholder.svg!../../../../../../../assets/quick-look-card-img.svg';
import defaultImg from '../../../../../../../assets/quick-look-card-img.svg';
import defaultAnimalImg from '../../../../../../../assets/default-animal-card-img.png';

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
  ENDANGERED,
  TWO_VIDEOS_CARD_TYPE,
  SINGLE_VIDEO_CARD_TYPE,
  ORIGIN_AND_HABITAT_CARD_TYPE,
} from '../../../constants';
import grommetTheme from '../../../../../../../grommetTheme';

import SingleIconCard from '../../../cards/SingleIconCard';
import ThreeIconsCard from '../../../cards/ThreeIconsCard';
import FourIconsCard from '../../../cards/FourIconsCard';
import AnimalProfileCard from '../../../cards/AnimalProfileCard';
import ConservationCard from '../../../cards/ConservationCard';
import TwoVideosCard from '../../../cards/TwoVideosCard';
import SingleVideoCard from '../../../cards/SingleVideoCard';
import OriginAndHabitatCard from '../../../cards/OriginAndHabitatCard';

import SingleIconCardForm from './SingleIconCardForm';
import ThreeIconsCardForm from './ThreeIconsCardForm';
import FourIconsCardForm from './FourIconsCardForm';
import AnimalProfileCardForm from './AnimalProfileCardForm';
import ConservationCardForm from './ConservationCardForm';
import TwoVideosCardForm from './TwoVideosCardForm';
import SingleVideoCardForm from './SingleVideoCardForm';
import OriginAndHabitatCardForm from './OriginAndHabitatCardForm';

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

  const createSingleIconCard = () => {
    setType(SINGLE_ICON_CARD_TYPE);
    setTag(QUICK_LOOK);
    setData({
      title: 'Title',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      img: defaultImg,
    });
  };

  const createThreeIconsCard = () => {
    setType(THREE_ICONS_CARD_TYPE);
    setTag(QUICK_LOOK);
    setData({
      title: 'Title',
      img1: defaultImg,
      text1: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
      img2: defaultImg,
      text2: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
      img3: defaultImg,
      text3: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
    });
  }

  const createFourIconsCard = () => {
    setType(FOUR_ICONS_CARD_TYPE);
    setTag(FOOD_AND_DIET);
    setData({
      title: 'Title',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      img1: defaultImg,
      icon1Txt: 'Lorem',
      img2: defaultImg,
      icon2Txt: 'Lorem',
      img3: defaultImg,
      icon3Txt: 'Lorem',
      img4: defaultImg,
      icon4Txt: 'Lorem',
    });
  };

  const createAnimalProfileCard = () => {
    setType(ANIMAL_PROFILE_CARD_TYPE);
    setTag(CONSERVATION);
    setData({
      img: defaultAnimalImg,
      name: 'Kobe',
      title: 'The energeting baby',
      sex: 'Male',
      dateOfBirth: subMonths(new Date(), 6).toISOString(),
      text1: 'Baby Kobe was Born in June 7 2018 at Toronto Zoo',
      text2: 'The youngest child of Charlie and Cleo',
      text3: 'Loves to climb, play and annoy his Mom and Aunties',
    });
  };

  const createConservationCard = () => {
    setType(CONSERVATION_CARD_TYPE);
    setTag(CONSERVATION);
    setData({
      status: ENDANGERED,
      title: 'An Endangered Species',
      text: 'Nearly 80 percent of western lowland gorillas live in unprotected areas that are vulnerable to poaching. Habitat loss is the greatest reason for their decline.',
      btnLabel: 'Donate to the Gorillas',
      btnLink: 'https://example.com',
    });
  };

  const createTwoVideosCard = () => {
    setType(TWO_VIDEOS_CARD_TYPE);
    setTag(QUICK_LOOK);
    setData({
      video1Url: 'https://production.assets.clips.twitchcdn.net/AT-cm%7C1021969410.mp4',
      text1: 'Kobe feeding from Mom, Cleo.',
      video2Url: 'https://production.assets.clips.twitchcdn.net/AT-cm%7C1021969410.mp4',
      text2: 'Kobe playing with his favorite enrichment toy - hay clouds!',
    });
  };

  const createSingleVideoCard = () => {
    setType(SINGLE_VIDEO_CARD_TYPE);
    setTag(FOOD_AND_DIET);
    setData({
      videoUrl: 'https://nbt-photos.s3.amazonaws.com/assets/mixkit-red-frog-on-a-log-1487-large-1611786559965.mp4',
      title: 'Food & Diet',
      text: 'Gorillas eat an entirely vegetarian diet and grow up to 400 lbs!',
    });
  };

  const createOriginAndHabitatCard = () => {
    setType(ORIGIN_AND_HABITAT_CARD_TYPE);
    setTag(ORIGIN_AND_HABITAT);
    setData({
      title: 'Title',
      location: 'Africa',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      img: `https://maps.googleapis.com/maps/api/staticmap?center=Africa&size=250x250&key=${process.env.PREACT_APP_MAPS_API_KEY}`,
    });
  };

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
              <>
                {/* TODO: implement design - this is only temporary */}
                <Button label="Create Single Icon Card" onClick={createSingleIconCard} />
                <p />
                <Button label="Create Three Icon Card" onClick={createThreeIconsCard} />
                <p />
                <Button label="Create Four Icon Card" onClick={createFourIconsCard} />
                <p />
                <Button label="Create Animal Profile Card" onClick={createAnimalProfileCard} />
                <p />
                <Button label="Create Conservation Card" onClick={createConservationCard} />
                <p />
                <Button label="Create Two Videos Card" onClick={createTwoVideosCard} />
                <p />
                <Button label="Create Single Video Card" onClick={createSingleVideoCard} />
                <p />
                <Button label="Create Origin & Habitat Card" onClick={createOriginAndHabitatCard} />
              </>
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
