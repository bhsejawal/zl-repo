import { useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Layer,
  Heading,
  Text,
  Box,
} from 'grommet';
import useFetch from "use-http";
import { buildURL } from "Shared/fetch";

import { PrimaryButton } from 'Components/Buttons';

import { useLocalStorage } from '../../hooks';

import style from './style.scss';

const defaultModalState = {
  show: false,
  appVersion: null,
  changeLog: null,
}

const WhatsNew = ({ logged }) => {
  const [appVersion, setAppVersion] = useLocalStorage('appVersion', 0);
  const [modalState, setModalState] = useState(defaultModalState);

  const { get, response } = useFetch(buildURL('/release/latest'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const { get: getLatestVersion, response: latestVersionResponse } = useFetch(buildURL('/release/check'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    const fetchLatestRelease = async () => {
      await get();
      if (response.ok) {
        const { data: { version } } = response;
        if (version) {
          setAppVersion(version)
        }
      }
    }

    const fetchCurrentRelease = async () => {
      await getLatestVersion(`?currentVersion=${appVersion}`);
      if (latestVersionResponse.status === 200) {
        const { data: { changeLog, currentRelease } } = latestVersionResponse;
        setModalState({
          show: true,
          changeLog,
          appVersion: currentRelease,
        });
        setAppVersion(currentRelease);
      }
    }

    if (logged) {
      if (!appVersion) {
        fetchLatestRelease();
      } else {
        fetchCurrentRelease();
      }

      const interval = setInterval(fetchCurrentRelease, 5 * 60 * 1000);
      return () => {
        clearInterval(interval);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logged]);

  const onClose = () => {
    window.location.reload(true);
  };

  if (!modalState.show) {
    return null;
  }

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <div className={style.container}>
        <div className={style.header}>
          <img src="https://zoolife.tv/assets/butterfly.jpg" alt="butterfly" />
        </div>
        <Box className={style.contentWrapper}>
          <Heading level="3" textAlign="center" color="var(--charcoal)">
            There’s been an update!
          </Heading>
          <Text size="xlarge" textAlign="center" color="var(--charcoalLight)">
            We’ve made a few tweaks to improve the Zoolife experience for you.
          </Text>
        </Box>
        {modalState.changeLog && (
          <Box className={style.changeLogContainer}>
            <ul>
              {modalState.changeLog.filter((change) => change.length).map((change) => (
                <li>
                  <Text size="medium" color="var(--charcoalLight)">
                    {change}
                  </Text>
                </li>
              ))}
            </ul>
          </Box>
        )}
        <Box margin={{ vertical: '30px' }} pad={{ horizontal: '120px' }} align="center">
          <PrimaryButton
            size="large"
            label="Refresh Page"
            onClick={onClose}
          />
        </Box>
      </div>
    </Layer>
  )
}

export default connect(({ user: { logged } }) => ({ logged }))(WhatsNew);
