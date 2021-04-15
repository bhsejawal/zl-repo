import { Suspense, lazy } from 'preact/compat';

import LoaderModal from 'Components/async/LoaderModal';

const ContactUsModal = lazy(() => import('Components/modals/ContactUs'));

const ContactUsModalLoader = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={<LoaderModal />}>
      <ContactUsModal />
    </Suspense>

  );
}

export default ContactUsModalLoader;
