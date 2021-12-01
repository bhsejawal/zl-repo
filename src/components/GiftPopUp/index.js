import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Box,
  Heading,
  Layer,
  Text,
} from 'grommet';
import classnames from 'classnames';

import { PrimaryButton } from 'Components/Buttons';
import CloseButton from 'Components/modals/CloseButton';
import Body from 'Components/modals/Body';

import { goToGift } from '../../routes/home/helpers';

import style from './style.scss';

const GiftPopUp = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(
    () => {
      let timer;
      if (isLoggedIn && !localStorage.getItem('giftModal')) {
        timer = setTimeout(() => {
          localStorage.setItem('giftModal', "true");
          setIsOpen(true);
        }, 5 * 60 * 1000);
      }
      return () => clearTimeout(timer);
    }, [isLoggedIn],
  );

  const onClose = () => setIsOpen(false);

  if (!isOpen) {
    return null;
  }

  return (
    <Layer position="center" className={style.layer} background="transparent" onEsc={onClose}>
      <Box width="min(480px, 100vw)" className="customScrollBar grey" background="transparent">
        <Box
          direction="row"
          align="center"
          as="header"
          justify="end"
          height={{ min: 'unset'}}
          className={style.header}>
          <img className={style.background} src="https://assets.zoolife.tv/landing/s9_gift_1.jpg" alt="header background" />
          <img className={style.item} src="https://assets.zoolife.tv/landing/s9_gift_2.png" alt="header item" />
          <CloseButton varient="grey" onClick={onClose} className={style.closeBtn} />
        </Box>

        <Body className={classnames(style.content, '')}>

          <Heading margin={{ top: '13px', bottom: '33px' }} level="3">
            Help them stress less with a Zoolife gift.
          </Heading>
          <Text size="xlarge">
            50% of every purchase supports animal conservation.
          </Text>

          <Box
            alignSelf="center"
            pad={{ top: 'medium' }}
            width={{ min: '140px' }}>
            <PrimaryButton
              label="Explore Gifts"
              className={style.loadingBtn}
              onClick={goToGift} />
          </Box>
        </Body>
      </Box>
    </Layer>);
}

export default connect(
  ({
    user: {
      logged,
    },
  }) => ({
    isLoggedIn: logged,
  }),
)(GiftPopUp);
