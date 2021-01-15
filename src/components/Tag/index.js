import style from './style.scss';

const Tag = ({ label }) => (
  <div className={style.tag}>
    {label}
  </div>
);

export default Tag;
