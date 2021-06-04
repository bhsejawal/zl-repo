import useFetch from 'use-http'
import {
  useEffect,
  useCallback,
  useContext,
  useState,
} from 'preact/hooks';
import {
  Box,
  Button,
  Heading,
  Text,
  ResponsiveContext,
} from 'grommet';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';

import Loader from 'Components/Loader';
import { API_BASE_URL } from 'Shared/fetch';

import AnimalFilter from './Filters/AnimalFilter';
import ZooFilter from './Filters/ZooFilter';
import CalendarFilter from './Filters/CalendarFilter';
import ScheduleList from './ScheduleList';

import { setFilterOptions } from './actions';
import { useIsInitiallyLoaded, useIsMobileSize } from '../../hooks';

const Schedule = ({ setFilterOptionsAction }) => {
  const {
    get,
    loading,
    error,
  } = useFetch(API_BASE_URL, { credentials: 'include' });
  const size = useContext(ResponsiveContext);
  const loaded = useIsInitiallyLoaded(loading);
  const isSmallScreen = useIsMobileSize();
  const [filtersOpen, setFiltersOpen] = useState(!isSmallScreen);

  const getFilterOptions = useCallback(async () => {
    try {
      const filterOptions = await get(`/livetalks/filters`);
      setFilterOptionsAction(filterOptions)
    } catch (err) {
      console.error(err);
    }
  }, [setFilterOptionsAction, get]);

  useEffect(() => {
    getFilterOptions();
  }, [getFilterOptions]);

  const toggleFilters = useCallback(() => setFiltersOpen(!filtersOpen), [filtersOpen]);

  if (error) {
    // TODO: replace this with the error fallback
    return (
      <div>
        {error}
      </div>
    )
  }

  return (
    <Box fill>
      {!loaded && <Loader fill />}
      {loaded && (
        <>
          <Box
            height={{ min: '95px' }}
            direction={isSmallScreen ? 'column' : 'row'}
            pad="medium"
            align={isSmallScreen ? undefined : 'center'}
            flex="grow"
          >
            <Heading
              level="2"
              margin={isSmallScreen ? { bottom: 'large', top: 'medium' } : 'none'}
              size={size === 'large' ? 'small' : '20px'}
              style={{ fontWeight: size === "large" ? 900 : 500 }}
              textAlign="left"
            >
              Zoolife Talk Schedule
            </Heading>

            <Box
              flex="grow"
              justify="between"
              align="center"
              direction="row"
              margin={{ left: isSmallScreen ? undefined : 'large' }}
            >
              <CalendarFilter />
              {isSmallScreen && (
                <Button plain onClick={toggleFilters}>
                  <Box align="center" direction="row" gap="medium">
                    <Text size="xlarge">Filters</Text>
                    <FontAwesomeIcon icon={filtersOpen ? faChevronUp : faChevronDown} />
                  </Box>
                </Button>
              )}

              {!isSmallScreen && (
                <Box direction="row" flex="grow" justify="end" gap="small">
                  <AnimalFilter />
                  <ZooFilter />
                </Box>
              )}
            </Box>

            {isSmallScreen && filtersOpen && (
              <Box direction="row" flex="grow" justify="between" gap="small" pad={{ top: 'medium' }}>
                <AnimalFilter />
                <ZooFilter />
              </Box>
            )}
          </Box>

          <Box
            fill
            style={{ background: 'var(--hunterGreenMediumLight)'}}
            align="center"
          >
            <Box
              fill
              overflow="auto"
              className="customScrollBar"
              pad={{
                horizontal: isSmallScreen ? 'small' : 'xlarge',
                vertical: 'medium',
              }}
            >
              <ScheduleList />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default connect(null, { setFilterOptionsAction: setFilterOptions })(Schedule);
