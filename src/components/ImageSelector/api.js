import { buildURL, handleResponse } from '../../shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const uploadFile = async (file, maxResolution, acceptedFormats) => {
  const url = buildURL('/admin/v2/images');
  const formData = new FormData();

  formData.append('file', file, file.filename);
  formData.append('maxResolution', maxResolution);

  acceptedFormats.forEach((format) => {
    formData.append('acceptedFormats[]', format);
  });

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  return handleResponse(res);
};
