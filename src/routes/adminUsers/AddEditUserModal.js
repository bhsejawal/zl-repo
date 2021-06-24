import { h } from 'preact';
import {
  Box,
  Form,
  Text,
  Layer,
  TextInput,
  Select,
} from 'grommet';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { set, get, first } from 'lodash-es';

import { PrimaryButton } from 'Components/Buttons';
import { add } from 'date-fns';
import DateTimePicker from 'react-datetime-picker';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';
import Header from "Components/modals/Header";
import Body from "Components/modals/Body";
import TagsInput from './TagsInput';

import style from './style.scss';

const now = new Date();

const USER = 'user';
const VIP = 'vip';
const HOST = 'host';
const ADMIN = 'admin';
const PARTNER = 'partner';
const TRIAL = 'TRIAL';

const initialValues = {
  email: '',
  username: '',
  role: USER,
  zooId: null,
  subscriptionStatus: {
    validUntil: add(now, { days: 1 }),
  },
};

const AddEditUserModal = ({
  data,
  onClose,
  updateTable,
  zoos = [],
  habitats = [],
}) => {
  const [formData, setFormData] = useState(data || initialValues);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const availableZoos = useMemo(() => zoos.filter(({ disabled }) => !disabled), [zoos]);

  const { post, patch, response } = useFetch(buildURL('/admin/users'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const onInputChange = ({ target: { name, value } }) => {
    const updatedFormData = set({ ...formData }, name, value);

    if (name === 'role' && value === PARTNER && !formData.zooId) {
      set(updatedFormData, 'zooId', first(availableZoos)._id);
    }

    setFormData(updatedFormData);
  };

  // dateTimePicker is calculating sizes on modal open and its not being rendered properly
  // This logic is to enforce rendering after popup is open to avoid rendering issues
  useEffect(() => {
    const timeout = setTimeout(() => setShowDatePicker(true), 10);

    return () => clearTimeout(timeout);
  }, []);

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const filteredFormData = formData;

      if (formData.role === PARTNER || formData.role === HOST || formData.role === ADMIN) {
        set(filteredFormData, 'subscriptionStatus.validUntil', null);
      }

      if (formData.role !== PARTNER) {
        set(filteredFormData, 'zooId', null);
      }

      if (formData.role !== HOST) {
        set(filteredFormData, 'habitats', null);
      }

      if (data) {
        await patch(`${data._id}?v=${data.__v || 0}`, filteredFormData);
      } else {
        await post(formData);
      }

      if (!response.ok) {
        const { error } = response.data;
        throw new Error(error || 'Something went wrong. Please try again.');
      }

      setError(undefined);
      updateTable();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trialSubscription = formData?.subscriptionStatus?.productId === TRIAL;

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box width="768px">
        <Header onClose={onClose}>
          {data ? 'Edit User' : 'New User'}
        </Header>

        <Body>
          <Form onSubmit={onSubmit}>
            <Box
              overflow="auto"
              height={{ max: 'calc(100vh - 200px)' }}
            >
              <Box>
                <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Email</Text>
                <TextInput
                  required={true}
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  type="email"
                />
              </Box>
              <Box>
                <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Username</Text>
                <TextInput
                  required={true}
                  name="username"
                  value={formData.username}
                  onChange={onInputChange}
                />
              </Box>
              <Box>
                <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Role</Text>
                <Select
                  name="role"
                  placeholder="Select"
                  labelKey="label"
                  valueKey={{ key: 'value', reduce: true }}
                  value={formData.role || undefined}
                  options={[
                    { label: 'User', value: USER},
                    { label: 'Partner', value: PARTNER},
                    { label: 'Host', value: HOST},
                    { label: 'VIP', value: VIP},
                    { label: 'Admin', value: ADMIN},
                  ]}
                  onChange={onInputChange}
                />
              </Box>
              {(formData.role === VIP || (formData.role === USER && trialSubscription)) && (
                <Box>
                  <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Pass Valid Until</Text>
                  <DateTimePicker
                    className={style.dateTimePicker}
                    showLeadingZeros
                    value={!showDatePicker ? new Date(null) : new Date(get(formData, 'subscriptionStatus.validUntil', new Date()))}
                    clearIcon={null}
                    onChange={(value) => showDatePicker && onInputChange({ target: { name: 'subscriptionStatus.validUntil', value } })}
                    format="dd/MM/y hh:mm a"
                  />
                </Box>
              )}
              {(formData.role === PARTNER) && (
                <Box>
                  <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Zoo</Text>
                  <Select
                    name="zooId"
                    placeholder="Select"
                    labelKey="name"
                    valueKey={{ key: '_id', reduce: true }}
                    value={formData.zooId || undefined}
                    options={availableZoos}
                    onChange={onInputChange}
                  />
                </Box>
              )}
              {(formData.role === HOST) && (
                <Box>
                  <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Habitats</Text>
                  <TagsInput
                    name="habitats"
                    values={habitats}
                    onChange={onInputChange}
                    selected={formData.habitats || []}
                  />
                </Box>
              )}
            </Box>

            <Box pad={{ top: '30px' }} align="end">
              <PrimaryButton
                primary
                size="large"
                type="submit"
                loading={loading}
                label={data ? 'Save Changes' : 'Done'}
              />

              {error && (
                <Box pad="small">
                  <Text color="status-error">{error}</Text>
                </Box>
              )}
            </Box>
          </Form>
        </Body>
      </Box>
    </Layer>
  );
};

export default AddEditUserModal;
