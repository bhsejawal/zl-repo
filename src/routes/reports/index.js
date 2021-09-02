import { useState } from 'preact/hooks';
import {
  Heading,
  Box,
  Text,
  Form,
  FormField,
  DateInput,
} from 'grommet';
import {
  startOfMonth,
  addMonths,
  parseISO,
  format,
} from 'date-fns';

import { PrimaryButton } from 'Components/Buttons';

import { buildURL } from 'Shared/fetch';

import style from './style.scss';

const Reports = () => {
  const [form, setFormValue] = useState({ date: (new Date()).toISOString() });
  const onChange = (nextValue) => {
    setFormValue(nextValue);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    const fromDate = format(startOfMonth(parseISO(form.date)), 'MM-dd-yyyy');
    const toDate = format(startOfMonth(addMonths(parseISO(form.date), 1)), 'MM-dd-yyyy');
    window.open(buildURL(`/admin/stats?fromDate=${fromDate}&toDate=${toDate}`), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className={style.reportsPage}>
      <Box>
        <Heading level={2} margin={{ bottom: '0px' }}>
          Product Metrics Report
        </Heading>
      </Box>
      <Box width="fit-content" margin={{ top: '20px' }}>
        <Text size="xlarge" margin={{ bottom: 'small' }}>
          Select the month to get the product metrics
        </Text>
        <Form
          value={form}
          onChange={onChange}
          onSubmit={onSubmit}
        >
          <FormField name="date" required>
            <DateInput name="date" format="mm/yyyy" />
          </FormField>
          <Box alignSelf="end">
            <PrimaryButton type="submit" label="Submit" />
          </Box>
        </Form>
      </Box>
    </div>
  );
};

export default Reports;
