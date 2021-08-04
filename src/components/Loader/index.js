import { Box } from 'grommet';
import classnames from 'classnames';

import style from './style.scss';

const Loader = ({
  color = 'var(--logoBlue)',
  height = '200px',
  width = '200px',
  fill,
  className,
  absolute,
}) => (
  <Box
    className={classnames(style.palmAnimation, className, {[style.absolute]: absolute })}
    fill={fill}
    justify="center"
    align="center"
  >
    <svg height={height} width={width} stroke={color} viewBox="0 0 97 87" xmlns="http://www.w3.org/2000/svg" >
      <path className={style.left} d="M18.05,27.45c-3.42-3.22-9.52-4.95-11.16,2.33s3,15.81,5.61,17.93c4.8,3.92,11,1.17,12.25-4.46C26.35,36.33,21.85,31,18.05,27.45Z" />
      <path className={style.leftMiddle} d="M43.47,13.13c-2-4.24-7.06-8.08-11.24-1.89S29.28,27.06,30.92,30c3,5.4,9.78,5.08,13,.32C48,24.43,45.71,17.84,43.47,13.13Z" />
      <path className={style.rightMiddle} d="M57.63,17c2.88-3.7,8.64-6.35,11.38.59s-.54,16.08-2.78,18.58C62.1,40.79,55.59,39,53.44,33.66,50.8,27.06,54.42,21.12,57.63,17Z" />
      <path className={style.right} d="M81.75,34.46c4.1-2.28,10.44-2.48,10.25,5s-6.79,14.59-9.82,16c-5.61,2.64-10.91-1.53-10.79-7.3C71.53,41.05,77.19,37,81.75,34.46Z" />
      <path className={style.base} d="M69.41,63.75c-8-7.11-9.37-8.84-11.74-13.09s-6.93-7.85-10.89-8c-7.3-.29-10.23,7.11-14.36,11-4.72,4.51-16,8.13-13.13,17s17,.77,27.07,3.56,8.8,2.32,16.53,4.47S78.42,71.74,69.41,63.75Z" />
    </svg>
  </Box>
);

export default Loader;
