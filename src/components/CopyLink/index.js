import { Drop } from 'grommet';
import { useState, useEffect, useRef } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCheck } from '@fortawesome/pro-regular-svg-icons';
import classnames from 'classnames';

import RoundButton from 'Components/RoundButton';

import style from './style.scss';

const CopyLink = ({ link, className }) => {
  const [linkCopied, setLinkCopied] = useState();
  const targetRef = useRef();

  useEffect(() => {
    let timeout;

    if (linkCopied) {
      timeout = setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [linkCopied]);

  const copyToClipboardBtnHandler = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
        .then(() => setLinkCopied(true))
        .catch((err) => console.error('Error while copying link via navigator.clipboard', err));
    } else {
      // if clipboard is not supported, attempt to use old alternative (deprecated)
      console.warn('clipboard is not supported, copy via execCommand.');
      const elem = document.createElement('input');
      elem.value = link;
      document.body.appendChild(elem);
      elem.select();

      try {
        document.execCommand('copy');
        setLinkCopied(true);
      } catch (err) {
        console.error('Error while copying link', err);
      } finally {
        document.body.removeChild(elem);
      }
    }
  };

  return (
    <>
      <RoundButton
        className={classnames(style.copyLink, className)}
        onClick={copyToClipboardBtnHandler}
        backgroundColor="#DC3D7D"
        color="white"
        width={20}
      >
        <FontAwesomeIcon icon={faLink} />
        <div ref={targetRef} />
      </RoundButton>

      {targetRef?.current && linkCopied && (
        <Drop
          align={{ bottom: 'top' }}
          target={targetRef.current}
          plain
        >
          <div className={style.tooltip}>
            <div className={style.wrapper}>
              <FontAwesomeIcon icon={faCheck} />
              &nbsp;
              Copied to Clipboard
            </div>
          </div>
        </Drop>
      )}
    </>
  );
};

export default CopyLink;
