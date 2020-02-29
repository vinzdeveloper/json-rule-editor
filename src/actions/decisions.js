import * as ActionTypes from './action-types';

export const addCase = (caseAttr, outcome) => {
    const payload = { caseAttr, outcome };

    return ({ type: ActionTypes.ADD_CASE, payload});
}

export const removeCase = (caseIndex, decisionIndex) => {
    const payload = { caseIndex, decisionIndex };

    return ({ type: ActionTypes.REMOVE_CASE, payload});
}

export const updateDecision = (caseAttr, decisionIndex, caseIndex) => {
    const payload = { caseAttr, decisionIndex, caseIndex };

    return ({ type: ActionTypes.UPDATE_DECISION, payload});
}

export const addDecision = (caseAttr, outcome) => {
    const payload = {decision: { cases: [ caseAttr ],
         outcome: outcome.value, type: outcome.type }};

    return ({ type: ActionTypes.ADD_DECISION, payload});
}

export const removeDecision = (decisionIndex) => {
    const payload = { decisionIndex };

    return ({ type: ActionTypes.REMOVE_DECISION, payload});
}

const find = (caseAttr, outcome, ruleset) => {
    const decision = ruleset.decisions && ruleset.decisions.find(decision => decision.outcome === outcome.value);
    return decision;
}

export const reset = () => {
    return ({type: ActionTypes.RESET_DECISION});
}

export const handleDecision = (action, editDecision={}) => (dispatch, getState) => {
    const {caseAttr, outcome} = editDecision;
    switch(action) {
        case 'ADD': {
            const activeRuleset = getState().ruleset.rulesets[getState().ruleset.activeRuleset];
            const decision = find(caseAttr, outcome, activeRuleset);
            if (decision) {
                return dispatch(addCase(caseAttr, outcome)); 
            } else {
                return dispatch(addDecision(caseAttr, outcome));
            }
        }
        case 'UPDATE': {
            const { decisionIndex, caseIndex } = editDecision;
            const activeRuleset = getState().ruleset.rulesets[getState().ruleset.activeRuleset];
            const decision = find(caseAttr, outcome, activeRuleset);
            if (decision && outcome.value === activeRuleset.decisions[decisionIndex].outcome) {
                return dispatch(updateDecision(caseAttr, decisionIndex, caseIndex)); 
            }
            return '';
        }
        case 'REMOVECASE': {
            const { decisionIndex, caseIndex } = editDecision;
            return dispatch(removeCase(caseIndex, decisionIndex));
        }
        case 'REMOVEDECISION': {
            const { decisionIndex } = editDecision;
            return dispatch(removeDecision(decisionIndex));
        }
        case 'RESET': {
            return dispatch(reset());
        }
    }
};
