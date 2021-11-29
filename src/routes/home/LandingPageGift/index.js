import {h} from 'preact';
import {Text} from 'grommet';

import { LandingPrimary } from 'Components/Buttons';

import { goToGift } from '../helpers';

import style from './style.scss';

const LandingPageGift = () => (
  <div className={style.background}>
    <img
         className={style.backgroundImage}
         loading="lazy"
         src="https://assets.zoolife.tv/landing/s9_gift_1.jpg"
         alt="Gift landing page background" />
    <div className={style.content}>
      <Text className={style.title}>
        Zoolife gift cards.
        <br />
        The perfect WFH gift.
      </Text >
      <Text className={style.description}>
        Whatever their new normal looks like this year,
        help minimize stress with an escape to the animal kingdom.
      </Text>
      <LandingPrimary className={style.button} onClick={goToGift}>
        Shop Gifts
      </LandingPrimary>
    </div>
    <img
        className={style.giftItem1}
        loading="lazy"
        src="https://assets.zoolife.tv/landing/s9_gift_2.png"
        alt="Gift landing page item 1" />
    <img
        className={style.giftItem2}
        loading="lazy"
        src="https://assets.zoolife.tv/landing/s9_gift_3.png"
        alt="Gift landing page item 2" />
  </div>
)

export default LandingPageGift;
