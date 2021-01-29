import { h } from 'preact';
import { useMemo } from 'preact/hooks';

import {
  QUICK_LOOK,
  FOOD_AND_DIET,
  ORIGIN_AND_HABITAT,
  THE_ANIMAL_BODY,
  CONSERVATION,
  BEHAVIOR,
  FAMILY_LIFE,
} from '../../../constants';

import style from './style.scss';

const CardWrapper = ({ tag, noPadding, children }) => {
  const color = useMemo(() => {
    switch (tag) {
      case QUICK_LOOK: {
        return 'var(--lightBlue)';
      }

      case FOOD_AND_DIET: {
        return 'var(--sage)';
      }

      case ORIGIN_AND_HABITAT: {
        return 'var(--coral)';
      }

      case THE_ANIMAL_BODY: {
        return 'var(--lightBlue)';
      }

      case CONSERVATION: {
        return 'var(--yellow)';
      }

      case BEHAVIOR: {
        return 'var(--brightPink)';
      }

      case FAMILY_LIFE: {
        return 'var(--pink)';
      }

      default: {
        return 'var(--lightBlue)';
      }
    }
  }, [tag]);

  const tagColor = useMemo(() => {
    switch (tag) {
      case QUICK_LOOK: {
        return 'var(--oceanBlue)';
      }

      case FOOD_AND_DIET: {
        return '#1C7B76';
      }

      case ORIGIN_AND_HABITAT: {
        return 'var(--deepCoral)';
      }

      case THE_ANIMAL_BODY: {
        return '#3C6EBD';
      }

      case CONSERVATION: {
        return 'var(--deepYellow)';
      }

      case BEHAVIOR: {
        return 'var(--deepPink)';
      }

      case FAMILY_LIFE: {
        return 'var(--darkRed)';
      }

      default: {
        return 'var(--oceanBlue)';
      }
    }
  }, [tag]);

  return (
    <div
      className={style.card}
      style={{ backgroundColor: color, padding: noPadding && '0' }}
    >
      <span className={style.tag} style={{ backgroundColor: tagColor }}>{tag}</span>
      {children}
    </div>
  );
};

export default CardWrapper;
