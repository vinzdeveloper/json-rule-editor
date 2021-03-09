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
	'>=': 'greaterThanInclusive',
	not_in: 'notIn'
};
const getStringValue = (value) => {
	const nullIndex = Array.isArray(value) && value.findIndex((val) => val === null);
	if (nullIndex !== false && nullIndex !== -1 && value && Array.isArray(value)) {
		value.splice(nullIndex, 1);
	}

	if (value === 'null') {
		return undefined;
	}
	return `${value}`;
};
const getNullable = (value) => {
	return value === null || (Array.isArray(value) && value.findIndex((val) => val === null) !== -1);
};
function ruleset(state = initialState || {}, action = '') {
	switch (action.type) {
		case ActionTypes.UPDATE_RULSET_NAME: {
			const { name } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			activeRuleSet.name = name;

			return {
				...state,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}
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
						nullable: getNullable(value),

						value: getStringValue(value)
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
				// rulesets = state.rulesets.concat({
				// 	name: `Ruleset-${state.rulesets.length + 1}`,
				// 	atrribtues: [],
				// 	decisions: [],
				// 	data: rules
				// });
				rulesets = [{ name: state.rulesets[0].name, atrribtues: [], decisions: [], data: rules }];
			} else {
				rulesets = [
					{
						name: (ruleset && ruleset[0] && ruleset[0].name) || `Ruleset`,
						atrribtues: [],
						decisions: [],
						data: rules
					}
				];
			}
			// console.log('state.rulesets', state.rulesets);
			return { ...state, rulesets: cloneDeep(rulesets), uploadedRules: cloneDeep(rulesets) };
		}

		case ActionTypes.ADD_RULESET: {
			const { name } = action.payload;
			const rulset = { name, attributes: [], decisions: [] };
			// const count = state.rulesets.length === 0 ? 0 : state.rulesets.length;
			return { ...state, rulesets: [rulset], activeRuleset: 0 };
		}

		case ActionTypes.ADD_RULESET_DATA: {
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			const { note: oldNote, expressions: oldExpressions = [], yields: oldYields = [] } =
				activeRuleSet.data || {};
			// activeRuleSet.data = [...dt, { ...action.payload }];
			let { note, expressions, yields, name, override = false } = action.payload;

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
				activeRuleSet.data.push({ note, expressions, yields, name, override });
			} else {
				activeRuleSet.data = [{ note, expressions, yields, name, override }];
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
			const {
				expression = {},
				yield: Yield = {},
				currentEditType,
				currentEditIndex,
				currentRuleIndex,
				note,
				override
			} = action.payload;
			const { name, operator, value, nullable } = expression;
			const { partner, weight } = Yield;

			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			if (currentEditType === 'expression') {
				if (
					activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[currentRuleIndex] &&
					activeRuleSet.data[currentRuleIndex] &&
					activeRuleSet.data[currentRuleIndex].expressions &&
					activeRuleSet.data[currentRuleIndex].expressions[currentEditIndex]
				) {
					activeRuleSet.data[currentRuleIndex].expressions[currentEditIndex] = {
						...activeRuleSet.data[currentRuleIndex].expressions[currentEditIndex],
						name: name || activeRuleSet.data[currentRuleIndex].expressions[currentEditIndex].name,
						operator:
							operator ||
							activeRuleSet.data[currentRuleIndex].expressions[currentEditIndex].operator,
						nullable,
						value: value || activeRuleSet.data[currentRuleIndex].expressions[currentEditIndex].value
					};
				}
			} else if (currentEditType === 'yield') {
				if (
					activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[currentRuleIndex] &&
					activeRuleSet.data[currentRuleIndex] &&
					activeRuleSet.data[currentRuleIndex].yields &&
					activeRuleSet.data[currentRuleIndex].yields[currentEditIndex]
				) {
					activeRuleSet.data[currentRuleIndex].yields[currentEditIndex] = {
						...activeRuleSet.data[currentRuleIndex].yields[currentEditIndex],
						weight: weight || activeRuleSet.data[currentRuleIndex].yields[currentEditIndex].weight,

						partner:
							partner || activeRuleSet.data[currentRuleIndex].yields[currentEditIndex].partner
					};
				}
			} else if (currentEditType === 'note') {
				if (
					activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[currentRuleIndex] &&
					activeRuleSet.data[currentRuleIndex] &&
					activeRuleSet.data[currentRuleIndex].note
				) {
					activeRuleSet.data[currentRuleIndex].note =
						note || activeRuleSet.data[currentRuleIndex].note;
				}
			} else if (currentEditType === 'override') {
				activeRuleSet.data[currentRuleIndex].override = override;
			}
			return {
				...state,
				updatedFlag: true,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}
		case ActionTypes.ADD_NEW_ITEM: {
			const { expression = {}, yield: Yield = {}, type, rulecaseIndex } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			const { name, operator, value, nullable } = expression;
			const { partner, weight } = Yield;

			if (type === 'expression') {
				activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex].expressions.push({ name, operator, value, nullable });
			} else if (type === 'yield') {
				activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex].yields.push({ partner, weight });
			}

			return {
				...state,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}
		case ActionTypes.REMOVE_DECISION: {
			const { decisionIndex, rulecaseIndex, type } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			if (type === 'expression') {
				activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex].expressions.splice(decisionIndex, 1);
			} else if (type === 'yield') {
				activeRuleSet &&
					activeRuleSet.data &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex] &&
					activeRuleSet.data[rulecaseIndex].yields.splice(decisionIndex, 1);
			}

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
		case ActionTypes.CHANGE_RULECASE_ORDER: {
			const { direction, rulecaseIndex } = action.payload;
			const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
			if (activeRuleSet.data) {
				if (direction === 'up') {
					const temp = activeRuleSet.data[rulecaseIndex];
					activeRuleSet.data[rulecaseIndex] = activeRuleSet.data[rulecaseIndex - 1];
					activeRuleSet.data[rulecaseIndex - 1] = temp;
				} else {
					const temp = activeRuleSet.data[rulecaseIndex];
					activeRuleSet.data[rulecaseIndex] = activeRuleSet.data[rulecaseIndex + 1];
					activeRuleSet.data[rulecaseIndex + 1] = temp;
				}
			}
			return {
				...state,
				rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
			};
		}
		default:
			return { ...state };
	}
}

export default ruleset;
