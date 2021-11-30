import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
  Heading,
} from 'grommet';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faGift } from '@fortawesome/pro-solid-svg-icons';

import { PrimaryButton, OutlineButton } from '../Buttons';

import { useIsMobileSize } from '../../hooks';

import style from './style.scss';

const getMarginBottom = (price) => {
  if (price === 190) {
    return '0px';
  }

  if (price === 699) {
    return '30px';
  }

  return '10px';
}
const PlanCard = ({
  planId,
  priceId,
  planName,
  planPrice,
  planType,
  color,
  discount,
  onClickHandler,
  disabled,
  buttonLabel = 'Select',
  benefitText,
  originalPrice,
  benefitTitle,
  planSubtitle,
  showDetailsModal,
  openDetailsModalHandler,
}) => {
  const isMobileSize = useIsMobileSize();
  const maxWidth = isMobileSize ? '330px' : '200px';
  const maxHeight = isMobileSize ? '130px' : '313px';

  return (
    <div>
      <Box
        pad={{ vertical: '10px' }}
        className={style.planCard}
        margin={{ bottom: isMobileSize ? '0px' : '20px' }}
      >
        {discount && (
          <Box
            background="var(--blueLight)"
            align="center"
            justify="center"
            className={classnames(style.discountTag, {[style.mobile]: isMobileSize })}
          >
            <Text weight={900} size="15px" color="var(--charcoal)">{discount}</Text>
            <Text size="9px" weight={400} color="var(--charcoal)">discount</Text>
          </Box>
        )}
        <Card
          background={{ color: 'white' }}
          width={{ min: maxWidth, max: maxWidth }}
          height={{ min: maxHeight, max: maxHeight }}
          direction={isMobileSize ? 'row' : 'column'}
          className={style.cardShadow}
        >
          <CardHeader
            background={{ color }}
            width={{min: isMobileSize ? '180px' : '200px', max: isMobileSize ? '180px' : '150px'}}
            height={{ min: !isMobileSize ? '130px' : '0px' }}
            justify={ planPrice === 'FREE' ? 'center' : 'start'}
          >
            <Box
              fill
              textAlign="center"
              alignSelf={ planPrice === 'FREE' ? 'center' : 'start'}
              pad={{ top: planPrice === 'FREE' ? '0px' : '20px' }}
              justify={ planPrice === 'FREE' ? 'center' : 'start'}
              margin={{
                bottom: isMobileSize ? '0px' : getMarginBottom(planPrice),
              }}>
              {planType === 'Gift' && (
                <Box direction="row" align="center" justify="center">
                  <FontAwesomeIcon icon={faGift} style={{ height: '14px' }} />
                  <Text
                    alignSelf="center"
                    size="xlarge"
                    weight={800}
                    margin={{ left: '8px'}}
                    style={{ lineHeight: '13px' }}
                  >
                    Zoolife
                  </Text>
                </Box>
              )}
              {planName === 'Class Pass' && (
                <Box direction="row" align="center" justify="center">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <Text
                    alignSelf="center"
                    size="xlarge"
                    weight={800}
                    margin={{ left: '8px'}}
                  >
                    {`${planName} (USD)`}
                  </Text>
                </Box>
              )}
              {planName !== 'Class Pass' && (
                <Text
                  alignSelf="center"
                  size="xlarge"
                  weight={800}
                >
                  {planName ? `${planName} (USD)` : ''}
                </Text>
              )}
              {planType !== 'Gift' && (
                <Box direction="row" justify="center" align="center" >
                  <Heading
                    // eslint-disable-next-line no-nested-ternary
                    margin={{ top: !isMobileSize ? planPrice === 'FREE' ? '0px' : '12px' : '0px', bottom: '0' }}
                    alignSelf="center"
                    level="2"
                  >
                    {planPrice === 'FREE' ? planPrice : `$${planPrice / 100}`}
                  </Heading>
                  {['month', 'year'].includes(planType) && (
                    <Text alignSelf="end" margin={{ bottom: '2px' }}>
                      {`/${planType}`}
                    </Text>
                  )}
                </Box>
              )}
              {planType === 'Gift' && (
                <Box direction="row" justify="center" align="center" >
                  <Heading
                    // eslint-disable-next-line no-nested-ternary
                    margin={{ top: !isMobileSize ? '12px' : '0px', bottom: '0' }}
                    alignSelf="center"
                    level="2"
                  >
                    {planSubtitle}
                  </Heading>
                  {['month', 'year'].includes(planType) && (
                    <Text alignSelf="end" margin={{ bottom: '2px' }}>
                      {`/${planType}`}
                    </Text>
                  )}
                </Box>
              )}
              {originalPrice && (
              <Box align="center" margin={{ top: '3px'}}>
                <Text
                  size={ isMobileSize ? '16px' : '20px'}
                  style={{ lineHeight: '20px', textDecorationLine: 'line-through'}}
                >
                  {`$${originalPrice / 100}`}
                </Text>
              </Box>
              )}
              {showDetailsModal && (
                <Box
                  pad="3px"
                  justify="center"
                  align="center"
                  margin={{ top: '0px'}}
                  onClick={openDetailsModalHandler}
                >
                  <Text
                    color="#376CDE"
                    size="xlarge"
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Learn More
                  </Text>
                </Box>
              )}
            </Box>

          </CardHeader>
          <CardBody
            width={{min: isMobileSize ? '150px' : '200px', max: isMobileSize ? '150px' : '150px'}}
            pad={{ horizontal: isMobileSize ? '10px' : '0px'}}
          >
            <Box
              margin={{ top: 'xsmall' }}
              align="center"
              justify="center"
              flex="grow"
              // eslint-disable-next-line no-nested-ternary
              pad={{ horizontal: isMobileSize ? '0px' : planPrice === 199 ? 'medium' : '10px'}}
            >
              <Text
                size="medium"
                style={{ textTransform: 'capitalize' }}
                weight={700}
              >
                {benefitTitle}
              </Text>
              <Text
                size={isMobileSize ? 'medium' : 'xlarge'}
                textAlign="center"
                margin={{ top: '5px' }}
              >
                {benefitText}
              </Text>

            </Box>
            <Box justify="end" direction="column" pad="xsmall" margin={{ vertical: isMobileSize ? '11px' : '16px' }}>
              {buttonLabel === 'Cancel' && (
                <OutlineButton
                  alignSelf="center"
                  disabled={disabled}
                  label={buttonLabel}
                  onClick={() => onClickHandler(planId, priceId)}
                  size={isMobileSize ? 'medium' : 'large'}
                />
              )}
              {buttonLabel !== 'Cancel' && (
                <PrimaryButton
                  alignSelf="center"
                  disabled={disabled}
                  label={buttonLabel}
                  onClick={() => onClickHandler(planId, priceId)}
                  size={isMobileSize ? 'medium' : 'large'}
                />
              )}
            </Box>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
};

export default PlanCard;
