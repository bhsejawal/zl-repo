import { h } from 'preact';
import { memo } from 'preact/compat';
import { Box, Button, Text } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';

const Pagination = ({ page, totalPages, onChange }) => (
  <Box direction="row">
    <Button
      plain
      disabled={page === 1}
      onClick={() => onChange(page - 1)}
    >
      <FontAwesomeIcon
        size="lg"
        icon={faChevronLeft}
        opacity={page === 1 ? '.3' : undefined}
      />
    </Button>

    <Box pad={{ horizontal: 'small' }}>
      <Text size="large">
        {page}
        /
        {totalPages}
      </Text>
    </Box>

    <Button
      plain
      disabled={page === totalPages}
      onClick={() => onChange(page + 1)}
    >
      <FontAwesomeIcon
        size="lg"
        icon={faChevronRight}
        opacity={page === totalPages ? '.3' : undefined}
      />
    </Button>
  </Box>
);

export default memo(Pagination);
