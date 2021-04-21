// NOTE: we are currently unable set human readable name because of this bug
// this is also used in other sampleData.js files
// https://github.com/webpack-contrib/file-loader/issues/367#issuecomment-593931637
// eslint-disable-next-line
// import defaultImg from 'file-loader?name=placeholder.svg!../quick-look-card-img.svg';
import defaultImg from './gorilla.png';

import { ANIMAL_BODY_CARD_TYPE, THE_ANIMAL_BODY } from "../../constants";

export const tag = THE_ANIMAL_BODY;
export const type = ANIMAL_BODY_CARD_TYPE;
export const data = {
  img: defaultImg,
  parts: [{
    id: Symbol('id'),
    x: 50,
    y: 50,
    title: 'The Animal Body',
    text: 'Learn about different parts of this wonderful animal by clicking on  the blue circles',
  }, {
    id: Symbol('id'),
    x: 60,
    y: 22,
    title: 'Silverback',
    text: 'Adult male gorillas grow silver hair on their backs when then reach maturity!',
  }],
};
