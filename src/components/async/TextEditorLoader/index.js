import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import Loader from 'Components/async/Loader';

const EditModal = lazy(() => import('./EditModal'));

const TextEditorLoader = ({
  initialText,
  postToUrl,
  textProp,
  sizeLimit,
  minLen,
  maxLen,
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
        initialText={initialText}
        postToUrl={postToUrl}
        textProp={textProp}
        sizeLimit={sizeLimit}
        minLen={minLen}
        maxLen={maxLen}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    </Suspense>
  );
};

export default TextEditorLoader;
