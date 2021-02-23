import * as ActionTypes from './action-types';

export const removeDecision = (decisionIndex, rulecaseIndex, type) => {
	const payload = { decisionIndex, rulecaseIndex, type };

	return { type: ActionTypes.REMOVE_DECISION, payload };
};

export const updateDecision = (payload) => {
	return { type: ActionTypes.UPDATE_DECISION, payload };
};

export const addRulesetData = (payload) => {
	return { type: ActionTypes.ADD_RULESET_DATA, payload };
};

export const addDecision = (condition) => {
	const payload = { condition };
	return { type: ActionTypes.ADD_DECISION, payload };
};

export const removeDecisions = (outcome) => {
	const payload = { outcome };

	return { type: ActionTypes.REMOVE_DECISIONS, payload };
};

export const reset = () => {
	return { type: ActionTypes.RESET_DECISION };
};

export const handleDecision = (action, editDecision = {}) => (dispatch) => {
	const { condition } = editDecision;
	switch (action) {
		case 'ADD': {
			return dispatch(addDecision(condition));
		}
		case 'UPDATE': {
			return dispatch(updateDecision(editDecision));
		}
		case 'REMOVECONDITION': {
			const { decisionIndex, rulecaseIndex, type } = editDecision;
			return dispatch(removeDecision(decisionIndex, rulecaseIndex, type));
		}
		case 'REMOVEDECISIONS': {
			const { outcome } = editDecision;
			return dispatch(removeDecisions(outcome));
		}
		case 'RESET': {
			return dispatch(reset());
		}
	}
};

export const changeRulecaseOrder = (payload) => {
	return { type: ActionTypes.CHANGE_RULECASE_ORDER, payload };
};
export const addNewItem = (payload) => {
	return {
		type: ActionTypes.ADD_NEW_ITEM,
		payload
	};
};
