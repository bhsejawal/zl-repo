import style from './style.scss';

const HabitatCard = ({ habitatImage, zooImage, title}) => (
  <div className={style.habitatCard}>
    <img src={habitatImage} alt="test" className={style.habitatImage} />
    <span className={style.title}>{title}</span>
    <img src={zooImage} alt="test" className={style.zooImage} />
  </div>
);

export default HabitatCard;
