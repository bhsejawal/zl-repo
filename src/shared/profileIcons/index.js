import animal1 from './icons/animal1.svg';
import animal2 from './icons/animal2.svg';
import animal3 from './icons/animal3.svg';
import animal4 from './icons/animal4.svg';
import animal5 from './icons/animal5.svg';
import animal6 from './icons/animal6.svg';
import animal7 from './icons/animal7.svg';
import animal8 from './icons/animal8.svg';
import animal9 from './icons/animal9.svg';
import animal10 from './icons/animal10.svg';
import animal11 from './icons/animal11.svg';
import animal12 from './icons/animal12.svg';
import animal13 from './icons/animal13.svg';
import animal14 from './icons/animal14.svg';
import animal15 from './icons/animal15.svg';

const icons = {
  animal1,
  animal2,
  animal3,
  animal4,
  animal5,
  animal6,
  animal7,
  animal8,
  animal9,
  animal10,
  animal11,
  animal12,
  animal13,
  animal14,
  animal15,
};

export const getIconKeys = () => Object.keys(icons);
export const getIconUrl = (iconKey) => icons[iconKey];
