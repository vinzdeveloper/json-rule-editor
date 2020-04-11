import { UPDATE_NAV_STATE, LOG_IN} from '../actions/action-types';

const initialState = {
    navState: 'closed',
    loggedIn: false,
}

const AppReducer = (state=initialState, action) => {
  const type = action.type;
  switch(type) {
    case UPDATE_NAV_STATE: {
      let nav = 'closed';
      if (action.payload && action.payload.flag === 'open') {
        nav = 'open';
      }
      return { ...state, navState: nav };
    }
    case LOG_IN:
      return { ...state, loggedIn: true };
    default:
      return state;
  }
}

export default AppReducer;