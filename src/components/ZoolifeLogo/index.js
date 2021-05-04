import { h } from 'preact';
import { Link } from 'preact-router';
import Tag from 'Components/Tag';
import zoolifeLogo from './zoolife.svg';

const ZoolifeLogo = ({ landing }) => (
  <div>
    <Link href="/">
      <img width="100" src={zoolifeLogo} alt="" />
    </Link>
    {landing && <Tag label="invite only" varient="light" />}
  </div>
);

export default ZoolifeLogo;
