import { combineReducers } from "redux";
import mainStream from './mainStream';
import user from './user';

export default combineReducers({
  mainStream,
  user,
});
