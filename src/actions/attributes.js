import * as ActionTypes from './action-types';

export const add = (attribute) => {
    const payload = { attribute };
    return ({ type: ActionTypes.ADD_ATTRIBUTE, payload});
}

export const update = (attribute, index) => {
    const payload = { attribute, index };

    return ({ type: ActionTypes.UPDATE_ATTRIBUTE, payload});
}

export const remove = (attribute, index) => {
    const payload = { attribute, index };

    return ({ type: ActionTypes.REMOVE_ATTRIBUTE, payload});
}

export const reset = () => {
    return ({type: ActionTypes.RESET_ATTRIBUTE})
}


export const handleAttribute = (action, attribute, index) => (dispatch) => {
    switch(action) {
        case 'ADD':
            return dispatch(add(attribute));
        case 'UPDATE':
            return dispatch(update(attribute, index));
        case 'REMOVE':
            return dispatch(remove(attribute, index));
        case 'RESET':
            return dispatch(reset());
    }
};