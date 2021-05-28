import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import classnames from 'classnames';

import {
  QUICK_LOOK,
  FOOD_AND_DIET,
  ORIGIN_AND_HABITAT,
  THE_ANIMAL_BODY,
  CONSERVATION,
  BEHAVIOR,
  FAMILY_LIFE,
  QUIZ_CARD_TYPE,
  EMPTY_TAG,
} from '../../../constants';

import style from './style.scss';

const CardWrapper = ({
  tag,
  noPadding,
  children,
  hideTag, // Tags corresponds to specific colors, some cards don't have tags
  padding,
  className,
}) => {
  const color = useMemo(() => {
    switch (tag) {
      case QUICK_LOOK: {
        return 'var(--blueMediumLight)';
      }

      case FOOD_AND_DIET: {
        return 'var(--hunterGreenLight)';
      }

      case ORIGIN_AND_HABITAT: {
        return 'var(--coralLight)';
      }

      case THE_ANIMAL_BODY: {
        return 'var(--oliveMedium)';
      }

      case CONSERVATION:
      case EMPTY_TAG: {
        return 'var(--mossLight)';
      }

      case BEHAVIOR: {
        return 'var(--lavenderLight)';
      }

      case FAMILY_LIFE: {
        return 'var(--hunterGreenLight)';
      }

      case QUIZ_CARD_TYPE: {
        return 'var(--hunterGreenLight)';
      }

      default: {
        return 'var(--blueMediumLight)';
      }
    }
  }, [tag]);

  const tagColor = useMemo(() => {
    switch (tag) {
      case QUICK_LOOK: {
        return 'var(--blueMediumDark)';
      }

      case FOOD_AND_DIET: {
        return 'var(--hunterGreenMediumLight)';
      }

      case ORIGIN_AND_HABITAT: {
        return 'var(--coralMedium)';
      }

      case THE_ANIMAL_BODY: {
        return 'var(--hunterGreen)';
      }

      case CONSERVATION: {
        return 'var(--mossMedium)';
      }

      case BEHAVIOR: {
        return 'var(--lavenderMedium)';
      }

      case FAMILY_LIFE: {
        return 'var(--hunterGreenMediumLight)';
      }

      case QUIZ_CARD_TYPE: {
        return 'var(--hunterGreenMediumDark))';
      }

      default: {
        return 'var(--blueMediumDark)';
      }
    }
  }, [tag]);

  return (
    <div
      className={classnames(style.card, className)}
      style={{ backgroundColor: color, padding: padding ?? (noPadding && '0') }}
      data-tag={tag}
    >
      {tag && !hideTag && (
        <span className={style.tag} style={{ backgroundColor: tagColor }}>
          {tag}
        </span>
      )}
      {children}
    </div>
  );
};

export default CardWrapper;
