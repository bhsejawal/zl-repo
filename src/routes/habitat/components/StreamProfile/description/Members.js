import { h } from 'preact';
import { connect } from 'react-redux';

import style from './style.scss';

const Members = ({ familyCards }) => {
  if (!familyCards?.length) {
    return null;
  }

  return (
    <div className={style.members}>
      <span style={{ color: '#757575'}}>Family:</span>
      &nbsp;
      <span>{familyCards.map(({ name }) => (name)).join(', ')}</span>
    </div>
  );
};

export default connect(({
  habitat: { cards: { familyCards }},
}) => ({
  familyCards,
}))(Members);
