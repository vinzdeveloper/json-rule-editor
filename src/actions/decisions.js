import * as ActionTypes from './action-types';

export const addCase = (caseAttr, outcome) => {
    const payload = { caseAttr, outcome };

    return ({ type: ActionTypes.ADD_CASE, payload});
}

export const updateCase = (caseAttr, decisionIndex, caseIndex) => {
    const payload = { caseAttr, decisionIndex, caseIndex };

    return ({ type: ActionTypes.UPDATE_CASE, payload});
}

export const addDecision = (caseAttr, outcome) => {
    const payload = {decision: { cases: [ caseAttr ],
         outcome: outcome.value, type: outcome.type }};

    return ({ type: ActionTypes.ADD_DECISION, payload});
}

export const update = (decision, index) => {
    const payload = { decision, index};

    return ({ type: ActionTypes.UPDATE_DECISION, payload});
}

export const remove = (decision, index) => {
    const payload = { decision, index};

    return ({ type: ActionTypes.REMOVE_DECISION, payload});
}

const find = (caseAttr, outcome, ruleset) => {
    const decision = ruleset.decisions && ruleset.decisions.find(decision => decision.outcome === outcome.value);
    return decision;
}

export const handleDecision = (action, decision, index) => (dispatch, getState) => {
    const {caseAttr, outcome} = decision;
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
            const activeRuleset = getState().ruleset.rulesets[getState().ruleset.activeRuleset];
            const { decisionIndex, caseIndex } = decision;
            const decision = find(caseAttr, outcome, activeRuleset);
            if (decision && outcome.value === activeRuleset.decisions[decisionIndex].outcome) {
                return dispatch(updateCase(caseAttr, decisionIndex, caseIndex)); 
            } else if (decision && outcome.value !== activeRuleset.decisions[decisionIndex].outcome) {
                return dispatch(addCase(caseAttr, outcome)); 
            } else {
                return dispatch(addDecision(caseAttr, outcome));
            }
        }
        case 'REMOVE':
            return dispatch(remove(decision, index));
    }
};
