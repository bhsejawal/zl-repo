import { h } from 'preact';
import { memo } from 'preact/compat';

import {
  QUICK_LOOK,
  FOOD_AND_DIET,
  ORIGIN_AND_HABITAT,
  THE_ANIMAL_BODY,
  CONSERVATION,
  BEHAVIOR,
  FAMILY_LIFE,
} from '../constants';

import ToggleButton from '../toggleButton';

import style from './style.scss';

const Shortcuts = ({ active, onClick }) => (
  <div className={style.shortcuts}>
    <ToggleButton
      className={style.shortcutBtn}
      active={active === QUICK_LOOK}
      value={QUICK_LOOK}
      onClick={onClick}
    >
      A Quick Look
    </ToggleButton>

    <span className={style.divider} />

    <ToggleButton
      className={style.shortcutBtn}
      active={active === FOOD_AND_DIET}
      value={FOOD_AND_DIET}
      onClick={onClick}
    >
      Food &amp; Diet
    </ToggleButton>

    <span className={style.divider} />

    <ToggleButton
      className={style.shortcutBtn}
      active={active === ORIGIN_AND_HABITAT}
      value={ORIGIN_AND_HABITAT}
      onClick={onClick}
    >
      Origin &amp; Habitat
    </ToggleButton>

    <span className={style.divider} />

    <ToggleButton
      className={style.shortcutBtn}
      active={active === THE_ANIMAL_BODY}
      value={THE_ANIMAL_BODY}
      onClick={onClick}
    >
      The Animal Body
    </ToggleButton>

    <span className={style.divider} />

    <ToggleButton
      className={style.shortcutBtn}
      active={active === CONSERVATION}
      value={CONSERVATION}
      onClick={onClick}
    >
      Conservation
    </ToggleButton>

    <span className={style.divider} />

    <ToggleButton
      className={style.shortcutBtn}
      active={active === BEHAVIOR}
      value={BEHAVIOR}
      onClick={onClick}
    >
      Behavior
    </ToggleButton>

    <span className={style.divider} />

    <ToggleButton
      className={style.shortcutBtn}
      active={active === FAMILY_LIFE}
      value={FAMILY_LIFE}
      onClick={onClick}
    >
      Family Life
    </ToggleButton>
  </div>
);

export default memo(Shortcuts);
