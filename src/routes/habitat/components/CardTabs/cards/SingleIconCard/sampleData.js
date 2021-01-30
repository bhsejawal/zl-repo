import { SINGLE_ICON_CARD_TYPE, QUICK_LOOK } from "../../constants";

// NOTE: we are currently unable set human readable name because of this bug
// this is also used in other sampleData.js files
// https://github.com/webpack-contrib/file-loader/issues/367#issuecomment-593931637
// eslint-disable-next-line max-len
// import defaultImg from 'file-loader?name=placeholder.svg!../../../../../../../assets/quick-look-card-img.svg';
import defaultImg from '../../../../../../assets/quick-look-card-img.svg';

export const tag = QUICK_LOOK;
export const type = SINGLE_ICON_CARD_TYPE;
export const data = {
  title: 'Title',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
  img: defaultImg,
};
