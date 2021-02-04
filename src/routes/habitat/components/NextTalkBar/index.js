import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan, faLessThan } from '@fortawesome/pro-light-svg-icons';
import classnames from 'classnames';

import Tag from 'Components/Tag';
import Card from 'Components/Card';
import { useOnClickOutside } from '../../../../hooks';

import style from './style.scss';

const list = [
  {
    isLive: true,
    text: 'LIVE NOW',
    icon: 'https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/hippo.png',
    description: 'Making Breakfast with the hippo Nutritionist',
  },
  {
    isLive: false,
    text: 'STARTS IN 30M',
    icon: 'https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/giraffe.png',
    description: 'Making Breakfast with the giraffe Nutritionist',
  },
  {
    isLive: false,
    text: 'STARTS IN 3H',
    icon: 'https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/meerkat.png',
    link: 'https://s3.ca-central-1.amazonaws.com/zl.brizi.tech/assets/meerkat.png',
    description: 'Making Breakfast with the meerkat Nutritionist',
  },
];

const NextTalkBar = ({ height, width }) => {
  const [expand, setExpand] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setExpand(false));

  return (
    <div ref={ref} className={style.liveTalktBar} style={{ height, width }}>
      <div className={classnames(style.expandBar, 'customScrollBar', {[style.active]: expand})}>
        <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
          <span>Talk</span>
          <FontAwesomeIcon icon={faLessThan} />
        </button>
        <div className={style.listWrapper}>
          {list.map(({
            isLive,
            text,
            icon,
            description,
          }) => (
            <Card
              key={`${text}-${description}`}
              live={isLive}
              header={isLive ? <Tag label="LIVE" /> : text}
              description={description}
              image={icon}
              roundImage
              onClick={() => console.log('Remind Me')}
            />
          ))}
        </div>
      </div>
      <div className={style.content}>
        <button type="button" className={style.liveTalkExpandButton} onClick={() => setExpand(!expand)}>
          <span>Talk</span>
          <FontAwesomeIcon icon={faGreaterThan} />
        </button>
        <ul>
          {list.map(({
            icon,
            text,
            isLive,
            link,
          }) => (
            <li key={`${text}-${icon}`}>
              {/* eslint-disable-next-line no-script-url */}
              <a href={link || 'javascript:void(0)'}>
                <img src={icon} alt="" />
                <span>
                  {isLive ? <Tag label={text} /> : text}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NextTalkBar;
