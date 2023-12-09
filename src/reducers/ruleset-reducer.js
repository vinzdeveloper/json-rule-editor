import * as ActionTypes from '../actions/action-types';
 import { cloneDeep } from 'lodash/lang';
 import { findIndex } from 'lodash/array';

const initialState = {
    rulesets: [],
    activeRuleset: 0,
    updatedFlag: false,
    uploadedRules: [],
}


const replaceRulesetByIndex = (rulesets, targetset, index) => {
     return [ ...rulesets.slice(0, index), targetset, ...rulesets.slice(index + 1)];
}

const moveRuleUpByIndex = (rulesets, index) => {
    if (index <= 0 || index >= rulesets.length) {
        // If index is out of bounds (i.e., first element or beyond last element), return the original array
        return rulesets;
    }
    const newRulesets = [...rulesets]; // Create a copy of the array
    const temp = newRulesets[index]; // Temporarily store the current item
    newRulesets[index] = newRulesets[index - 1]; // Replace the current item with the previous item
    newRulesets[index - 1] = temp; // Replace the previous item with the current item (stored in temp)
    return newRulesets;
}

const moveRuleDownByIndex = (rulesets, index) => {
    if (index < 0 || index >= rulesets.length - 1) {
        // If index is out of bounds (i.e., last element or beyond first element), return the original array
        return rulesets;
    }
    const newRulesets = [...rulesets]; // Create a copy of the array
    const temp = newRulesets[index]; // Temporarily store the current item
    newRulesets[index] = newRulesets[index + 1]; // Replace the current item with the next item
    newRulesets[index + 1] = temp; // Replace the next item with the current item (stored in temp)
    return newRulesets;
}

function ruleset(state = initialState, action='') {

    switch(action.type) {

        case ActionTypes.UPLOAD_RULESET: {

            const { ruleset } = action.payload;
            const rulesets = state.rulesets.concat(ruleset);
             return { ...state, rulesets: cloneDeep(rulesets),  uploadedRules: cloneDeep(rulesets)}
        }

        case ActionTypes.ADD_RULESET: {

            const { name } = action.payload;
            const rulset = { name, attributes: [], decisions: []};
            const count = state.rulesets.length === 0 ? 0 : state.rulesets.length;
             return { ...state, rulesets: state.rulesets.concat(rulset),  activeRuleset: count}
        }

        case ActionTypes.UPDATE_RULESET_INDEX: {

            const { name } = action.payload;
            const index = findIndex(state.rulesets, { name });
             return { ...state, activeRuleset: index}
        }
        
        case ActionTypes.ADD_DECISION: {

           const { condition } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.decisions = activeRuleSet.decisions.concat(condition);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.UPDATE_DECISION: {
            const { condition, decisionIndex } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions[decisionIndex] = condition;
 
             return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
         }
        case ActionTypes.REMOVE_DECISION: {

            const { decisionIndex } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions.splice(decisionIndex, 1);
 
             return { ...state,
                     updatedFlag: true,
                     rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.REMOVE_DECISIONS: {

            const { outcome } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions = activeRuleSet.decisions.filter(decision => decision.event && decision.event.type !== outcome);
 
             return { ...state,
                     updatedFlag: true,
                     rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }


        case ActionTypes.ADD_ATTRIBUTE: {
           const { attribute } = action.payload;
           const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
           activeRuleSet.attributes.push(attribute);

            return { ...state,
                    updatedFlag: true,
                    rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }
            
        case ActionTypes.UPDATE_ATTRIBUTE: {
            const { attribute, index } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes.splice(index, 1, attribute);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.REMOVE_ATTRIBUTE: {

            const { index } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes.splice(index, 1);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.RESET_ATTRIBUTE: {
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            if(state.uploadedRules[state.activeRuleset] && state.uploadedRules[state.activeRuleset].attributes) {
                activeRuleSet.attributes = cloneDeep(state.uploadedRules[state.activeRuleset].attributes);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
            }
            return { ...state };
        }

        case ActionTypes.RESET_DECISION: {
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            if(state.uploadedRules[state.activeRuleset] && state.uploadedRules[state.activeRuleset].decisions) {
                activeRuleSet.decisions = cloneDeep(state.uploadedRules[state.activeRuleset].decisions);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
            }
            return { ...state };
        }

        case ActionTypes.MOVE_RULE_UP: {
            const { index } = action.payload;
            const rulesets = moveRuleUpByIndex(state.rulesets, index);
            return { ...state, rulesets: cloneDeep(rulesets),  uploadedRules: cloneDeep(rulesets)}
        }

        case ActionTypes.MOVE_RULE_DOWN: {
            const { index } = action.payload;
            const rulesets = moveRuleDownByIndex(state.rulesets, index);
            return { ...state, rulesets: cloneDeep(rulesets),  uploadedRules: cloneDeep(rulesets)}
        }
        
        default:
            return { ...state };
    }
}

export default ruleset;