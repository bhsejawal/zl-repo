import {
  Grommet,
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
} from 'grommet';
import classnames from 'classnames';
import Button from '../Button';

import style from './style.scss';

const PlanCard = ({
  planId,
  priceId,
  planName,
  planPrice,
  planType,
  planCurrency,
  color,
  discount,
  onClickHandler,
  disabled,
  currentPlan,
  buttonLabel = 'Select',
  benefitTitle,
  benefitText,
}) => (
  <Grommet>
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
          height={{min: '190px' }}
        >
          <Box fill textAlign="center" pad="small">
            <Text
              color="white"
              alignSelf="center"
              size="20px"
              weight={900}
              style={{ lineHeight: '28px' }}
            >
              {planName}
            </Text>
            <Box direction="row" justify="center" align="center" >
              <Text
                margin={{ top: 'medium' }}
                alignSelf="center"
                color="white"
                style={{ fontSize: '36px', lineHeight: '28px', fontWeight: '900' }}
              >
                {planPrice / 100}
              </Text>
              <Text alignSelf="end" style={{ lineHeight: '14px' }} color="white">
                {planCurrency}
              </Text>
            </Box>
            <Text
              margin={{ top: 'small' }}
              style={{ fontSize: '16px', lineHeight: '22px' }}
              alignSelf="center"
              color="white"
            >
              {`/${planType}`}
            </Text>
          </Box>

        </CardHeader>
        <CardBody height={{ min: '150px', max: '150px'}}>
          <Box margin={{ top: 'xsmall' }} align="center" justify="center" flex="grow">
            <Text
              margin={{ top: '10px' }}
              size="12px"
              style={{ lineHeight: "18px" }}
            >
              {benefitTitle}
            </Text>
            <Text
              size="16px"
              style={{ lineHeight: "22px" }}
            >
              {benefitText}
            </Text>

          </Box>
          <Box align="center" justify="end" direction="column" pad="xsmall" margin={{ vertical: '16px' }}>
            <Button
              variant="primary"
              onClick={() => onClickHandler(planId, priceId)}
              alignSelf="end"
              disabled={disabled}
            >
              <span>{buttonLabel}</span>
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Box>
  </Grommet>
)

export default PlanCard;
