import { useState } from 'preact/hooks';
import { Link } from 'preact-router';
import {
  Box,
  Heading,
  Text,
  Button,
} from 'grommet';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';

import { OutlineButton, PrimaryButton } from 'Components/Buttons';
import Accordion from '../../../account/Accordion';

import style from './style.scss';

const HabitatMobileCard = ({
  subscription,
  habitat,
  isOffline,
  onShowTrailer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!habitat && !subscription) {
    return null;
  }

  const showFreemiumTag = subscription.productId === 'FREEMIUM' && habitat._id === subscription.freeHabitat;

  return (
    <Accordion
      className={style.accordion}
      header={
        <Box direction="row" align="center" onClick={() => setIsOpen(!isOpen)} className={classnames({[style.offline]: isOffline })}>
          <div className={classnames(style.habitatImage, {[style.freemium]: showFreemiumTag})}>
            <img src={habitat.profileImage} alt="profile" />
            {subscription.productId === 'FREEMIUM' && (
              <div className={style.freemiumTag}>
                {!showFreemiumTag && (
                  <div className={style.lock}>
                    <FontAwesomeIcon icon={faLockAlt} />
                  </div>
                )}
                {showFreemiumTag && (
                  <div className={style.freeHabitat}>
                    FREE
                  </div>
                )}
              </div>
            )}
          </div>
          <Heading level={4} margin={{ left: "15px" }}>{habitat.title}</Heading>
          <img src={habitat.zoo.logo} alt="zoo" className={style.zooLogo} />
        </Box>
      }
    >
      <Box height={{ min: '132px' }} style={{ borderBottom: '1px solid #EBEBEB'}}>
        <Box pad={{ vertical: '25px' }}>
          <Text size="xlarge">
            {habitat.description}
          </Text>
        </Box>
        <Box direction="row" justify="between" align="center" margin={{ bottom: "25px" }}>
          {(subscription.productId !== 'FREEMIUM' || showFreemiumTag) && (
            <Link href={encodeURI(`/h/${habitat.zoo.slug}/${habitat.slug}`)}>
              <PrimaryButton label="Visit" style={{ minWidth: '126px' }} />
            </Link>
          )}
          {subscription.productId === 'FREEMIUM' && !showFreemiumTag && (
            <Link href={encodeURI(`/plans`)}>
              <Button
                primary
                label={(
                  <Box direction="row" justify="center" align="center">
                    <FontAwesomeIcon icon={faLockAlt} color="#2E2D2D" size="1x" />
                    <Text className={style.buttonText}>Unlock all Habitats</Text>
                  </Box>
                )}
                size="large"
                className={style.lockButton}
              />
            </Link>
          )}
          {habitat.trailer && (
            <OutlineButton label="Trailer" height="45px" style={{ minWidth: '126px' }} onClick={() => onShowTrailer(habitat.trailer)} />
          )}
        </Box>
      </Box>
    </Accordion>
  )
}

export default connect(({
  user: { subscription } = {},
}) => ({ subscription }))(HabitatMobileCard);
