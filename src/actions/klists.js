import * as ActionTypes from './action-types';

//TODO: add() and upload() are identical. Remove one.

export const add = (klist) => {
    const payload = { klist };
    return ({ type: ActionTypes.UPLOAD_LIST, payload});
}

export const upload = (klist) => {
    const payload = { klist };
    console.log(`in upload of klists.js, payload: ${JSON.stringify(payload)} `);

    return ({ type: ActionTypes.UPLOAD_LIST, payload});
}

export const remove = (name) => {
    const payload = { name };

    return ({ type: ActionTypes.REMOVE_LIST, payload});
}

export const reset = () => {
    return ({type: ActionTypes.RESET_LIST});
}


export const handleKlist = (action, klist = {}, name = {}) => (dispatch) => {
    console.log(`in handleKlist, action: ${action}, klist: ${JSON.stringify(klist)}, name: ${JSON.stringify(name)} `);
    switch (action) {
        case 'ADD':
            return dispatch(add(klist));
        case 'UPLOAD':
            return dispatch(upload(klist));
        case 'REMOVE':
            return dispatch(remove(name));
        case 'RESET':
            return dispatch(reset());
    }
};