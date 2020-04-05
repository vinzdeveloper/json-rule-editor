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
             return { ...state, rulesets: state.rulesets.concat(rulset),  activeRuleset: state.activeRuleset + 1}
        }

        case ActionTypes.UPDATE_RULESET_INDEX: {

            const { name } = action.payload;
            const index = findIndex(state.rulesets, { name });
             return { ...state, activeRuleset: index}
        }
        
        case ActionTypes.ADD_DECISION: {

           const { decision } = action.payload;
           const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
           activeRuleSet.decisions.push(decision);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.UPDATE_DECISION: {
            const { caseAttr, decisionIndex, caseIndex } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions[decisionIndex].cases[caseIndex] = caseAttr;
 
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

        case ActionTypes.ADD_CASE: {
           const { caseAttr, outcome } = action.payload;
           const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };

           const updatedDecisions = activeRuleSet.decisions.map(decision => {
               if (decision.outcome === outcome.value) {
                   decision.cases.push(caseAttr);
                   return decision;
               }
               return decision;
           });

           activeRuleSet.decisions = updatedDecisions;

            return { ...state,
                    updatedFlag: true,
                    rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.REMOVE_CASE: {
            const { caseIndex, decisionIndex } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions[decisionIndex].cases.splice(caseIndex, 1);
 
             return { ...state,
                     updatedFlag: true,
                     rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
         }

        default:
            return { ...state };
    }
}

export default ruleset;