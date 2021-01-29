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

const PlanCard = ({
  planName,
  planPrice,
  planType,
  color,
  benefits = [],
}) => (
  <Grommet>
    <Box pad="xxsmall">
      <Card background={{ color: 'white' }}>
        <CardHeader
          background={{ color }}
          height={{min: '155px' }}
          width={{ min: '275px' }}
        >
          <Box fill textAlign="center" pad="small">
            <Text
              color="white"
              alignSelf="center"
              style={{ fontSize: '20px', lineHeight: '28px', fontWeight: '900' }}
            >
              {planName}
            </Text>
            <Text
              margin={{ top: 'medium' }}
              alignSelf="center"
              style={{ fontSize: '45px', lineHeight: '28px', fontWeight: '900' }}
            >
              {planPrice}
            </Text>
            <Text
              margin={{ top: 'xsmall' }}
              style={{ fontSize: '16px', lineHeight: '22px' }}
              alignSelf="center"
            >
              {planType}
            </Text>
          </Box>

        </CardHeader>
        <CardBody
          height={{ min: '255px'}}
        >
          <Box margin={{ top: '26px' }} align="center">
            {benefits.map((benefit, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <BenefitItem key={index} benefit={benefit} />
            ))}
          </Box>
          <Box align="center" justify="end" direction="column" flex="grow" pad="xsmall" margin={{ bottom: '18px' }}>
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
