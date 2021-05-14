import { h } from 'preact';
import { memo } from 'preact/compat';
import { Box, DataTable, Text } from 'grommet';

const loadingPlaceholderData = [{}, {}, {}, {}, {}, {}, {}, {}];

const DataTableWrapper = ({
  columns,
  loading,
  data,
  pageSize,
  onSearch,
  onSort,
  onClickRow,
}) => (
  <DataTable
    pin
    fill
    step={pageSize + 1}
    columns={columns}
    data={(loading && !data.length) ? loadingPlaceholderData : data}
    onSearch={onSearch}
    onSort={onSort}
    onClickRow={onClickRow}
    background={{ header: { color: 'white' } }}
    sort={{ external: true }}
    placeholder={loading && (
      <Box
        fill
        align="center"
        justify="center"
        direction="row"
        pad="large"
        gap="small"
        background={{ color: 'background-front', opacity: 'strong' }}
      >
        {/* This component is currently not present. We'll need to wait for the next release */}
        {/* <Spinner /> */}
        <Text weight={900}>Loading ...</Text>
      </Box>
    )}
  />
);

export default memo(DataTableWrapper);
