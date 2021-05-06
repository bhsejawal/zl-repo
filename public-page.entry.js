import { h, render, hydrate } from 'preact'
import app from './src/public'

const normalizeURL = (url) => (url[url.length - 1] === '/' ? url : `${url}/`);

const root = document.getElementById('preact_root')
  || document.body.firstElementChild

let preRenderData = {}
const inlineDataElement = document.querySelector('[type="__PREACT_CLI_DATA__"]');

if (inlineDataElement) {
  preRenderData = JSON.parse(decodeURI(inlineDataElement.innerHTML)).preRenderData
    || preRenderData;
}
/* An object named CLI_DATA is passed as a prop,
 * this keeps us future proof if in case we decide,
 * to send other data like at some point in time.
 */
const CLI_DATA = { preRenderData };
const currentURL = preRenderData.url ? normalizeURL(preRenderData.url) : '';
const canHydrate = process.env.PRERENDER
  && process.env.NODE_ENV === 'production'
  && hydrate
  && currentURL === normalizeURL(window.location.pathname);
const doRender = canHydrate ? hydrate : render;
doRender(h(app, { CLI_DATA }), document.body, root);
