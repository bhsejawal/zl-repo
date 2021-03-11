import { Layer } from 'grommet';
import Loader from '../Loader';

const LoaderModal = ({
  full,
  height,
  width,
}) => (
  <Layer
    animation="fadeIn"
    full={full}
  >
    <Loader height={height} width={width} fill={full} />
  </Layer>
);

export default LoaderModal;
