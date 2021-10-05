import { h, toChildArray } from 'preact';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const STRETCH = 'stretch';
const SCROLL = 'scroll';

const List = forwardRef(({ children, className }, ref) => {
  const itemsRef = useRef();
  const [layout, setLayout] = useState();
  const [scrolledToLeft, setScrolledToLeft] = useState(true);
  const [scrolledToRight, setScrolledToRight] = useState();

  const childrenLen = useMemo(() => toChildArray(children).length, [children]);

  const onMoveLeft = () => {
    const { left: leftEdgeX } = itemsRef.current.getBoundingClientRect();
    const children = Array.from(itemsRef.current.childNodes).reverse();
    const mostLeftEl = children.find((child) => {
      const { left } = child.getBoundingClientRect();
      return left + 1 < leftEdgeX;
    });

    const { left } = mostLeftEl.getBoundingClientRect();
    itemsRef.current.scrollBy({ left: left - leftEdgeX, behavior: 'smooth' });

    setScrolledToRight(false);
    // remember that it's reversed so we are checking for the last (most left)
    if (children.indexOf(mostLeftEl) === childrenLen - 1) {
      setScrolledToLeft(true);
    }
  };

  const onMoveRight = () => {
    const { right: rightEdgeX } = itemsRef.current.getBoundingClientRect();
    const children = Array.from(itemsRef.current.childNodes);
    const mostRightEl = children.find((child) => {
      const { right } = child.getBoundingClientRect();
      return right - 1 > rightEdgeX;
    });

    const { right } = mostRightEl.getBoundingClientRect();
    itemsRef.current.scrollBy({ left: right - rightEdgeX, behavior: 'smooth' });

    setScrolledToLeft(false);
    if (children.indexOf(mostRightEl) === childrenLen - 1) {
      setScrolledToRight(true);
    }
  };

  const updateLayout = useCallback(() => {
    const { width } = itemsRef.current.getBoundingClientRect();
    const nodesWidth = Array.from(itemsRef.current.childNodes)
      .map((child) => child.getBoundingClientRect().width)
      .reduce((acc, cur) => acc + cur, 0);

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

  useImperativeHandle(ref, () => ({ updateLayout }));

  const resizeObserver = useMemo(
    () => typeof ResizeObserver !== 'undefined' && new ResizeObserver(updateLayout),
    [updateLayout],
  );

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (layout && resizeObserver) {
      const domEl = itemsRef.current;
      resizeObserver.observe(domEl);
      return () => {
        resizeObserver.unobserve(domEl);
      }
    }
  }, [resizeObserver, layout]);

  return (
    <div className={classnames(style.wrapper, className)}>
      {layout === 'scroll' && (
        <div className={classnames(style.arrowWrapper, { [style.arrowDisabled]: scrolledToLeft })}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="2x"
            className={classnames(style.arrow, style.arrowLeft)}
            onClick={onMoveLeft}
          />
        </div>
      )}

      <div
        ref={itemsRef}
        className={classnames(
          style.items,
          {
            [style.stretch]: layout === STRETCH,
            [style.scroll]: layout === SCROLL,
            [style.hidden]: !layout,
          },
        )}
      >
        {children}
      </div>

      {layout === 'scroll' && (
        <div className={classnames(style.arrowWrapper, { [style.arrowDisabled]: scrolledToRight })}>
          <FontAwesomeIcon
            icon={faChevronRight}
            size="2x"
            className={classnames(style.arrow, style.arrowRight)}
            onClick={onMoveRight}
          />
        </div>
      )}
    </div>
  );
});

export default List;
