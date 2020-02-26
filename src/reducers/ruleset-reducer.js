import * as ActionTypes from '../actions/action-types';
 import { cloneDeep } from 'lodash/lang';
import mockruleset from '../mock/ruleset1.json';

const initialState = {
    rulesets : cloneDeep(mockruleset),
    activeRuleset: 0,
}

const findDecisionByOutcome = (decisions, value) => {
    return decisions.find(decision => decision.outcome === value);
}

const replaceRulesetByIndex = (rulesets, targetset, index) => {
     //rulesets.splice(index, 1, targetset);
     return [ ...rulesets.slice(0, index), targetset, ...rulesets.slice(index + 1)];
}


/* const findAttribute = (attributes, index) => {
    return attributes.find(attr => attribute.name === attr.name && 
        attribute.type === attr.type);
}*/

/* const replaceAttributeByIndex = (attributes, targetset, index) => {
    return rulesets.splice(index, 1, targetset);
} */

function ruleset(state = initialState, action='') {

    switch(action.type) {
        
        case ActionTypes.ADD_DECISION: {

           const { decision } = action.payload;
           const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
           activeRuleSet.decisions.push(decision);

            return { ...state, 
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.UPDATE_DECISION: {

            const { decision, index } = action.payload;
            let decisions = [ ...state.rulesets[state.activeRuleset].decisions ];
            decisions[index] = decision;
            state.rulesets[state.activeRuleset].decisions = decisions;

            return { ...state };
        }
        case ActionTypes.REMOVE_DECISION: {

            const { index } = action.payload;
            let decisions = [ ...state.rulesets[state.activeRuleset].decisions ];
            decisions = decisions.splice(index,1);
            state.rulesets[state.activeRuleset].attributes = decisions;

            return { ...state };
        }
        case ActionTypes.ADD_ATTRIBUTE: {
           const { attribute } = action.payload;
           const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
           activeRuleSet.attributes.push(attribute);

            return { ...state, 
                    rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }
            
        case ActionTypes.UPDATE_ATTRIBUTE: {
            const { attribute, index } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes.splice(index, 1, attribute);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.REMOVE_ATTRIBUTE: {

            const { index } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes.splice(index, 1);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.RESET_ATTRIBUTE: {
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes = cloneDeep(mockruleset[state.activeRuleset].attributes);

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
                    rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.UPDATE_CASE: {
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
                     rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
         }

        default:
            return { ...state };
    }
}

export default ruleset;