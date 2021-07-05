import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { setHabitats } from '../redux/actions';

const HabitatsUpdater = ({ setHabitatsAction }) => {
  const { get, response } = useFetch(buildURL('/habitats'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    const fetchData = async () => {
      await get();
      if (response.ok) {
        setHabitatsAction(response.data.habitats);
      }
    }

    fetchData();

    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default connect(
  null,
  { setHabitatsAction: setHabitats },
)(HabitatsUpdater);
