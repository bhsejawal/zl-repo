import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { LOADING, FULL_CURSOR, LOADING_PIN } from './constants';

import style from './style.scss';

const CustomCursor = ({
  animal,
  color,
  cursorState = FULL_CURSOR,
  showClickEffect,
}) => {
  if (cursorState === LOADING) {
    return <FontAwesomeIcon className={style.loader} icon={faSpinner} spin style={{ color }} />;
  }

  if (!animal || !color) {
    return null;
  }

  if (cursorState === LOADING_PIN) {
    return (
      <div style={{position: 'relative' }}>
        <FontAwesomeIcon className={style.pinLoader} icon={faSpinner} spin />
        <svg viewBox="0 0 384 542" xmlns="http://www.w3.org/2000/svg">
          <path fill={color} d="m177.192432,438.293035c-109.036569,-160.781319 -129.275776,-177.282397 -129.275776,-236.37195c0,-80.939856 64.508063,-146.55412 144.083341,-146.55412s144.083341,65.614264 144.083341,146.55412c0,59.089553 -20.239207,75.590631 -129.275776,236.37195c-7.155389,10.513732 -22.460492,10.512968 -29.61513,0z" />
        </svg>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 384 542" xmlns="http://www.w3.org/2000/svg">
      <path fill={color} d="m177.192432,438.293035c-109.036569,-160.781319 -129.275776,-177.282397 -129.275776,-236.37195c0,-80.939856 64.508063,-146.55412 144.083341,-146.55412s144.083341,65.614264 144.083341,146.55412c0,59.089553 -20.239207,75.590631 -129.275776,236.37195c-7.155389,10.513732 -22.460492,10.512968 -29.61513,0z" />
      {cursorState === FULL_CURSOR && showClickEffect && (
        <>
          <radialGradient id="ellipse" fy="50%" fx="50%" r="50%" cy="50%" cx="50%">
            <stop stopColor="rgba(255,255,255,0)" offset="0%" />
            <stop stopColor={color} offset="100%" />
          </radialGradient>
          <ellipse stroke="1.5" fill="url(#ellipse)" ry="55" rx="185" cy="441" cx="192" />
        </>
      )}
      <image href={animal} width="250" height="250" x="67" y="80" />
    </svg>
  );
};

export default CustomCursor;
