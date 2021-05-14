import { h } from 'preact';
import ErrorPage from '../../components/ErrorPage';

const NotFound = ({ url }) => (
  <ErrorPage
    error="404"
    message="Looks like this page couldn&apos;t be found."
    url={url}
  />
);

export default NotFound;
