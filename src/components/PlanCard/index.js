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
  currentPlan,
  buttonLabel = 'Select',
  benefitText,
  originalPrice,
}) => (
  <div>
    <Box pad="xxsmall" className={classnames(style.planCard, { [style.currentPlan]: currentPlan })}>
      {discount && (
        <Box
          background="#368185"
          align="center"
          justify="center"
          className={style.discountTag}
        >
          <Text weight={900} size="14px">{`${discount}`}</Text>
          <Text size="12px" weight={400}>discount</Text>
        </Box>
      )}
      <Card background={{ color: 'white' }} width={{ min: '200px', max: '200px' }} >
        <CardHeader
          background={{ color }}
          height={{min: '150px' }}
        >
          <Box
            fill
            textAlign="center"
            alignSelf={planPrice === 199 ? 'start' : 'end'}
            margin={{
              bottom: getMarginBottom(planPrice),
              top: planPrice === 199 ? '20px' : '0px',
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
            {planPrice !== 199 && (
              <Box align="center">
                <Text
                  size="20px"
                  style={{ lineHeight: '20px', textDecorationLine: 'line-through'}}
                >
                  {`$${originalPrice / 100}`}
                </Text>
              </Box>
            )}
            {planType !== 'visit' && (
              <Box align="center" margin={{ top: '10px'}}>
                <Text size="10px" style={{ lineHeight: '11.5px'}}>
                  Unlimited Access
                </Text>
              </Box>
            )}
          </Box>

        </CardHeader>
        <CardBody height={{ min: '150px', max: '150px'}}>
          <Box
            margin={{ top: 'xsmall' }}
            align="center"
            justify="center"
            flex="grow"
            pad={{ horizontal: planPrice === 199 ? 'medium' : '10px'}}
          >
            <Text
              margin={{ top: '15px' }}
              size="xlarge"
              textAlign="center"
            >
              {benefitText}
            </Text>

          </Box>
          <Box justify="end" direction="column" pad="xsmall" margin={{ vertical: '16px' }}>
            <PrimaryButton
              alignSelf="center"
              disabled={disabled}
              label={buttonLabel}
              onClick={() => onClickHandler(planId, priceId)}
            />
          </Box>
        </CardBody>
      </Card>
    </Box>
  </div>
)

export default PlanCard;
