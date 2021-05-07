import { h } from 'preact';
import {
  Box,
  Button,
  Form,
  Text,
  Heading,
  Layer,
  TextInput,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { set, get } from 'lodash-es';

import { PrimaryButton } from 'Components/Buttons';
import { add } from 'date-fns';
import DateTimePicker from 'react-datetime-picker';
import useFetch from 'use-http';
import { buildURL } from 'Shared/fetch';

import style from './style.scss';

const now = new Date();
const initialValues = {
  email: '',
  username: '',
  role: 'user',
  zooId: null,
  subscriptionStatus: {
    validUntil: add(now, { days: 1 }),
  },
};

const USER = 'user';
const VIP = 'vip';
const HOST = 'host';
const ADMIN = 'admin';
const PARTNER = 'partner';
const TRIAL = 'TRIAL';

const AddEditUserModal = ({
  data,
  onClose,
  updateTable,
  zoos,
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

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box
        width="large"
        direction="row"
        align="center"
        as="header"
        elevation="small"
        justify="between"
      >
        <Heading level="2" margin={{ vertical: 'medium', horizontal: 'large' }}>
          {data ? 'Edit User' : 'New User'}
        </Heading>
        <Button
          plain
          margin="medium"
          onClick={onClose}
          icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
        />
      </Box>

      <Form onSubmit={onSubmit}>
        <Box
          overflow="auto"
          height={{ max: 'calc(100vh - 200px)' }}
          pad={{ vertical: 'medium', horizontal: 'large' }}
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
            <div className="simpleSelect">
              <select name="role" required onChange={onInputChange} value={formData.role}>
                <option value={USER}>User</option>
                <option value={PARTNER}>Partner</option>
                <option value={HOST}>Host</option>
                <option value={VIP}>VIP</option>
                <option value={ADMIN}>Admin</option>
              </select>

              <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
            </div>
          </Box>
          {(formData.role === VIP
            || (formData.role === USER && formData?.subscriptionStatus?.productId === TRIAL)) && (
            <Box>
              <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Pass Valid Until</Text>
              <DateTimePicker
                className={style.dateTimePicker}
                showLeadingZeros
                value={!showDatePicker ? new Date(null) : new Date(get(formData, 'subscriptionStatus.validUntil'))}
                clearIcon={null}
                onChange={(value) => showDatePicker && onInputChange({ target: { name: 'subscriptionStatus.validUntil', value } })}
                format="dd/MM/y hh:mm a"
              />
            </Box>
          )}
          {(formData.role === PARTNER) && (
            <Box>
              <Text margin={{ top: 'medium', bottom: 'small' }} size="large">Zoo</Text>
              <div className="simpleSelect">
                <select name="zooId" required onChange={onInputChange} value={formData.zooId}>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <option value="" />
                  {availableZoos.map((item) => (<option value={item._id}>{item.name}</option>))}
                </select>

                <FontAwesomeIcon icon={faChevronDown} color="var(--blue)" />
              </div>
            </Box>
          )}
        </Box>

        <Box pad={{ vertical: 'medium', horizontal: 'large' }} align="end">
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
    </Layer>
  );
};

export default AddEditUserModal;
