import { h } from 'preact';
import { Link } from 'preact-router';
import { connect } from 'react-redux';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {
  Box,
  Image,
  TextInput,
  Text,
  grommet,
  Grommet,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLockAlt } from '@fortawesome/pro-solid-svg-icons';
import { deepMerge } from 'grommet/utils';
import { differenceInMinutes } from 'date-fns';
import classnames from 'classnames';
import useFetch from 'use-http';

import HabitatStatus from 'Components/HabitatCard/HabitatStatus';
import { buildURL } from 'Shared/fetch';
import { setHabitats } from '../../../redux/actions';
import { useWindowResize } from '../../../hooks';
import zoolifeTheme from '../../../grommetTheme';

import style from './style.scss';

const theme = deepMerge(grommet, zoolifeTheme, {
  global: {
    drop: {
      shadowSize: 'medium',
      extend: `
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        overflow: hidden;
      `,
    },
  },
  button: {
    extend: 'border-radius: 0;',
  },
});

const Search = ({
  className,
  allHabitats,
  subscription,
  setHabitatsAction,
}) => {
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [value, setValue] = useState('');
  const boxRef = useRef();
  const lastFetchRef = useRef();
  const { width: windowWidth } = useWindowResize();

  const { get, response } = useFetch(buildURL('/habitats'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const onSuggestionsOpen = useCallback(() => setSuggestionOpen(true), []);
  const onSuggestionsClose = useCallback(() => setSuggestionOpen(false), []);

  const onSearchFocus = async () => {
    const now = new Date();
    // refresh habitats on focus if data is older than a minute
    if (!lastFetchRef.current || differenceInMinutes(now, lastFetchRef.current) > 1) {
      lastFetchRef.current = now;
      await get();
      if (response.ok) {
        setHabitatsAction(response.data.habitats)
      }
    }
  };

  const onChange = useCallback(({ target }) => {
    setValue(target.value);
  }, []);

  const onHabitatClick = useCallback(() => {
    setValue('');
  }, []);

  const suggestions = useMemo(() => allHabitats
    .filter(({ title, animal, hidden }) => !hidden && (
      title?.toLowerCase().includes(value)
        || animal?.toLowerCase().includes(value)
    )).sort((h1, h2) => {
      if (h1.online) {
        return -1;
      }
      if (h2.online) {
        return 1;
      }
      return 0;
    }).map(({
      _id,
      profileImage,
      title,
      online,
      liveTalk,
      slug,
      zoo,
    }, ind, list) => ({
      value: _id,
      label: (
        <Link
          className={style.suggestion}
          href={encodeURI(`/h/${zoo?.slug}/${slug}`)}
          onClick={onHabitatClick}
        >
          <Box
            direction="row"
            pad="small"
            align="center"
            gap="small"
            round={false}
            border={ind < list.length - 1 ? 'bottom' : undefined}
          >
            <Box width="30px" height="30px">
              <Image
                src={profileImage}
                style={{ borderRadius: '100%' }}
                className={classnames(style.img, {
                  [style.liveTalk]: windowWidth < 460 && liveTalk,
                  [style.online]: windowWidth < 460 && online,
                  [style.offline]: windowWidth < 460 && !online,
                })}
              />
            </Box>
            <Text className={style.title}>{title}</Text>
            {subscription.productId !== 'FREEMIUM' && (
              <>
                {windowWidth >= 460 && <HabitatStatus online={online} liveTalk={liveTalk} />}
              </>
            )}
            {subscription.productId === 'FREEMIUM' && _id !== subscription.freeHabitat && (
              <div className={classnames(style.lock, { [style.offline]: !online })}>
                <div>
                  <FontAwesomeIcon icon={faLockAlt} />
                </div>
              </div>
            )}
          </Box>
        </Link>
      ),
    })), [allHabitats, onHabitatClick, value, windowWidth, subscription]);

  return (
    <Grommet theme={theme}>
      <Box
        ref={boxRef}
        direction="row"
        align="center"
        round="20px"
        className={classnames(style.searchWrapper, className)}
        pad={{ horizontal: 'small' }}
        elevation={suggestionOpen ? 'medium' : undefined}
        border={{
          side: 'all',
          color: suggestionOpen ? 'transparent' : 'border',
        }}
        style={suggestionOpen ? {
          borderBottomLeftRadius: '0px',
          borderBottomRightRadius: '0px',
        } : undefined}
      >
        <TextInput
          dropTarget={boxRef.current}
          placeholder="Search for an animal..."
          plain
          suggestions={suggestions}
          value={value}
          onChange={onChange}
          onSuggestionsOpen={onSuggestionsOpen}
          onSuggestionsClose={onSuggestionsClose}
          onFocus={onSearchFocus}
          onSelect={() => boxRef.current.querySelector('input').blur()}
          style={{ padding: '8px' }}
          dropHeight="medium"
        />

        <FontAwesomeIcon icon={faSearch} color="var(--grey)" />
      </Box>
    </Grommet>
  );
};

export default connect((
  { allHabitats, user: { subscription } },
) => (
  { allHabitats, subscription }
), {
  setHabitatsAction: setHabitats,
})(Search);
