import { h } from 'preact';
import Tag from 'Components/Tag';
import zoolifeLogo from './zoolife.svg';

const ZoolifeLogo = ({ landing }) => (
  <div>
    <img src={zoolifeLogo} alt="" />
    {landing && <Tag label="invite only" varient="light" />}
  </div>
);

export default ZoolifeLogo;
