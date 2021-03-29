import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import ErrorModal from 'Components/modals/Error';

import grommetTheme from '../../grommetTheme';
import ItemModal from './ItemModal';
import DeleteModal from './DeleteModal';
import DataTableWrapper from './DataTableWrapper';
import DisableModal from './disableEnableModals/DisableModal';
import EnableModal from './disableEnableModals/EnableModal';

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

  // TODO: this is not working
  // dataTable: {
  //   icons: {
  //     formSearch: SearchIcon,
  //   },
  // },
});

const AdminTable = ({
  selectDisabled,
  // this will be displayed as header or as modal header e.g "Edit [entity]"
  entity: { singular: singularEntity, plural: pluralEntity } = {},
  // using small number because row hower is very slow
  pageSize = 20,
  minWidth = '1000px',
  serverPath,
  deleteDisabled = false,
  columns: columnsProp,
  responseTransform,
}) => {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState();
  const [page, setPage] = useState(1);
  const [newModalOpen, setNewModalOpen] = useState();
  const [editModalOpen, setEditModalOpen] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState();
  const [disableModalOpen, setDisableModalOpen] = useState();
  const [enableModalOpen, setEnableModalOpen] = useState();
  const [errorModalOpen, setErrorModalOpen] = useState();
  const [loadingDisableEnable, setLoadingDisableEnable] = useState();
  const [{ sortField, sortOrder }, setSort] = useState({});
  const [searchEntries, setSearchEntries] = useState([]);
  const hadDataRef = useRef();

  const fetchParams = useMemo(() => {
    const params = new URLSearchParams({ page, pageSize });

    if (sortField && sortOrder) {
      params.append('sortField', sortField);
      params.append('sortOrder', sortOrder);
    }

    searchEntries.forEach(([key, val]) => params.append(key, val));

    return params;
  }, [page, pageSize, sortField, sortOrder, searchEntries]);

  const columns = useMemo(() => {
    const cols = columnsProp
      .filter(({ hiddenOnTable }) => !hiddenOnTable)
      .map(({
        title,
        property,
        render: renderProp,
        ...colProps
      }) => ({
        header: <Text size="large">{title}</Text>,
        render: function Cell(item) {
          return renderProp ? (
            <div style={{ opacity: item.disabled ? '.5' : undefined }}>
              {renderProp(item)}
            </div>
          ) : (
            <div style={{ opacity: item.disabled ? '.5' : undefined }}>
              <Text size="large">
                {lodashGet(item, property)}
              </Text>
            </div>
          );
        },
        search: true,
        sort: true,
        property,
        ...colProps,
      }));

    if (!selectDisabled) {
      cols.unshift({
        render: function SelectCell(item) {
          // eslint-disable-next-line no-underscore-dangle
          return <RadioButton name="selected" checked={selected?._id === item?._id} />
        },
        sortable: false,
      })
    }

    return cols;
  // eslint-disable-next-line no-underscore-dangle
  }, [columnsProp, selectDisabled, selected?._id]);

  const {
    get,
    error,
    loading: fetchingData,
    data,
  } = useFetch(
    buildURL(`${serverPath}?${fetchParams}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const transformedData = useMemo(
    () => responseTransform(data),
    [data, responseTransform],
  );

  useEffect(() => {
    if (error && hadDataRef.current) {
      setErrorModalOpen(true);
    }
  }, [error, transformedData]);

  useEffect(() => {
    if (transformedData) {
      hadDataRef.current = true;
      // eslint-disable-next-line no-underscore-dangle
      setSelected(transformedData.find(({ _id }) => _id === selected?._id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformedData]);

  useEffect(() => {
    setLoading(fetchingData);
  }, [fetchingData]);

  const {
    del,
    post,
    patch,
    response,
  } = useFetch(buildURL(serverPath), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    get();
  }, [serverPath, fetchParams, get]);

  const onDelete = async () => {
    // eslint-disable-next-line no-underscore-dangle
    await del(selected._id, { force: true });
    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    await get();
    setSelected(undefined);
  };

  const onDisable = async () => {
    setLoadingDisableEnable(true);
    // eslint-disable-next-line no-underscore-dangle
    await del(selected._id);

    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    await get();
    setLoadingDisableEnable(false);
  };

  const onRestore = async () => {
    setLoadingDisableEnable(true);
    // eslint-disable-next-line no-underscore-dangle
    await patch(selected._id, {
      disabled: false,
      disabledAt: null,
      disabledBy: null,
    });

    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    await get();
    setLoadingDisableEnable(false);
  };

  const onNewItem = async (item) => {
    await post(item);
    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    await get();
  };

  const onItemEdit = async (item) => {
    // eslint-disable-next-line no-underscore-dangle
    await patch(`${selected._id}?v=${selected.__v || 0}`, item);
    if (!response.ok) {
      const { error } = response.data;
      throw new Error(error || 'Something went wrong. Please try again.');
    }

    await get();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(debounce((search) => {
    const populatedEntries = Object.entries(search)
      // eslint-disable-next-line no-unused-vars
      .filter(([_key, val]) => !!val);

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

  const toggleNewModal = () => {
    setNewModalOpen(!newModalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  return (
    <Main height={{ min: '100vh' }} pad={{ vertical: '60px', horizontal: 'large' }}>
      <Box direction="row" justify="between" align="center" height={{ min: '100px' }}>
        <Heading level="3">{pluralEntity}</Heading>
        <Box direction="row" gap="medium" align="center">
          {selected?.disabled && (
            <OutlineButton
              key="restore"
              size="large"
              label="Enable"
              loading={loadingDisableEnable}
              onClick={() => setEnableModalOpen(true)}
            />
          )}

          {(!deleteDisabled || !selected?.disabled) && (
            <PrimaryButton
              key="delete"
              disabled={!selected}
              loading={!selected?.disabled && loadingDisableEnable}
              label={selected?.disabled ? 'Delete' : 'Disable'}
              onClick={selected?.disabled
                ? toggleDeleteModal
                : () => setDisableModalOpen(true)}
            />
          )}

          <OutlineButton
            disabled={!selected}
            label="Edit"
            onClick={toggleEditModal}
          />

          <PrimaryButton
            label="Add New"
            onClick={toggleNewModal}
          />
        </Box>
      </Box>

      <Box justify="between" fill>
        {/* TODO: update this with nicer UI */}
        {/*
          using this approach to display this on first load
          but on filter for example we want to keep the table state
          and display error in modal, so user can change the input
        */}
        {error && !transformedData && !hadDataRef.current && (
          <Box align="center">
            <Heading level="4">There was an error</Heading>
            <Button onClick={get} label="Try Again" />
          </Box>
        )}

        {!(error && !transformedData && !hadDataRef.current) && (
          <>
            <Box overflow="auto" border="bottom">
              <Grommet theme={theme} width={{ min: minWidth }}>
                <Box pad={{ bottom: 'small' }}>
                  <DataTableWrapper
                    columns={columns}
                    loading={loading}
                    data={transformedData}
                    pageSize={pageSize}
                    onSearch={onSearch}
                    onSort={onSort}
                    onClickRow={selectDisabled ? undefined : onRowClick}
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
        <ItemModal
          entity={singularEntity}
          columns={columnsProp}
          onNewItem={onNewItem}
          onClose={toggleNewModal}
        />
      )}

      {editModalOpen && (
        <ItemModal
          entity={singularEntity}
          columns={columnsProp}
          item={selected}
          onItemEdit={onItemEdit}
          onClose={toggleEditModal}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          entity={singularEntity}
          columns={columnsProp}
          item={selected}
          onClose={toggleDeleteModal}
          onDelete={onDelete}
        />
      )}

      {disableModalOpen && (
        <DisableModal
          entity={singularEntity}
          onClose={() => setDisableModalOpen(false)}
          onConfirm={onDisable}
        />
      )}

      {enableModalOpen && (
        <EnableModal
          entity={singularEntity}
          onClose={() => setEnableModalOpen(false)}
          onConfirm={onRestore}
        />
      )}

      {errorModalOpen && <ErrorModal onClose={() => setErrorModalOpen(false)} />}
    </Main>
  );
};

export default AdminTable;
