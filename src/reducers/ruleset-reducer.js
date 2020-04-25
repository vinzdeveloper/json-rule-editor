import * as ActionTypes from '../actions/action-types';
 import { cloneDeep } from 'lodash/lang';
 import { findIndex } from 'lodash/array';
import mockruleset from '../mock/ruleset1.json';

const initialState = {
    //rulesets : cloneDeep(mockruleset),
    rulesets: [],
    activeRuleset: 0,
    updatedFlag: false,
}


const replaceRulesetByIndex = (rulesets, targetset, index) => {
     return [ ...rulesets.slice(0, index), targetset, ...rulesets.slice(index + 1)];
}


function ruleset(state = initialState, action='') {

    switch(action.type) {

        case ActionTypes.UPLOAD_RULESET: {

            const { ruleset } = action.payload;
             return { ...state, rulesets: ruleset }
        }

        case ActionTypes.ADD_RULESET: {

            const { name } = action.payload;
            const rulset = { name, attributes: [], decisions: []};
            const count = state.rulesets.length === 0 ? 0 : state.activeRuleset + 1
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
            activeRuleSet.attributes = cloneDeep(mockruleset[state.activeRuleset].attributes);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.RESET_DECISION: {
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.decisions = cloneDeep(mockruleset[state.activeRuleset].decisions);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }


        default:
            return { ...state };
    }
}

export default ruleset;