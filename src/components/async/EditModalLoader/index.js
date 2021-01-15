import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';

import FallbackLoader from './FallbackLoader';

const EditModal = lazy(() => import('async!./EditModal'));

const EditModalLoader = ({
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
    <Suspense fallback={<FallbackLoader />}>
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

export default EditModalLoader;
