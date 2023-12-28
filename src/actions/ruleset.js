
import * as ActionTypes from './action-types';
import { updateState } from './app';


export const uploadRuleset = (ruleset)  => (dispatch) => {
    dispatch(updateState('open'));
    return dispatch({
        type: ActionTypes.UPLOAD_RULESET,
        payload: { ruleset }
    });
}

export const uploadList = (name, list)  => (dispatch) => {
    //dispatch(updateState('open'));
    return dispatch({
        type: ActionTypes.UPLOAD_LIST,
        payload: { name, list }
    });
}

export const addRuleset = (name) => (dispatch) => {
    dispatch(updateState('open'));
    return dispatch({
        type: ActionTypes.ADD_RULESET,
        payload: { name }
    });
}

export const updateRulesetIndex = (name) => {
    return ({
        type: ActionTypes.UPDATE_RULESET_INDEX,
        payload: { name }
    })
}
