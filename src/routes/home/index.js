import { h } from 'preact';
import { connect } from 'react-redux';

import { toggleHabitat } from '../../redux/actions';
import style from './style.scss';

const Home = ({ hasHabitat, toggleHabitatAction }) => (
  <div className={style.home}>
    <h1>Home</h1>
    <p>
      Habitat on Redux:
      {JSON.stringify(hasHabitat)}
    </p>
    <button type="button" onClick={toggleHabitatAction}>
      Change Habitat
    </button>
  </div>
);

export default connect(({ hasHabitat }) => ({ hasHabitat }), {
  toggleHabitatAction: toggleHabitat,
})(Home);
