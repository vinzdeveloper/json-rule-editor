import { UPDATE_NAV_STATE, LOG_IN } from './action-types';
import { sendGevents } from '../utils/gevents';


export function updateState(flag) {
    return ({
        type: UPDATE_NAV_STATE,
        payload: { flag }
    });
}

export function login(action) {
    sendGevents({ narrative: action, name: 'Login'});
    return ({
        type: LOG_IN,
    });
}


