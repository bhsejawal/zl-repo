import { h } from 'preact';
import { connect } from 'react-redux';
import { Box } from 'grommet';

import { CALENDAR, ALBUM } from './constants';

import Tabs from './tabs';
import Cards from './cards';
import CalendarLoader from './Calendar/CalendarLoader';
import Album from '../Album';

const renderActive = (activeTab) => {
  switch (activeTab) {
    case CALENDAR: {
      return (
        <Box pad={{ vertical: '35px' }}>
          <CalendarLoader />
        </Box>
      );
    }

    case ALBUM: {
      return <Album />;
    }

    default: {
      return <Cards />;
    }
  }
}

const CardTabs = ({ activeTab }) => (
  <div>
    <Tabs active={activeTab} />
    {renderActive(activeTab)}
  </div>
);

export default connect(
  ({ habitat: { cards: { activeTab } } }) => ({ activeTab }),
)(CardTabs);
