import { LandingSecondary } from 'Components/Buttons';

import { goToSignup } from '../../helpers';

import style from "../style.scss";

const LiveTalksSection = () => (
  <div className={style.bottom}>
    <div className={style.left}>
      <img
        src="https://zoolife.tv/assets/talk-image.png"
        alt="live talks"
        loading="lazy"
      />
    </div>
    <div className={style.right}>
      <div className={style.description}>
        <h2> Take part in engaging conversations with the experts.</h2>
        <p>
          Join daily keeper talks and interactive Q&amp;As with animal experts and naturalists.
        </p>
        <LandingSecondary onClick={goToSignup}>Join an Expert Talk</LandingSecondary>
      </div>
    </div>
  </div>
);

export default LiveTalksSection;
