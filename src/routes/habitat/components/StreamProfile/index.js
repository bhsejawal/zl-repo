import { faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Description from './description';
import Info from './info';
import Members from './members';

import style from './style.scss';

const StreamProfile = () => {
  const [info, setInfo] = useState();
  const [members, setMembers] = useState();
  const [desc, setDesc] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const load = async () => {
      try {
        // TODO: implement this.
        // currently using mock data
        await new Promise((r) => setTimeout(r, 1000));
        setInfo({
          profileImg: 'http://placehold.it/120?text=profile-img',
          name: 'The Western Lowland Gorillas',
          zooName: 'Toronto Zoo',
        });

        setMembers([
          { name: 'Charlie', age: 50, profileImg: 'http://placehold.it/60?text=Charlie' },
          { name: 'Cleo', age: 50, profileImg: 'http://placehold.it/60?text=Cleo' },
          { name: 'Felicity', age: 50, profileImg: 'http://placehold.it/60?text=Felicity' },
          { name: 'Kobe', age: 50, profileImg: 'http://placehold.it/60?text=Kobe' },
          { name: 'Saul', age: 50, profileImg: 'http://placehold.it/60?text=Saul' },
        ]);

        setDesc('These Gorillas are part of a protection program to improve diminishing Gorilla populations.');
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className={style.profile}>
      {loading && <FontAwesomeIcon icon={faSpinner} spin size="2x" />}
      {error && (
        <div className={style.error}>
          <FontAwesomeIcon icon={faTimes} size="3x" />
          <p>There was an error. Please try again</p>
        </div>
      )}

      {!loading && !error && (
        // eslint-disable-next-line react/jsx-fragments
        <>
          <Info info={info} />
          <Members members={members} />
          <Description text={desc} />
        </>
      )}
    </div>
  )
};

export default StreamProfile;
