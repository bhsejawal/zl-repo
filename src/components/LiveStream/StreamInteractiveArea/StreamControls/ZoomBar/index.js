import {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/pro-light-svg-icons';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';

import { GlobalsContext } from 'Shared/context';
import { getConfig } from '../../../../../helpers';

import style from './style.scss';

const initialZoomState = {
  currentZoom: null,
  requestedZoom: null,
};

const ZOOM_LEVELS = [100, 80, 60, 40, 20, 0];

const ZoomBar = ({ userId, habitatId, configs }) => {
  const { socket } = useContext(GlobalsContext);
  const [zoomInfo, setZoomInfo] = useState(initialZoomState);
  const [isLoading, setIsLoading] = useState(false);
  const barRef = useRef();
  const wrapperRef = useRef();

  const onPropagateZoom = useCallback(({ zoom }) => {
    setZoomInfo({...zoomInfo, currentZoom: zoom, requestedZoom: null });
    if (isLoading) {
      setIsLoading(false);
    }
  }, [setZoomInfo, isLoading, zoomInfo]);

  useEffect(() => {
    if (socket) {
      socket.on('propagateZoom', onPropagateZoom);
    }
    return () => {
      if (socket) {
        socket.off('propagateZoom', onPropagateZoom);
      }
    }
  }, [socket, onPropagateZoom])

  const onClick = useCallback((requestedZoom, currentZoom) => {
    if (requestedZoom === currentZoom) {
      return;
    }

    setIsLoading(true);

    socket.emit('zl_setZoom', {
      zoom: requestedZoom,
      userId,
      channelId: habitatId,
    });

    setZoomInfo({ currentZoom, isLoading: true, requestedZoom });
    setTimeout(() => setIsLoading(false), getConfig(configs, 'ptu.votingTime')?.configValue);
  }, [habitatId, userId, socket, configs]);

  return (
    <div ref={wrapperRef} className={classnames(style.zoomWrapper)}>
      <div className={style.zoomWrapperInner}>
        <div className={style.paddingWrapper}>
          {/* eslint-disable-next-line */}
          <div
            className={classnames(style.iconWrapper, {
              [style.disabled]: isLoading || zoomInfo.currentZoom === 100,
            })}
            onClick={() => onClick(zoomInfo.currentZoom + 20, zoomInfo.currentZoom)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
        <div>
          <div ref={barRef} className={style.bar}>
            {ZOOM_LEVELS.map((zLvl) => (
              // eslint-disable-next-line
              <div
                className={classnames(style.dotWrapper, {
                  [style.active]: zoomInfo.currentZoom === zLvl || zoomInfo.requestedZoom === zLvl,
                  [style.disabled]: isLoading && zoomInfo.requestedZoom !== zLvl,
                })}
                onClick={() => onClick(zLvl, zoomInfo.currentZoom)}
              >
                <span key={zLvl} className={style.dot} />
                {zoomInfo.requestedZoom === zLvl && isLoading && (
                  <div className={style.loader}>
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* eslint-disable-next-line */}
        <div
          className={classnames(style.iconWrapper, style.paddingWrapper, {
            [style.disabled]: zoomInfo.currentZoom === 0 || isLoading,
          })}
          onClick={() => onClick(zoomInfo.currentZoom - 20, zoomInfo.currentZoom)}
        >
          <FontAwesomeIcon icon={faMinus} />
        </div>
      </div>
    </div>
  );
};

export default connect(({
  user: { userId },
  habitat: { habitatInfo: { _id: habitatId, camera: { configs } } },
}) => (
  { userId, habitatId, configs }
))(ZoomBar);
