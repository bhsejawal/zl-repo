import { h } from 'preact';
import { memo } from 'preact/compat';
import classnames from 'classnames';

import ToggleButton from '../toggleButton';

import style from './style.scss';

const Shortcuts = ({ available = [], active, onClick }) => (
  <div className={style.shortcuts}>
    {available.map((tag, ind) => (
      <>
        <ToggleButton
          className={style.shortcutBtn}
          active={active === tag}
          value={tag}
          onClick={onClick}
          oneColor
        >
          {tag}
        </ToggleButton>

        {ind + 1 < available.length && (
          <span className={style.divider} />
        )}
      </>
    ))}

    {/* hidden placeholder just to occupy space and prevent page jumping */}
    {available.length === 0 && (
      <ToggleButton
        className={classnames(style.shortcutBtn, style.disabled )}
        value=""
        onClick={onClick}
      >
        placeholder
      </ToggleButton>
    )}
  </div>
);

export default memo(Shortcuts);
