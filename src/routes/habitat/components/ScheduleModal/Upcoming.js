import { useMemo } from 'preact/hooks';
import { format } from 'date-fns';
import { Heading } from 'grommet';
import Card from 'Components/Card';

import { useUpcomingTalks } from '../../hooks';

import style from './style.scss';

const Upcoming = () => {
  const { upcoming = [] } = useUpcomingTalks(null);

  const list = useMemo(
    () => upcoming.map(({ startTime, isStreamLive, ...rest }) => ({
      text: `TALK | ${format(startTime, 'EEE hh:mm aa').toUpperCase()}`,
      startTime,
      ...rest,
    })),
    [upcoming],
  );

  if (!upcoming.length) {
    return null;
  }

  return (
    <div className={style.upcomingContainer}>
      <hr />
      <Heading level="3" margin={{ top: '0', bottom: '0', left: '40px' }}>Other Talks Today</Heading>
      <div className={style.cardsWrapper}>
        {list.map(({
          _id,
          title,
          startTime,
          zoo,
          isLive,
          text,
          profileImage,
          description,
          habitatId,
        }) => (
          <Card
          key={_id}
          scheduleId={_id}
          title={title}
          zoo={zoo}
          startTime={startTime}
          live={isLive}
          header={text}
          description={description}
          image={profileImage}
          isReminder
          habitatId={habitatId}
          />
        ))}
      </div>
    </div>
  );
};

export default Upcoming;
