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

const moveRuleUpByIndex = (activeRuleSet, ruleIndex) => {
    activeRuleSet.decisions.sort((a, b) => a.ruleIndex - b.ruleIndex);

    const decisions = activeRuleSet.decisions;
    const indexToMove = decisions.findIndex(decision => decision.ruleIndex === ruleIndex);

    if (indexToMove <= 0) {
        console.log(`in moveRuleUpByIndex, the ruleset is not changed because indexToMove: ${indexToMove} is out of bounds`);
        return activeRuleSet;
    }

    console.log(`in moveRuleUpByIndex, decisions before change: ${JSON.stringify(decisions)} `);

    // Swap ruleIndex of the current decision and the next decision
    const temp = decisions[indexToMove].ruleIndex;
    decisions[indexToMove].ruleIndex = decisions[indexToMove - 1].ruleIndex;
    decisions[indexToMove - 1].ruleIndex = temp;

    activeRuleSet.decisions.sort((a, b) => a.ruleIndex - b.ruleIndex);

    console.log(`in moveRuleUpByIndex, decisions: ${JSON.stringify(decisions)} `);

    return activeRuleSet;
}

const moveRuleDownByIndex = (activeRuleSet, ruleIndex) => {
    activeRuleSet.decisions.sort((a, b) => a.ruleIndex - b.ruleIndex);

    const decisions = activeRuleSet.decisions;
    const indexToMove = decisions.findIndex(decision => decision.ruleIndex === ruleIndex);

    if (indexToMove >= decisions.length - 1) {
        console.log(`in moveRuleDownByIndex, the ruleset is not changed because indexToMove: ${indexToMove} is out of bounds`);
        return activeRuleSet;
    }

    console.log(`in moveRuleDownByIndex, decisions before change: ${JSON.stringify(decisions)} `);

    // Swap ruleIndex of the current decision and the next decision
    const temp = decisions[indexToMove].ruleIndex;
    decisions[indexToMove].ruleIndex = decisions[indexToMove + 1].ruleIndex;
    decisions[indexToMove + 1].ruleIndex = temp;

    activeRuleSet.decisions.sort((a, b) => a.ruleIndex - b.ruleIndex);

    console.log(`in moveRuleDownByIndex, decisions: ${JSON.stringify(decisions)} `);

    return activeRuleSet;
}

const refreshIndex = (rulesets, activeRulesetIndex) => {
    // Sort decisions based on ruleIndex
    rulesets[activeRulesetIndex].decisions.sort((a, b) => a.ruleIndex - b.ruleIndex);
    // Update ruleIndex of remaining decisions
    rulesets[activeRulesetIndex].decisions.forEach((decision, index) => {
        decision.ruleIndex = index;
    });
}



const removeDecisionByIndex = (rulesets, activeRulesetIndex, decisionIndex) => {
    console.log(`in removeDecisionByIndex, decisionIndex: ${decisionIndex} `);
    console.log(`in removeDecisionByIndex, rulesets[${activeRulesetIndex}].decisions.decision.ruleIndex:  ${rulesets[activeRulesetIndex].decisions[0].ruleIndex}`);

    // Filter out the decision with the specified ruleIndex
    rulesets[activeRulesetIndex].decisions = rulesets[activeRulesetIndex].decisions.filter(decision => Number(decision.ruleIndex) != decisionIndex);

    // Call refreshIndex to update ruleIndex of remaining decisions
    refreshIndex(rulesets, activeRulesetIndex);
    console.log(`in removeDecisionByIndex, rulesets: ${JSON.stringify(rulesets)} `);
    return rulesets;
}

const removeDecisionsByOutcome = (rulesets, activeRulesetIndex, outcome) => {
    const newRulesets = [...rulesets]; // Create a copy of the array
    const activeRuleSet = { ...newRulesets[activeRulesetIndex] }; // Get the active rule set
    activeRuleSet.decisions = activeRuleSet.decisions.filter(decision => decision.event && decision.event.type !== outcome); // Remove decisions with the specified outcome
    newRulesets[activeRulesetIndex] = activeRuleSet; // Replace the active rule set in the new array
    return newRulesets;
}

function ruleset(state = initialState, action='') {

    console.log(`Ruleset in reducer: ${JSON.stringify(state.rulesets)}`)

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

            const { condition, metadata } = action.payload;
            const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
            const decision = { ...metadata, ...condition[0] };
            console.log(`in ActionTypes.ADD_DECISION, decision: ${JSON.stringify(decision)} `);
            activeRuleSet.decisions = activeRuleSet.decisions.concat(decision);
            console.log(`in ActionTypes.ADD_DECISION, activeRuleSet.decisions: ${JSON.stringify(activeRuleSet.decisions)} `);
            return {
                ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
            }
        }

        case ActionTypes.UPDATE_DECISION: {
            const { decision, ruleIndex } = action.payload;
            console.log(`in ActionTypes.UPDATE_DECISION, decision: ${JSON.stringify(decision)}, index: ${ruleIndex} `);
            const activeRuleSet = { ...state.rulesets[state.activeRuleset] };

            activeRuleSet.decisions = activeRuleSet.decisions.map(d => d.ruleIndex === ruleIndex ? decision : d);
            console.log(`in ActionTypes.UPDATE_DECISION, activeRuleSet.decisions: ${JSON.stringify(activeRuleSet.decisions)} `);
            return {
                ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
            }
        }

        case ActionTypes.UPDATE_RULE: {
            const rule = action.payload.rule;
            const { ruleIndex } = rule;
            console.log(`in ActionTypes.UPDATE_RULE, rule: ${JSON.stringify(rule)}, ruleIndex: ${ruleIndex} `);
            const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
            console.log(`in ActionTypes.UPDATE_RULE, activeRuleSet.decisions: ${JSON.stringify(activeRuleSet.decisions)} `);
            activeRuleSet.decisions = activeRuleSet.decisions.map(d => d.ruleIndex == ruleIndex ? rule : d);
            console.log(`in ActionTypes.UPDATE_RULE, new activeRuleSet.decisions: ${JSON.stringify(activeRuleSet.decisions)} `);
            return {
                ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)
            }
        }


        case ActionTypes.REMOVE_DECISION: {
            const { decisionIndex } = action.payload;
            const newRulesets = removeDecisionByIndex(state.rulesets, state.activeRuleset, decisionIndex);
            return {
                ...state,
                updatedFlag: true,
                rulesets: newRulesets
            }
        }

        case ActionTypes.REMOVE_DECISIONS: {
            const { outcome } = action.payload;
            const newRulesets = removeDecisionsByOutcome(state.rulesets, state.activeRuleset, outcome);
            return {
                ...state,
                updatedFlag: true,
                rulesets: newRulesets
            }
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
            const { ruleIndex } = action.payload;
            const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
            console.log(`in MOVE_RULE_UP, action.payload: ${JSON.stringify(action.payload)} `);
            const rulesets = moveRuleUpByIndex(activeRuleSet, ruleIndex);
            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, rulesets, state.activeRuleset)}
        }

        case ActionTypes.MOVE_RULE_DOWN: {
            const { ruleIndex } = action.payload;
            const activeRuleSet = { ...state.rulesets[state.activeRuleset] };
            console.log(`in MOVE_RULE_DOWN, action.payload: ${JSON.stringify(action.payload)} `);
            const rulesets = moveRuleDownByIndex(activeRuleSet, ruleIndex);
            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, rulesets, state.activeRuleset)}
        }
        
        default:
            return { ...state };
    }
}

export default ruleset;