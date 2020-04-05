
import * as ActionTypes from './action-types';

export const uploadRuleset = (ruleset)  => {
    return ({
        type: ActionTypes.UPLOAD_RULESET,
        payload: { ruleset }
    });
}

export const addRuleset = (name) => {
    return ({
        type: ActionTypes.ADD_RULESET,
        payload: { name }
    })
}

export const updateRulesetIndex = (name) => {
    return ({
        type: ActionTypes.UPDATE_RULESET_INDEX,
        payload: { name }
    })
}
