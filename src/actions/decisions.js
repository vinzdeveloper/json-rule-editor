import * as ActionTypes from './action-types';

export const removeDecision = (decisionIndex) => {
    const payload = { decisionIndex };

    return ({ type: ActionTypes.REMOVE_DECISION, payload});
}

export const updateDecision = (rule, ruleIndex) => {
    const payload = { rule, ruleIndex };

    return ({ type: ActionTypes.UPDATE_DECISION, payload});
}

export const addDecision = (condition, metadata) => {
    const payload = { condition, metadata };
    console.log(`in addDecision, payload: ${JSON.stringify(payload)} `);
    return ({ type: ActionTypes.ADD_DECISION, payload});
}

export const removeDecisions = (index) => {
    const payload = { index };

    return ({ type: ActionTypes.REMOVE_DECISIONS, payload});
}

export const updateRules = (rule) => {
    const payload = { rule };
    console.log(`in updateRules of decisions.js, payload: ${JSON.stringify(payload)} `);
    return ({ type: ActionTypes.UPDATE_RULE, payload});
}

export const reset = () => {
    return ({type: ActionTypes.RESET_DECISION});
}

export const moveRuleUp = (ruleIndex) => {
    const payload = { ruleIndex };

    return ({ type: ActionTypes.MOVE_RULE_UP, payload});
}

export const moveRuleDown = (ruleIndex) => {
    const payload = { ruleIndex };

    return ({ type: ActionTypes.MOVE_RULE_DOWN, payload});
}

export const uploadList = (listContent) => {
    console.log(`in uploadList, listContent: ${JSON.stringify(listContent)} `);
    const payload = { listContent };

    return ({ type: ActionTypes.UPLOAD_LIST, payload});
}

export const handleDecision = (action, editDecision={}, metadata = {}) => (dispatch) => {
    const { condition } = editDecision;
    switch(action) {
        case 'ADD': {
            console.log(`in handleDecision, metadata: ${JSON.stringify(metadata)} `);
            return dispatch(addDecision(condition, metadata));
        }
        // case 'UPDATE': {
        //     const { decisionIndex } = editDecision;
        //     return dispatch(updateDecision(condition, decisionIndex)); 
        // }
        case 'REMOVECONDITION': {
            const { decisionIndex } = editDecision;
            return dispatch(removeDecision(decisionIndex));
        }
        case 'REMOVEDECISIONS': {
            const { index } = editDecision;
            return dispatch(removeDecisions(index));
        }
        case 'RESET': {
            return dispatch(reset());
        }
        case 'UPDATERULE': {
            return dispatch(updateRules(editDecision)); 
        }

        case 'MOVEUP': {
            const { ruleIndex } = editDecision;
            return dispatch(moveRuleUp(ruleIndex));
        }
        case 'MOVEDOWN': {
            const { ruleIndex } = editDecision;
            return dispatch(moveRuleDown(ruleIndex));
        }
        case 'UPLOADLIST': {
            //const { listContent } = editDecision;
            return dispatch(uploadList(editDecision));
        }
    }
};
