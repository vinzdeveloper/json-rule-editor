import * as ActionTypes from '../actions/action-types';

const initialState = {};

function attributes(state = initialState, action='') {
    switch(action.type) {
        
        case ActionTypes.ADD_ATTRIBUTE:
        case ActionTypes.UPDATE_ATTRIBUTE:
        case ActionTypes.REMOVE_ATTRIBUTE:
        case ActionTypes.SUBMIT_ATTRIBUTE:
        default:
            return { ...state };
    }
}

export default attributes;