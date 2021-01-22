import { combineReducers } from "redux";
import mainStream from './mainStream';
import user from './user';
import habitat from '../../routes/habitat/reducer';

export default combineReducers({
  mainStream,
  user,
  habitat,
});
