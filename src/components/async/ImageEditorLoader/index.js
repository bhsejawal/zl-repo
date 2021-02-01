import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import FallbackLoader from '../../FallbackLoader';

const EditModal = lazy(() => import('./EditModal'));

const TextEditorLoader = ({
  initialImgUrl,
  postToUrl,
  imageProp,
  constraints,
  open,
  onClose,
  onUpdate,
}) => {
  if (!open) {
    return null;
  }

  return (
    <Suspense fallback={<FallbackLoader />}>
      <EditModal
        initialImgUrl={initialImgUrl}
        postToUrl={postToUrl}
        imageProp={imageProp}
        constraints={constraints}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
};

export default TextEditorLoader;
