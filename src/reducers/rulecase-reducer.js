import * as ActionTypes from '../actions/action-types';

const initialState = {
    
}

function rulecase(state = initialState, action='') {
    switch(action.type) {
        
        case ActionTypes.ADD_RULECASE:
        case ActionTypes.UPDATE_RULECASE:
        case ActionTypes.REMOVE_RULECASE:
        default:
            return { ...state };
    }
}

export default rulecase;