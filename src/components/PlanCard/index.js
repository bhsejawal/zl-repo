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
import { faGraduationCap } from '@fortawesome/pro-solid-svg-icons';

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
}) => {
  const isMobileSize = useIsMobileSize();
  const maxWidth = isMobileSize ? '300px' : '200px';
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
            background="var(--logoBlue)"
            align="center"
            justify="center"
            className={classnames(style.discountTag, {[style.mobile]: isMobileSize })}
          >
            <Text weight={900} size="15px">{discount}</Text>
            <Text size="9px" weight={400}>discount</Text>
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
            width={{min: isMobileSize ? '150px' : '200px', max: isMobileSize ? '150px' : '150px'}}
            height={{ min: !isMobileSize ? '155px' : '0px' }}
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
              {planName === 'Class Pass' && (
                <Box direction="row" align="center" justify="center">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <Text
                    alignSelf="center"
                    size="xlarge"
                    weight={800}
                    margin={{ left: '8px'}}
                  >
                    {planName}
                  </Text>
                </Box>
              )}
              {planName !== 'Class Pass' && (
                <Text
                  alignSelf="center"
                  size="xlarge"
                  weight={800}
                >
                  {planName}
                </Text>
              )}
              <Box direction="row" justify="center" align="center" >
                <Heading
                  margin={{ top: planPrice === 'FREE' ? '0px' : '12px', bottom: '0' }}
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
              {originalPrice && (
              <Box align="center" margin={{ top: '3px'}}>
                <Text
                  size="20px"
                  style={{ lineHeight: '20px', textDecorationLine: 'line-through'}}
                >
                  {`$${originalPrice / 100}`}
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
              pad={{ horizontal: planPrice === 199 ? 'medium' : '10px'}}
            >
              <Text
                margin={{ top: '10px' }}
                size="medium"
                style={{ textTransform: 'capitalize' }}
              >
                {benefitTitle}
              </Text>
              <Text
                size={isMobileSize ? 'medium' : 'xlarge'}
                textAlign="center"
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
