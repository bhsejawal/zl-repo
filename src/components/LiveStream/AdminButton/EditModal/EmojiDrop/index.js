import { createRef, h } from 'preact';
import { connect } from 'react-redux';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'preact/hooks';
import {
  Box,
  Heading,
  Menu,
  Text,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import { range } from 'lodash-es';
import useFetch from 'use-http';

import ImageSelector from 'Components/ImageSelector';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import { EmojiBasketNoRedux } from 'Components/LiveStream/StreamInteractiveArea/StreamControls/EmojiBasket';
import { buildURL } from 'Shared/fetch';
import { setHabitatProps } from '../../../../../routes/habitat/actions';

import style from './style.scss';

const imageConstraints = {
  maxResolution: 150,
  minResolution: 50,
  maxFileSize: 50_000,
  acceptedFormats: ['jpg', 'jpeg', 'png', 'svg'],
};

const DELETE_TAB = 'DELETE_TAB';
const ADD_TAB = 'ADD_TAB';
const SET_ICON = 'SET_ICON';
const SET_EMOJI_ITEM = 'SET_EMOJI_ITEM';

const emojiDropsReducer = (tabs, { type, payload = {} }) => {
  switch (type) {
    case DELETE_TAB: {
      const { ind } = payload;
      return tabs.filter((_tab, i) => ind !== i);
    }

    case ADD_TAB: {
      return [
        ...tabs,
        { icon: '', items: ['', '', '', '', '', '', '', ''] },
      ]
    }

    case SET_ICON: {
      const { ind, value: icon } = payload;
      return tabs.map((tab, i) => (ind === i ? { ...tab, icon } : tab));
    }

    case SET_EMOJI_ITEM: {
      const { tabInd, ind, value } = payload;
      return tabs.map((tab, ti) => (ti === tabInd ? {
        ...tab,
        items: tab.items.map((oldVal, i) => (ind === i ? value : oldVal)),
      } : tab));
    }

    default: {
      return tabs;
    }
  }
};

const EmojiDrop = ({
  habitatId,
  emojiDrops: initialEmojiDrops,
  setHabitatPropsAction,
}) => {
  const iconRef = useRef();
  const [deleteTabActive, setDeleteTabActive] = useState();
  const [activeTabInd, setActiveTabInd] = useState(0);
  const [validationError, setValidationError] = useState();
  const [emojiDrops, dispatch] = useReducer(emojiDropsReducer, initialEmojiDrops);
  const { icon, items: emojiItems } = useMemo(
    () => (emojiDrops[activeTabInd] || {}),
    [emojiDrops, activeTabInd],
  );

  useEffect(() => {
    if (emojiDrops.length === 0) {
      dispatch({ type: ADD_TAB });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabMenuItems = useMemo(() => emojiDrops.map((_tab, ind) => ({
    label: `Emoji Tab ${ind + 1}`,
    onClick: () => setActiveTabInd(ind),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [emojiDrops.length]);

  const emojiItemRefs = useMemo(() => range(8).map(() => createRef()), []);

  const {
    patch: patchBaskets,
    response: patchResponse,
    loading,
    error,
  } = useFetch(
    buildURL(`admin/habitats/${habitatId}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const onDeleteTab = () => {
    setDeleteTabActive(false);
    setActiveTabInd(0);
    dispatch({ type: DELETE_TAB, payload: { ind: activeTabInd } });
  };

  const onAddTab = () => {
    dispatch({ type: ADD_TAB });
    setActiveTabInd(emojiDrops.length);
  };

  const onIconChange = useCallback((value) => {
    dispatch({ type: SET_ICON, payload: { value, ind: activeTabInd } });
  }, [activeTabInd]);

  const onEmojiItemChange = (ind) => (value) => {
    dispatch({
      type: SET_EMOJI_ITEM,
      payload: {
        tabInd: activeTabInd,
        ind,
        value,
      },
    });
  };

  const onPublish = async () => {
    const validations = await Promise.all([iconRef, ...emojiItemRefs]
      .map(({ current }) => current.validate()));
    const currentTabValid = validations.every((isValid) => isValid);
    const emptyValidations = emojiDrops
      .every(({ icon, items }) => !!icon && items.every((item) => !!item));

    if (!currentTabValid) {
      setValidationError('Your input is not valid.');
    } else if (!emptyValidations) {
      setValidationError('Missing required data in other tabs.')
    } else {
      setValidationError(false);
      await patchBaskets({ emojiDrops });
      if (patchResponse.ok) {
        setHabitatPropsAction({ emojiDrops });
      }
    }
  }

  return (
    <Box justify="center" align="center" flex={deleteTabActive ? 'grow' : undefined}>
      {deleteTabActive && (
        <Box pad="xlarge">
          <Heading textAlign="center" margin={{ top: '0' }} level="2">
            Are you sure you want to delete Emoji Tab
            {' '}
            {activeTabInd + 1}
            ?
          </Heading>
          <Box direction="row" justify="center">
            <OutlineButton
              label="Go Back"
              margin={{ right: '10px' }}
              onClick={() => setDeleteTabActive(false)}
            />
            <PrimaryButton
              label="Delete"
              onClick={onDeleteTab}
            />
          </Box>
        </Box>
      )}

      {!deleteTabActive && (
        <Box fill align="stretch" direction="row">
          <Box width="600px" pad="medium">
            <Box height={{ min: 'auto' }} direction="row" justify="evenly" align="center">
              <Menu
                size="medium"
                icon={<FontAwesomeIcon icon={faChevronDown} />}
                label={`Emoji Tab ${activeTabInd + 1}`}
                items={tabMenuItems}
              />

              <Box width="300px" justify="between" direction="row">
                <PrimaryButton
                  size="medium"
                  label="Delete Tab"
                  onClick={() => setDeleteTabActive(true)}
                />
                <OutlineButton
                  onClick={onAddTab}
                  size="medium"
                  label="Add Tab"
                />
              </Box>
            </Box>

            <Box margin={{ top: 'medium' }} pad={{ horizontal: 'medium' }} className="customScrollBar grey">
              <ImageSelector
                label="Tab Icon:"
                ref={iconRef}
                url={icon}
                required
                constraints={imageConstraints}
                className={style.tabIcon}
                onChange={onIconChange}
              />

              {range(8).map((ind) => (
                <ImageSelector
                  required
                  label={`Emoji ${ind + 1}`}
                  url={emojiItems?.[ind] ?? ''}
                  ref={emojiItemRefs?.[ind]}
                  constraints={imageConstraints}
                  className={style.emojiIcon}
                  onChange={onEmojiItemChange(ind)}
                />
              ))}
            </Box>
          </Box>

          <Box
            border={{ side: 'left', color: 'var(--lightGrey)' }}
            flex="grow"
            justify="between"
            align="center"
            pad="medium"
            overflow="hidden"
          >
            <Heading level="4">Preview Changes</Heading>

            <EmojiBasketNoRedux
              showEmojiBasket
              emojis={emojiDrops}
              tabIndex={activeTabInd}
              className={style.emojiBasket}
            />

            <Box>
              {/* TODO: maybe we should add a success message here */}
              {(error || validationError) && (
                <Box pad={{ vertical: 'medium' }}>
                  <Text size="14px" textAlign="center" color="status-error" margin={{ top: '10px'}}>
                    {validationError || 'There was an error.'}
                    <br />
                    Please check your input and try again.
                  </Text>
                </Box>
              )}

              <PrimaryButton
                loading={loading}
                label="Publish"
                onClick={onPublish}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
        emojiDrops,
      },
    },
  }) => ({
    habitatId,
    emojiDrops,
  }),
  { setHabitatPropsAction: setHabitatProps },
)(EmojiDrop);
