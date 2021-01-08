import { h } from 'preact';
import Button from '../../components/Button';

import style from './style.scss';

const DesignSystem = () => (
  <div className={style.headerSpacing}>
    <br />
    { /* eslint-disable-next-line no-alert */}
    <Button onClick={() => alert('Click')} variant="primary">Primary</Button>
    &nbsp;
    <Button variant="primary" disabled>Primary disabled</Button>
    &nbsp;
    <Button variant="primary" size="sm">Primary small</Button>
    <br />
    <br />

    <Button variant="secondary">Secondary</Button>
    &nbsp;
    <Button variant="secondary" disabled>disabled</Button>
    &nbsp;
    <Button variant="secondary" size="sm">small</Button>
    <br />
    <br />

    <Button variant="outline">Outline</Button>
    &nbsp;
    <Button variant="outline" disabled>disabled</Button>
    &nbsp;
    <Button variant="outline" size="sm">small</Button>
    <br />
    <br />

    <Button variant="primary" size="xs">Save</Button>
    &nbsp;
    <Button variant="primary" disabled size="xs">disabled</Button>
    &nbsp;
    <br />
    <br />
    {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
    <a href="javascript:void(0)">Toronto Zoo</a>
  </div>
);

export default DesignSystem;
