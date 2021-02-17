import { h } from 'preact';
import { Heading, Text, Box } from 'grommet';
import Button from 'Components/Button';
import { PrimaryButton, SecondaryButton, OutlineButton} from 'Components/Buttons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlarmClock, faAmpGuitar, faDatabase } from "@fortawesome/pro-light-svg-icons";

const DesignSystem = () => (
  <Box pad="large" align="center">
    <div>
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
      <Heading level="1">H1</Heading>
      <Heading level="2">H2</Heading>
      <Heading level="3">H3</Heading>
      <Heading level="4">H4</Heading>
      <Text size="large">Body</Text>
      <Heading level="6">Subhead</Heading>
      <Text size="medium">Caption</Text>
      <Text size="small">Sub-caption</Text>
      <br />
      <br />
      <Text size="large" color="accent-1" as="div">Accent 1</Text>
      <Text size="large" color="accent-2" as="div">Accent 2</Text>
      <Text size="large" color="accent-3" as="div">Accent 3</Text>
      <Text size="large" color="accent-4" as="div">Accent 4</Text>
      <Text size="large" color="accent-5" as="div">Accent 5</Text>
      <Text size="large" color="accent-6" as="div">Accent 6</Text>
      <Text size="large" color="accent-7" as="div">Accent 7</Text>
      <Text size="large" color="accent-8" as="div">Accent 8</Text>
      <Text size="large" color="accent-9" as="div">Accent 9</Text>
      <Text size="large" color="accent-10" as="div">Accent 10</Text>
      <Text size="large" color="accent-11" as="div">Accent 11</Text>
      <Text size="large" color="accent-12" as="div">Accent 12</Text>
      <Text size="large" color="dark-1" as="div">Dark 1</Text>
      <Text size="large" color="dark-2" as="div">Dark 2</Text>
      <Text size="large" color="dark-3" as="div">Dark 3</Text>
      <Text size="large" color="light-1" as="div">Light 1</Text>
      <Text size="large" color="light-2" as="div">Light 2</Text>
      <Text size="large" color="light-3" as="div">Light 3</Text>

      {/* TODO: remove global style for links */}
      {/* TODO: replace buttons */}
      <Text size="large" as="div" weight="normal">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">
          Link
        </a>
      </Text>
      <Heading level="6" as="div">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">
          Link
        </a>
      </Heading>
      <br />
      <br />
      {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
      <a href="javascript:void(0)">Toronto Zoo</a>
      <br />
      <br />
      <br />
      Grommet
      <br />
      <br />
      { /* eslint-disable-next-line no-alert */}
      <PrimaryButton size="large" label="Primary large" onClick={() => alert('Click')} />
      &nbsp;
      <PrimaryButton disabled label="Primary disabled" />
      &nbsp;
      <PrimaryButton size="small" label="Primary small" />
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
      <PrimaryButton size="large" loading className="large" label="Loading button" />
      &nbsp;
      <PrimaryButton size="large" loading="Updating..." className="large" label="Loading button" />
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
  </Box>
);

export default DesignSystem;
