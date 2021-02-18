import {
  Grommet,
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
} from 'grommet';

import Button from '../Button';
import BenefitItem from './BenefitItem';

import style from './style.scss';

const PlanCard = ({
  planName,
  planPrice,
  planType,
  planCurrency,
  color,
  amountOff,
  benefits = [],
}) => (
  <Grommet>
    <Box pad="xxsmall" style={{ position: 'relative' }}>
      {amountOff && (
        <Box
          background="#368185"
          align="center"
          justify="center"
          className={style.discountTag}
        >
          <Text weight="900" size="14px">{`${amountOff}%`}</Text>
          <Text size="12px" weight="400">discount</Text>
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
                {planPrice}
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
              {planType}
            </Text>
          </Box>

        </CardHeader>
        <CardBody height={{ min: '150px', max: '150px'}}>
          <Box margin={{ top: 'xsmall' }} align="center" justify="center" flex="grow">
            {benefits.map((benefit, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <BenefitItem key={index} benefit={benefit} />
            ))}
          </Box>
          <Box align="center" justify="end" direction="column" pad="xsmall" margin={{ vertical: '16px' }}>
            <Button variant="primary" onClick={() => console.log(`clicked ${planName}, proceed with checkout`)} alignSelf="end">
              <span>Select</span>
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Box>
  </Grommet>
)

export default PlanCard;
