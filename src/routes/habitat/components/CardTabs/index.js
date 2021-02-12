import { h } from 'preact';
import { connect } from 'react-redux';

import { CALENDAR } from './constants';

import Tabs from './tabs';
import Cards from './cards';
import CalendarLoader from './Calendar/CalendarLoader';

const CardTabs = ({ activeTab }) => (
  <div>
    <Tabs active={activeTab} />

    {activeTab !== CALENDAR
      ? <Cards />
      : <CalendarLoader />}
  </div>
);

export default connect(
  ({ habitat: { cards: { activeTab } } }) => ({ activeTab }),
)(CardTabs);
