import { useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { Layer, Box, Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import CloseButton from 'Components/modals/CloseButton';

import { closeModalSchedules} from '../actions';
import grommetTheme from '../../../../../../grommetTheme';
import LiveTalks from '../../../Schedules/LiveTalks';
import LiveStreams from '../../../Schedules/LiveStreams';
import DatePicker from '../../../Schedules/DatePicker';

import style from './style.scss';

const fullLayerTheme = deepMerge(grommetTheme, {
  layer: {
    container: {
      extend: {
        maxWidth: 'auto',
        maxHeight: 'auto',
      },
    },
  },
});

const SchedulesModal = ({ closeAction }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (value) => {
    setDate(value);
  }

  useEffect(() => () => {
    closeAction();
  }, [closeAction]);

  return (
    <Grommet theme={fullLayerTheme}>
      <Layer full onEsc={closeAction} background={{ color: '#F4F4F4' }}>
        <Box fill className={style.container}>
          <div className={style.header}>
            <h3>Schedules</h3>
            <DatePicker date={date} onChange={onChange} />
            <CloseButton onClick={closeAction} className={style.close} />
          </div>
          <div className={style.body}>
            <LiveTalks date={date} accordion />
            <LiveStreams date={date} accordion />
            <div className={style.fallback}>
              <h3>No talks or streams on this day</h3>
            </div>
          </div>
        </Box>
      </Layer>
    </Grommet>
  );
};

export default connect(
  null,
  { closeAction: closeModalSchedules },
)(SchedulesModal);
