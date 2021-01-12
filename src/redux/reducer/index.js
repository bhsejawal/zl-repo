import { combineReducers } from "redux";
import habitat from './habitat';
import user from './user';

export default combineReducers({
  habitat,
  user,
});
