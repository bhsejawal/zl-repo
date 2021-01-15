import { useRef } from 'preact/hooks';
import style from './style.scss';
import cursor from './cursor.png';

const CameraPin = () => {
  const draggedElRef = useRef();

  const onDragStart = (evt) => {
    const wrapper = document.createElement('div');
    const elCopy = document.createElement('img');
    elCopy.src = evt.target.src;

    wrapper.style.height = `40px`;
    wrapper.classList.add(style.dragged);
    wrapper.append(elCopy);
    document.body.append(wrapper);

    evt.dataTransfer.setDragImage(wrapper, 16, 40);
    evt.dataTransfer.setData('text', evt.target.src);
    evt.dataTransfer.setData('type', 'cursorPin');
    draggedElRef.current = wrapper;
  };

  const onDragEnd = () => draggedElRef.current.remove();

  return (
    <div className={style.cameraPinContainer}>
      <img
        draggable
        src={cursor}
        alt="draggable cursor"
        className={style.cameraPin}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    </div>
  )
}

export default CameraPin;
