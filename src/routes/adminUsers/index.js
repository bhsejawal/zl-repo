import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import {
  Text,
  RadioButton,
  Grommet,
  Box,
  Heading,
  Button,
  Main,
  Pagination,
} from 'grommet';
import { deepMerge } from 'grommet/utils';
import { get as lodashGet, debounce } from 'lodash-es';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { format, add, addSeconds } from 'date-fns';

import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import AddEditUserModal from './AddEditUserModal';
import DeleteModal from './DeleteModal';
import DataTableWrapper from './DataTableWrapper';
import DisableModal from './DisableModal';
import EnableModal from './EnableModal';

import ResetPasswordModal from './ResetPasswordModal';
import grommetTheme from '../../grommetTheme';

const theme = deepMerge(grommetTheme, {
  button: {
    default: {
      border: '0',
    },
    padding: {
      horizontal: '5px',
      vertical: '5px',
    },
    border: {
      radius: '0',
    },
  },
});

const timezoneOffset = new Date().getTimezoneOffset();
// eslint-disable-next-line react/display-name
const cellRender = (property, isDate) => (item) => {
  const content = lodashGet(item, property);
  const date = isDate && content && new Date(content);

  return (
    <div style={{ opacity: item.disabled ? '.5' : undefined }}>
      <Text size="large">
        {!isDate && content}
        {/* offset is added to show time in UTC because its converted to local time by default */}
        {date && format(add(date, { minutes: timezoneOffset }), 'dd/MM/yyyy hh:mm:ss a')}
      </Text>
    </div>
  )
};

const Users = ({ pageSize = 20 }) => {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState({});

  const [{ sortField, sortOrder }, setSort] = useState({});
  const [searchEntries, setSearchEntries] = useState([]);

  const [newModalOpen, setNewModalOpen] = useState();
  const [editModalOpen, setEditModalOpen] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState();
  const [disableModalOpen, setDisableModalOpen] = useState();
  const [enableModalOpen, setEnableModalOpen] = useState();
  const [resetModalOpen, setResetModalOpen] = useState();

  const fetchParams = useMemo(() => {
    const params = new URLSearchParams({ page, pageSize });

    if (sortField && sortOrder) {
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);
    }

    searchEntries.forEach(([key, val]) => params.append(key, val));

    return params;
  }, [page, pageSize, sortField, sortOrder, searchEntries]);

  const columns = useMemo(() => [{
    render: function SelectCell(item) {
      return <RadioButton name="selected" checked={selected?._id === item?._id} />
    },
    sortable: false,
  }, {
    property: '_id',
    primary: true,
    header: <Text size="large">User ID</Text>,
    title: '',
    render: cellRender('_id'),
  }, {
    property: 'email',
    search: true,
    header: <Text size="large">Email</Text>,
    render: cellRender('email'),
  }, {
    property: 'username',
    search: true,
    header: <Text size="large">Username</Text>,
    render: cellRender('username'),
  }, {
    property: 'role',
    search: true,
    header: <Text size="large">Role</Text>,
    render: cellRender('role'),
  }, {
    property: 'subscriptionStatus.validUntil',
    header: <Text size="large">Pass Valid Until</Text>,
    render: cellRender('subscriptionStatus.validUntil', true),
  }, {
    property: 'subscriptionStatus.productId',
    header: <Text size="large">Product</Text>,
    search: false,
    // eslint-disable-next-line react/display-name
    render: (rowData) => (
      <div style={{ opacity: rowData.disabled ? '.5' : undefined }}>
        <Text size="large">
          {
            products[rowData?.subscriptionStatus?.productId]
            || rowData?.subscriptionStatus?.productId
          }
        </Text>
      </div>
    ),
  }, {
    property: 'createdAt',
    header: <Text size="large">Created</Text>,
    search: false,
    render: cellRender('createdAt', true),
  }, {
    property: 'lastLogin',
    header: <Text size="large">Last Login</Text>,
    search: false,
    render: cellRender('lastLogin', true),
  }, {
    property: 'sessionDurationInSec',
    header: <Text size="large">Minutes Spent</Text>,
    // eslint-disable-next-line react/display-name
    render: (rowData) => (
      <div style={{ opacity: rowData.disabled ? '.5' : undefined }}>
        <Text size="large">
          {rowData.sessionDurationInSec
            ? format(addSeconds(new Date(null), rowData.sessionDurationInSec), 'm')
            : ''}
        </Text>
      </div>
    ),
  }], [products, selected?._id]);

  const {
    get,
    error: fetchError,
    loading: fetchingData,
    data,
  } = useFetch(
    buildURL(`/admin/users?${fetchParams}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  useEffect(() => {
    get();
  }, [fetchParams, get]);

  useEffect(() => {
    setLoading(fetchingData);
  }, [fetchingData]);

  useEffect(() => {
    if (!fetchError && data?.users) {
      setUsers(data.users);

      if (selected?._id) {
        setSelected(data.users.find(({ _id }) => _id === selected?._id));
      }
    }
    if (!fetchError && data?.products) {
      const result = {};

      data.products.forEach((product) => {
        result[product._id] = product.name;
      });

      setProducts(result);
    }
  }, [data, fetchError, selected]);

  const { del, response } = useFetch(buildURL('/admin/users'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const onDelete = async () => {
    await del(selected._id, { force: true });
    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    await get();
    setSelected(undefined);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(debounce((search) => {
    const populatedEntries = Object.entries(search)
      // eslint-disable-next-line no-unused-vars
      .filter(([, val]) => !!val);

    setSearchEntries(populatedEntries);
    setPage(1);
  }, 200, { leading: false, trailing: true }), []);

  const onSort = useCallback(({ property, direction }) => {
    setSort({ sortField: property, sortOrder: direction });
    setPage(1);
  }, []);

  const onRowClick = useCallback(({ datum }) => {
    setSelected(datum);
  }, []);

  const refreshData = () => get();

  return (
    <Main height={{ min: '100vh' }} pad={{ vertical: '60px', horizontal: 'large' }}>
      <Box direction="row" justify="between" align="center" height={{ min: '100px' }}>
        <Heading level="3">Users</Heading>
        <Box direction="row" gap="medium" align="center">
          {selected && (
            <OutlineButton
              key="reset"
              size="large"
              label="Reset Password"
              onClick={() => setResetModalOpen(true)}
            />
          )}
          {selected?.disabled && (
            <OutlineButton
              key="enable"
              size="large"
              label="Enable"
              onClick={() => setEnableModalOpen(true)}
            />
          )}

          {(selected || selected?.disabled) && (
            <OutlineButton
              key="delete"
              disabled={!selected}
              label={selected?.disabled ? 'Delete' : 'Disable'}
              onClick={selected?.disabled
                ? () => setDeleteModalOpen(true)
                : () => setDisableModalOpen(true)}
            />
          )}

          <OutlineButton
            disabled={!selected}
            label="Edit"
            onClick={() => setEditModalOpen(true)}
          />

          <PrimaryButton
            label="Add New"
            onClick={() => setNewModalOpen(true)}
          />
        </Box>
      </Box>

      <Box justify="between" fill>
        {fetchError && !users.length && (
          <Box align="center">
            <Heading level="4">There was an error</Heading>
            <Button onClick={get} label="Try Again" />
          </Box>
        )}

        {!fetchError && (
          <>
            <Box overflow="auto" border="bottom">
              <Grommet theme={theme} width={{ min: '1000px' }}>
                <Box pad={{ bottom: 'small' }}>
                  <DataTableWrapper
                    columns={columns}
                    loading={loading}
                    data={users}
                    pageSize={pageSize}
                    onSearch={onSearch}
                    onSort={onSort}
                    onClickRow={onRowClick}
                  />
                </Box>
              </Grommet>
            </Box>

            <Box align="end" pad={{ top: 'small' }} height={{ min: '36px' }}>
              {data?.pages > 1 && (
                <Pagination
                  page={page}
                  step={pageSize}
                  numberItems={data?.total ?? 0}
                  onChange={({ page: newPage }) => setPage(newPage)}
                />
              )}
            </Box>
          </>
        )}
      </Box>
      {newModalOpen && (
        <AddEditUserModal
          onClose={() => setNewModalOpen(false)}
          updateTable={refreshData}
          zoos={data?.zoos}
        />
      )}

      {editModalOpen && (
        <AddEditUserModal
          onClose={() => setEditModalOpen(false)}
          data={selected}
          updateTable={refreshData}
          zoos={data?.zoos}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          selected={selected}
          onDelete={onDelete}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}

      {disableModalOpen && (
        <DisableModal
          selected={selected}
          onClose={() => setDisableModalOpen(false)}
          updateTable={refreshData}
        />
      )}

      {enableModalOpen && (
        <EnableModal
          selected={selected}
          onClose={() => setEnableModalOpen(false)}
          updateTable={refreshData}
        />
      )}

      {resetModalOpen && (
        <ResetPasswordModal onClose={() => setResetModalOpen(false)} email={selected.email} />
      )}
    </Main>
  );
};

export default Users;
