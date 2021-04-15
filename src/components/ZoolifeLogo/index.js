import { h } from 'preact';
import zoolifeLogo from 'Assets/zoolife.svg';
import Tag from 'Components/Tag';

const ZoolifeLogo = () => (
  <div>
    <img src={zoolifeLogo} alt="" />
    <Tag label="invite only" varient="light" />
  </div>
);

export default ZoolifeLogo;
