import { h } from 'preact';
import { route } from 'preact-router';
import { Grommet, Menu as GrommetMenu } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-light-svg-icons';

import { hasPermission } from '../../Authorize';

import style from './style.scss';

const Menu = () => {
  if (!hasPermission('admin:menu')) {
    return null;
  }

  return (
    <div className={style.menuContainer}>
      <Grommet className={style.wrapper}>
        <GrommetMenu
          dropProps={{
            align: { top: 'bottom', left: 'left' },
          }}
          icon={false}
          label={<FontAwesomeIcon icon={faBars} />}
          items={[
            { label: 'Test 1', onClick: () => route('/admin/test') },
            { label: 'Test 2', onClick: () => route('/admin/test/something') },
            { label: 'Test 3', onClick: () => route('/admin/random/something') },
          ]}
        />
      </Grommet>
    </div>
  );
};

export default Menu;
