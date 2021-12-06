import { useImperativeHandle } from 'preact/hooks';

// eslint-disable-next-line import/prefer-default-export
export const videoImperativeHandle = (controllerRef, containerRef, videoRef) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useImperativeHandle(controllerRef, () => ({
    requestFullscreen(mode) {
      let target;
      if (mode === 'vod') {
        target = videoRef;
      } else {
        target = containerRef;
      }
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) { /* Safari */
        target.webkitRequestFullscreen();
      } else if (target.msRequestFullscreen) { /* IE11 */
        target.msRequestFullscreen();
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    },
    get muted() { return videoRef.muted; },
    // eslint-disable-next-line no-param-reassign
    set muted(muted) { videoRef.muted = muted; },
    requestPictureInPicture() {
      videoRef.requestPictureInPicture();
    },
  }));
};
