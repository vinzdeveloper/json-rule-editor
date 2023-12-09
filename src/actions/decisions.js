import * as ActionTypes from './action-types';

export const removeDecision = (decisionIndex) => {
    const payload = { decisionIndex };

    return ({ type: ActionTypes.REMOVE_DECISION, payload});
}

export const updateDecision = (condition, decisionIndex) => {
    const payload = { condition, decisionIndex };

    return ({ type: ActionTypes.UPDATE_DECISION, payload});
}

export const addDecision = (condition) => {
    const payload = { condition };
    return ({ type: ActionTypes.ADD_DECISION, payload});
}

export const removeDecisions = (outcome) => {
    const payload = { outcome };

    return ({ type: ActionTypes.REMOVE_DECISIONS, payload});
}

export const reset = () => {
    return ({type: ActionTypes.RESET_DECISION});
}

export const moveRuleUp = (decisionIndex) => {
    const payload = { decisionIndex };

    return ({ type: ActionTypes.MOVE_RULE_UP, payload});
}

export const moveRuleDown = (decisionIndex) => {
    const payload = { decisionIndex };

    return ({ type: ActionTypes.MOVE_RULE_DOWN, payload});
}

export const handleDecision = (action, editDecision={}) => (dispatch) => {
    const { condition } = editDecision;
    switch(action) {
        case 'ADD': {
            return dispatch(addDecision(condition));
        }
        case 'UPDATE': {
            const { decisionIndex } = editDecision;
            return dispatch(updateDecision(condition, decisionIndex)); 
        }
        case 'REMOVECONDITION': {
            const { decisionIndex } = editDecision;
            return dispatch(removeDecision(decisionIndex));
        }
        case 'REMOVEDECISIONS': {
            const { outcome } = editDecision;
            return dispatch(removeDecisions(outcome));
        }
        case 'RESET': {
            return dispatch(reset());
        }
        case 'MOVEUP': {
            const { decisionIndex } = editDecision;
            return dispatch(moveRuleUp(decisionIndex));
        }
        case 'MOVEDOWN': {
            const { decisionIndex } = editDecision;
            return dispatch(moveRuleDown(decisionIndex));
        }
    }
};
