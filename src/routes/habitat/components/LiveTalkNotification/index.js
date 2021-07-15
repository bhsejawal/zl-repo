import { Box } from 'grommet';
import { useContext, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { isEmpty } from 'lodash-es';

import { GlobalsContext } from 'Shared/context';
import Card from 'Components/Card';
import CloseButton from 'Components/modals/CloseButton';
import Tag from 'Components/Tag';

import style from './style.scss';

const LiveTalkNotification = () => {
  const { socket } = useContext(GlobalsContext);
  const [schedule, setSchedule] = useState({});
  const [link, setLink] = useState();

  useEffect(() => {
    const socketHandler = (data = {}) => {
      if (!isEmpty(data)) {
        setSchedule(data?.schedule);
        setLink(`/h/${data.zooSlug}/${data.habitatSlug}`);
      } else {
        setSchedule({});
        setLink(undefined);
      }
    };

    if (socket) {
      socket.on('liveTalkStarted', socketHandler);
    }

    return () => {
      if (socket) {
        socket.off('liveTalkStarted', socketHandler);
      }
    }
  }, [socket]);

  if (isEmpty(schedule)) {
    return null;
  }

  const closeHandler = () => {
    setSchedule({});
  };

  const redirectHandler = () => {
    closeHandler();
    route(link);
  };

  return (
    <Box className={style.liveTalkNotification}>
      <Box className={style.wrapper}>
        <CloseButton varient="grey" onClick={closeHandler} className={style.closeBtn} />
        <Card
          key={schedule._id}
          scheduleId={schedule._id}
          title={schedule.title}
          zoo={schedule.zoo}
          header={<Tag label="LIVE NOW" varient="online" />}
          description={schedule.description}
          image={schedule?.habitat?.profileImage}
          onClick={redirectHandler}
        />
      </Box>
    </Box>
  );
}

export default LiveTalkNotification;
