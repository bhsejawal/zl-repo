import { h } from 'preact';
import { Heading, Text, Box } from 'grommet';
import { PrimaryButton, OutlineButton} from 'Components/Buttons';
import { Link } from 'preact-router';

const DesignSystem = () => (
  <Box pad="large" align="center">
    <div>
      <Heading level="1" margin="0">H1</Heading>
      <Heading level="2" margin="0">H2</Heading>
      <Heading level="3" margin="0">Other Talks Today</Heading>
      <Heading level="4" margin="0">H4</Heading>
      <Heading level="5" margin="0">H5</Heading>
      <Heading level="6" margin="0">H6</Heading>
      <Text size="xlarge">Body</Text>
      <br />
      <Text size="large">Subhead</Text>
      <br />
      <Text size="medium" >Caption</Text>
      <br />
      <Text size="10px" weight={700}>Highlights</Text>
      <br />
      <Text size="small" weight={700}>Sub-caption</Text>
      <br />
      <Link href="/design">Link Large</Link>
      <br />
      <Link href="/design" className="small">Link Small</Link>
      <br />
      <br />

      <PrimaryButton size="large" label="Primary large" />
      &nbsp;
      <PrimaryButton disabled label="Primary disabled" />
      &nbsp;
      <PrimaryButton size="medium" label="Primary medium" />
      &nbsp;
      <PrimaryButton size="medium" label="Primary medium" loading="loading text..." />
      &nbsp;
      <PrimaryButton size="small" label="small" />
      &nbsp;
      <PrimaryButton size="small" label="save" loading />

      <br />
      <br />

      <OutlineButton size="large" label="Secondary large" />
      &nbsp;
      <OutlineButton disabled label="Secondary disabled" />
      &nbsp;
      <OutlineButton size="medium" label="Secondary medium" />
      &nbsp;
      <OutlineButton size="medium" label="Secondary medium" loading="loading text..." />
      &nbsp;
      <OutlineButton size="small" label="small" />
      &nbsp;
      <OutlineButton size="small" label="save" loading />

      <br />
      <br />
    </div>
  </Box>
);

export default DesignSystem;
