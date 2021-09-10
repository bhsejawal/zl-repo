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
import { useIsInitiallyLoaded, useIsMobileSize, useWindowResize } from '../../hooks';

const Schedule = ({ setFilterOptionsAction }) => {
  const {
    get,
    loading,
    error,
  } = useFetch(API_BASE_URL, { credentials: 'include' });
  const size = useContext(ResponsiveContext);
  const loaded = useIsInitiallyLoaded(loading);
  const isSmallScreen = useIsMobileSize();
  const { width: windowWidth } = useWindowResize();
  const [filtersOpen, setFiltersOpen] = useState(!isSmallScreen);
  const collapseHeader = windowWidth < 700;
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
            direction={collapseHeader ? 'column' : 'row'}
            pad={collapseHeader ? '20px 18px' : '24px 18px' }
            align={collapseHeader ? undefined : 'center'}
            flex="grow"
            border={{ color: '#DFDFDF', size: '1px', side: 'bottom' }}
          >
            <Heading
              level="2"
              margin={collapseHeader ? '0 0 20px' : 'none'}
              size={size === 'large' ? 'small' : '20px'}
              style={{ fontWeight: size === "large" ? 900 : 500 }}
            >
              Zoolife Talk Schedule
            </Heading>

            <Box
              flex="grow"
              justify="between"
              align="center"
              direction="row"
              margin={{ left: collapseHeader ? undefined : 'large' }}
            >
              <CalendarFilter />
              {collapseHeader && (
                <Button plain onClick={toggleFilters}>
                  <Box align="center" direction="row" gap="medium">
                    <Text size="xlarge">Filters</Text>
                    <FontAwesomeIcon icon={filtersOpen ? faChevronUp : faChevronDown} />
                  </Box>
                </Button>
              )}

              {!collapseHeader && (
                <Box direction="row" flex="grow" justify="end" gap="small">
                  <AnimalFilter />
                  <ZooFilter />
                </Box>
              )}
            </Box>

            {collapseHeader && filtersOpen && (
              <Box direction="row" flex="grow" justify="between" gap="small" pad={{ top: '20px' }}>
                <AnimalFilter />
                <ZooFilter />
              </Box>
            )}
          </Box>

          <Box fill align="center">
            <Box
              fill
              overflow="auto"
              className="customScrollBar grey"
              pad={{
                horizontal: isSmallScreen ? '8px' : 'xlarge',
                vertical: isSmallScreen ? '8px' : '44px',
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
