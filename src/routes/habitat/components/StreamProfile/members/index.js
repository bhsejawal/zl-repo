import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import Member from './member';

import style from './style.scss';

const STRETCH = 'stretch';
const SCROLL = 'scroll';

const Members = ({ members = [] }) => {
  const membersRef = useRef();
  const loadedImagesRef = useRef(0);
  const [layout, setLayout] = useState();
  const [scrolledToLeft, setScrolledToLeft] = useState(true);
  const [scrolledToRight, setScrolledToRight] = useState();

  const onMoveLeft = () => {
    const { left: leftEdgeX } = membersRef.current.getBoundingClientRect();
    const children = Array.from(membersRef.current.childNodes).reverse();
    const mostLeftEl = children.find((child) => {
      const { left } = child.getBoundingClientRect();
      return left + 1 < leftEdgeX;
    });

    const { left } = mostLeftEl.getBoundingClientRect();
    membersRef.current.scrollBy({ left: left - leftEdgeX, behavior: 'smooth' });

    setScrolledToRight(false);
    // remember that it's reversed so we are checking for the last (most left)
    if (children.indexOf(mostLeftEl) === members.length - 1) {
      setScrolledToLeft(true);
    }
  };

  const onMoveRight = () => {
    const { right: rightEdgeX } = membersRef.current.getBoundingClientRect();
    const children = Array.from(membersRef.current.childNodes);
    const mostRightEl = children.find((child) => {
      const { right } = child.getBoundingClientRect();
      return right - 1 > rightEdgeX;
    });

    const { right } = mostRightEl.getBoundingClientRect();
    membersRef.current.scrollBy({ left: right - rightEdgeX, behavior: 'smooth' });

    setScrolledToLeft(false);
    if (children.indexOf(mostRightEl) === members.length - 1) {
      setScrolledToRight(true);
    }
  };

  const updateLayout = useCallback(() => {
    const { width } = membersRef.current.getBoundingClientRect();
    const nodesWidth = Array.from(membersRef.current.childNodes)
      .map((child) => child.getBoundingClientRect().width)
      .reduce((acc = 0, cur) => acc + cur);

    if (width >= nodesWidth) {
      setLayout(STRETCH);
    } else {
      setLayout(SCROLL);
      if (layout !== SCROLL) {
        setScrolledToLeft(true);
        setScrolledToRight(false);
      }
    }
  }, [layout]);

  const onImgLoad = useCallback(() => {
    loadedImagesRef.current += 1;
    if (loadedImagesRef.current === members.length) {
      updateLayout();
    }
  }, [updateLayout, members]);

  const resizeObserver = useMemo(() => new ResizeObserver(updateLayout), [updateLayout]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (layout) {
      const domEl = membersRef.current;
      resizeObserver.observe(domEl);
      return () => {
        resizeObserver.unobserve(domEl);
      }
    }
  }, [resizeObserver, layout]);

  return (
    <div className={style.wrapper}>
      {layout === 'scroll' && (
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="2x"
          className={classnames(
            style.arrow,
            style.arrowLeft,
            { [style.arrowDisabled]: scrolledToLeft },
          )}
          onClick={onMoveLeft}
        />
      )}

      <div
        ref={membersRef}
        className={classnames(
          style.members,
          {
            [style.stretch]: layout === STRETCH,
            [style.scroll]: layout === SCROLL,
            [style.hidden]: !layout,
          },
        )}
      >
        {members.map(({ name, age, profileImg }, ind) => (
          <Member
            key={`${name}-${age}-${profileImg}`}
            index={ind}
            name={name}
            age={age}
            profileImg={profileImg}
            onLoad={onImgLoad}
          />
        ))}
      </div>

      {layout === 'scroll' && (
        <FontAwesomeIcon
          icon={faChevronRight}
          size="2x"
          className={classnames(
            style.arrow,
            style.arrowRight,
            { [style.arrowDisabled]: scrolledToRight },
          )}
          onClick={onMoveRight}
        />
      )}
    </div>
  )
};

export default Members;
