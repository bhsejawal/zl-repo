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
  benefitTitle,
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
          <Box fill textAlign="center" alignSelf="end" margin={{ bottom: '10px'}}>
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
              <Text
                margin={{ bottom: '5px' }}
                alignSelf="end"
                size="large"
              >
                { planType === 'visit' ? '' : `/${planType}`}
              </Text>
            </Box>
            <Box align="center">
              <Text
                size="20px"
                style={{ lineHeight: '20px', textDecorationLine: 'line-through'}}
              >
                {`$${originalPrice / 100}`}
              </Text>
            </Box>
            <Box align="center" margin={{ top: '10px'}}>
              <Text size="10px" style={{ lineHeight: '11.5px'}}>
                Discount Pricing Ends Aug 1st
              </Text>
            </Box>
          </Box>

        </CardHeader>
        <CardBody height={{ min: '150px', max: '150px'}}>
          <Box margin={{ top: 'xsmall' }} align="center" justify="center" flex="grow">
            <Text
              margin={{ top: '10px' }}
              size="medium"
              style={{ textTransform: 'capitalize' }}
            >
              {benefitTitle}
            </Text>
            <Text
              size="xlarge"
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
