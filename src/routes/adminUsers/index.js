import { h } from 'preact';
import { Text } from 'grommet';
import { parseISO } from 'date-fns';
import DateTimePicker from 'react-datetime-picker'

import Header from 'Components/Header';
import AdminTable from 'Components/AdminTable';
import { SELECT } from 'Components/AdminTable/constants';
import { useMemo, useState } from 'preact/hooks';

const minDate = new Date();

const EditValidUntil = ({ subscriptionStatus }) => {
  const date = useMemo(
    () => (subscriptionStatus?.validUntil ? parseISO(subscriptionStatus?.validUntil) : new Date()),
    [subscriptionStatus?.validUntil],
  )
  const [value, setValue] = useState(date);

  return (
    <DateTimePicker
      name="subscriptionStatus.validUntil"
      minDate={minDate}
      value={value}
      onChange={setValue}
    />
  );
};

const ValidUntil = ({ subscriptionStatus }) => (
  <Text size="large">
    {subscriptionStatus?.validUntil
      ? new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(parseISO(subscriptionStatus.validUntil))
      : ''}
  </Text>
);

const columns = [{
  property: '_id',
  primary: true,
  // this value is used to know which fields to display on delete modal
  deleteInfo: true,
  title: 'User ID',
}, {
  property: 'email',
  editable: true,
  deleteInfo: true,
  title: 'Email',
}, {
  property: 'username',
  editable: true,
  deleteInfo: true,
  required: false,
  title: 'Username',
}, {
  property: 'role',
  editable: true,
  title: 'Role',
  type: SELECT,
  selectValues: [{
    label: 'Admin',
    value: 'admin',
  }, {
    label: 'Partner',
    value: 'partner',
  }, {
    label: 'Host',
    value: 'host',
  }, {
    label: 'VIP',
    value: 'vip',
  }, {
    label: 'User',
    value: 'user',
  }],
}, {
  property: 'subscriptionStatus.validUntil',
  title: 'Pass Valid Until',
  editable: true,
  render: ValidUntil,
  editRender: EditValidUntil,
}];

const responseTransform = ({ users } = {}) => users;

// eslint-disable-next-line arrow-body-style
const Users = () => (
  <>
    <Header />
    <AdminTable
      columns={columns}
      entity={{ singular: 'User', plural: 'Users' }}
      serverPath="/admin/users"
      responseTransform={responseTransform}
    />
  </>
);

export default Users;