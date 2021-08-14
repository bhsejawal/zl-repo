import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
  Heading,
} from 'grommet';
import classnames from 'classnames';
import { PrimaryButton } from '../Buttons';

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
  const maxWidth = isMobileSize ? '330px' : '200px';
  const maxHeight = isMobileSize ? '130px' : '313px';

  return (
    <div>
      <Box
        pad={{ horizontal: isMobileSize ? 'xsmall' : 'medium', vertical: '10px' }}
        className={style.planCard}
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
        >
          <CardHeader
            background={{ color }}
            width={{min: isMobileSize ? '180px' : '200px', max: isMobileSize ? '180px' : '150px'}}
          >
            <Box
              fill
              textAlign="center"
              alignSelf="start"
              pad={{ top: '20px' }}
              margin={{
                bottom: isMobileSize ? '0px' : getMarginBottom(planPrice),
              }}>
              <Text
                alignSelf="center"
                size="xlarge"
                weight={800}
              >
                {planName}
              </Text>
              <Box direction="row" justify="center" align="center" >
                <Heading
                  margin={{ top: '12px', bottom: '0' }}
                  alignSelf="center"
                  level="2"
                >
                  {`$${planPrice / 100}`}
                </Heading>
              </Box>
              <Box align="center">
                <Text
                  size="20px"
                  style={{ lineHeight: '20px', textDecorationLine: 'line-through'}}
                >
                  {`$${originalPrice / 100}`}
                </Text>
              </Box>
            </Box>

          </CardHeader>
          <CardBody
            width={{min: isMobileSize ? '150px' : '200px', max: isMobileSize ? '150px' : '150px'}}
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
              <PrimaryButton
                alignSelf="center"
                disabled={disabled}
                label={buttonLabel}
                onClick={() => onClickHandler(planId, priceId)}
                size={isMobileSize ? 'medium' : 'large'}
              />
            </Box>
          </CardBody>
        </Card>
      </Box>
    </div>
  );
};

export default PlanCard;
