import { cloneElement, toChildArray } from 'preact';
import { Box } from 'grommet';

const PageWrapper = ({ children, ...props }) => {
  const childrenWithProps = toChildArray(children)
    .map((child) => child && cloneElement(child, props));

  return (
    <Box fill className="pageWrapper">
      <Box fill overflow="auto">
        <Box
          fill
          width={{ max: "var(--maxWidth)", min: "350px" }}
          margin={{ horizontal: 'auto' }}
          background="white">
          {childrenWithProps}
        </Box>
      </Box>
    </Box>
  );
}

export default PageWrapper;
