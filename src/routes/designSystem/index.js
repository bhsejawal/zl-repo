import { h } from 'preact';
import Button from 'Components/Button';
import { PrimaryButton, SecondaryButton, OutlineButton} from 'Components/Buttons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlarmClock, faAmpGuitar, faDatabase } from "@fortawesome/pro-light-svg-icons";

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
    <br />
    <br />
    <br />
    Grommet
    <br />
    { /* eslint-disable-next-line no-alert */}
    <PrimaryButton label="Primary" onClick={() => alert('Click')} />
    &nbsp;
    <PrimaryButton disabled label="Primary disabled" />
    &nbsp;
    <PrimaryButton className="small" label="Primary small" />
    <br />
    <br />

    <SecondaryButton label="Secondary" />
    &nbsp;
    <SecondaryButton disabled label="Disabled" />
    &nbsp;
    <SecondaryButton className="small" label="small" />
    <br />
    <br />

    <OutlineButton label="Outline" />
    &nbsp;
    <OutlineButton disabled label="disabled" />
    &nbsp;
    <OutlineButton className="small" label="small" />
    <br />
    <br />
    <PrimaryButton className="xsmall" label="Save" />
    &nbsp;
    <PrimaryButton disabled className="xsmall" label="disabled" />
    <br />
    <br />
    <br />
    <br />
    <br />
    <PrimaryButton label="Icon" icon={<FontAwesomeIcon icon={faAlarmClock} />} />
    &nbsp;
    <OutlineButton label="Icon" icon={<FontAwesomeIcon icon={faAmpGuitar} />} />
    &nbsp;
    <PrimaryButton className="Icon" label="Small" icon={<FontAwesomeIcon icon={faDatabase} />} />
    &nbsp;
    <PrimaryButton className="xsmall" label="xsmall" icon={<FontAwesomeIcon icon={faAlarmClock} />} />
    <br />
    <br />
    <PrimaryButton style={{color: 'red', backgroundColor: 'green'}} className="xsmall" label="xsmall" icon={<FontAwesomeIcon icon={faAlarmClock} />} />
  </div>
);

export default DesignSystem;
