import * as ActionTypes from '../actions/action-types';
import { cloneDeep } from 'lodash/lang';
import { findIndex } from 'lodash/array';

const initialState = {
	rulesets: [],
	activeRuleset: 0,
	updatedFlag: false,
	uploadedRules: []
};

const replaceRulesetByIndex = (rulesets, targetset, index) => {
	return [...rulesets.slice(0, index), targetset, ...rulesets.slice(index + 1)];
};
const reverseOperatorsMap = {
	'==': 'equal',
	'!=': 'notEqual',
	'<=': 'lessThanInclusive',
	'<': 'lessThan',
	'>': 'greaterThan',
	'>=': 'greaterThanInclusive'
};
function ruleset(state = initialState, action = '') {
	switch (action.type) {
		case ActionTypes.UPLOAD_RULESET: {
			const { ruleset } = action.payload;
			let rulesets;
			const [{ rules: rawRules }] = ruleset;

			// converting from our lhs,rhs format to name,value format
			const rules = rawRules.map(({ expressions, ...others }) => {
				return {
					expressions: expressions.map(({ lhs: name, operator, rhs: value }) => ({
						name,
						operator: reverseOperatorsMap[operator] || operator,
						value
					})),
					...others
				};
			});
			// const expressions = exps.map(({ lhs: name, operator, rhs: value }) => ({
			// 	name,
			// 	operator: reverseOperatorsMap[operator] || operator,
			// 	value
			// }));

			if (state.rulesets && state.rulesets.length > 0) {
				rulesets = state.rulesets.concat({
					name: `Ruleset-${state.rulesets.length + 1}`,
					atrribtues: [],
					decisions: [],
					data: rules
				});
			} else {
				rulesets = [{ name: `Ruleset-1`, atrribtues: [], decisions: [], data: rules }];
			}
			// console.log('state.rulesets', state.rulesets);
			return { ...state, rulesets: cloneDeep(rulesets), uploadedRules: cloneDeep(rulesets) };
		}

		case ActionTypes.ADD_RULESET: {
			const { name } = action.payload;
			const rulset = { name, attributes: [], decisions: [] };
			const count = state.rulesets.length === 0 ? 0 : state.rulesets.length;
			return { ...state, rulesets: state.rulesets.concat(rulset), activeRuleset: count };
		}

		case ActionTypes.ADD_RULESET_DATA: {
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			const { note: oldNote, expressions: oldExpressions = [], yields: oldYields = [] } =
				activeRuleSet.data || {};
			// activeRuleSet.data = [...dt, { ...action.payload }];
			let { note, expressions, yields, name } = action.payload;

			if (!note) {
				note = oldNote;
			}

			if (!expressions || expressions.length === 0) {
				expressions = oldExpressions;
			} else {
				expressions = [...oldExpressions, ...expressions];
			}

			if (!yields || yields.length === 0) {
				yields = oldYields;
			} else {
				yields = [...oldYields, ...yields];
			}
			if (activeRuleSet.data) {
				activeRuleSet.data.push({ note, expressions, yields, name });
			} else {
				activeRuleSet.data = [{ note, expressions, yields, name }];
			}
			// activeRuleSet.data = {
			// 	note,
			// 	expressions,
			// 	yields
			// };
			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.UPDATE_RULESET_INDEX: {
			const { name } = action.payload;
			const index = findIndex(state.rulesets, { name });
			return { ...state, activeRuleset: index };
		}

		case ActionTypes.ADD_DECISION: {
			const { condition } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			activeRuleSet.decisions = activeRuleSet.decisions.concat(condition);

			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.UPDATE_DECISION: {
			const { condition, decisionIndex } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };

			activeRuleSet.decisions[decisionIndex] = condition;

			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}
		case ActionTypes.REMOVE_DECISION: {
			const { decisionIndex } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };

			activeRuleSet.decisions.splice(decisionIndex, 1);

			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.REMOVE_DECISIONS: {
			// here outcome is an index
			const { outcome } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			activeRuleSet.data.splice(outcome, 1);
			// activeRuleSet.decisions = activeRuleSet.decisions.filter(
			// 	(decision) => decision.event && decision.event.type !== outcome
			// );
			// activeRuleSet.data;
			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.ADD_ATTRIBUTE: {
			const { attribute } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			activeRuleSet.attributes.push(attribute);

			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.UPDATE_ATTRIBUTE: {
			const { attribute, index } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			activeRuleSet.attributes.splice(index, 1, attribute);

			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.REMOVE_ATTRIBUTE: {
			const { index } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			activeRuleSet.attributes.splice(index, 1);

			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}

		case ActionTypes.RESET_ATTRIBUTE: {
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			if (
				state.uploadedRules[state.activeRuleset] &&
				state.uploadedRules[state.activeRuleset].attributes
			) {
				activeRuleSet.attributes = cloneDeep(state.uploadedRules[state.activeRuleset].attributes);

				return {
					...state,
					rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
				};
			}
			return { ...state };
		}

		case ActionTypes.RESET_DECISION: {
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			if (
				state.uploadedRules[state.activeRuleset] &&
				state.uploadedRules[state.activeRuleset].decisions
			) {
				activeRuleSet.decisions = cloneDeep(state.uploadedRules[state.activeRuleset].decisions);

				return {
					...state,
					rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
				};
			}
			return { ...state };
		}

		default:
			return { ...state };
	}
}

export default ruleset;
