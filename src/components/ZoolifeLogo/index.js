import { h } from 'preact';
import zoolifeLogo from 'Assets/zoolife.svg';
import Tag from 'Components/Tag';

const ZoolifeLogo = ({ landing }) => (
  <div>
    <img src={zoolifeLogo} alt="" />
    {landing && <Tag label="invite only" varient="light" />}
  </div>
);

export default ZoolifeLogo;
