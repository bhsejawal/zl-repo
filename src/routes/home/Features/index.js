import { h } from 'preact';

import AvatarSection from './AvatarSection';
import FeatureSection from './FeatureSection';
import LiveTalksSection from './LiveTalksSection';

import style from './style.scss';

const Features = () => (
  <div className={style.features}>
    <AvatarSection />
    <FeatureSection />
    <LiveTalksSection />
  </div>
);

export default Features;
