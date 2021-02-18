import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import Loader from 'Components/async/Loader';

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
    <Suspense fallback={<Loader />}>
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
