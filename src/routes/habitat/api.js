export class RequestError extends Error {
  constructor(statusCode, body) {
    super(`Request failed with status code: ${statusCode}`);
    this.statusCode = statusCode;
    this.body = body;
  }
}

// eslint-disable-next-line import/prefer-default-export
// this is currently hardcoded and not in use
// TODO: Create habitat settings and .env support
export const getHabitatSettings = (habitat) => fetch(
  `${process.env.PREACT_APP_HTTP_PROTOCOL}${process.env.PREACT_APP_API_AUTHORITY}/habitats/${habitat}`,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  },
)
  .then((res) => {
    if (!res.ok) {
      throw new RequestError(res.status, res.json());
    }

    return res.json();
  })
  .then((pluginSettings) => pluginSettings);
