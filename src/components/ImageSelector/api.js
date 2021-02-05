import { buildURL, handleResponse, post } from 'Shared/fetch';

// eslint-disable-next-line import/prefer-default-export
export const uploadFile = async (
  file,
  maxResolution,
  acceptedFormats,
  maxFileSize,
) => {
  const url = buildURL('/admin/v2/media');
  const formData = new FormData();

  formData.append('file', file, file.filename);

  if (maxResolution) {
    formData.append('maxResolution', maxResolution);
  }

  if (maxFileSize) {
    formData.append('maxFileSize', maxFileSize);
  }

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

export const fromUrlToS3 = (url) => {
  const apiUrl = buildURL('/admin/media/fromurl');
  return post(apiUrl, { url });
};

export const getHeaders = async (url) => {
  const res = await fetch(url, {
    method: 'HEAD',
  });

  return res.headers;
};
