import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect } from 'preact/hooks';
import { getUser } from "Components/AppLoader/actions";
import style from './style.scss';

const AppLoader = ({ getUserAction, showAppLoader }) => {
  useEffect(() => {
    getUserAction();
  }, [getUserAction]);

  if (!showAppLoader) {
    return null;
  }

  return (
    <div className={style.appLoader}>
      Loading...
    </div>
  );
};

export default connect(
  ({ appLoader: { show }}) => ({ showAppLoader: show }),
  { getUserAction: getUser },
)(AppLoader);
