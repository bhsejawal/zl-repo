import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const Accordion = ({
  expanded,
  children,
  header,
  className,
}) => {
  const [expand, setExpand] = useState(expanded);

  return (
    <div className={classnames(style.accordionContainer, className, { [style.expand]: expand })}>
      <button type="button" className={style.header} onClick={() => setExpand(!expand)}>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={style.icon}
        />
        {header}
      </button>
      <div className={style.body}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
