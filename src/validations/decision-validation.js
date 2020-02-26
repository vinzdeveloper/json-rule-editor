import {DATA_TYPES} from '../constants/data-types';

export const validateOutcome = (outcome) => {
    const error = {};
    if (!outcome.type) {
        error.type = 'Please specify the outcome type'
    }

    if (!outcome.value) {
        error.value = 'Please specify the outcome value'
    }

    if (outcome.type === DATA_TYPES.BOOLEAN && outcome.value === '-1') {
        error.value = 'Please specify the outcome value'
    }

    return error;
}

export const validateAttribute = (attribute) => {
    const error = {};
    if (!attribute.operator) {
        error.operator = 'Please specify the operator type'
    }

    if (!attribute.value) {
        error.value = 'Please specify the attribute value'
    }

    return error;
}

export default function decisionValidations(attributes=[], outcome) {
    const error = {attributes: [], outcome: {}};
    const validCase = attributes.some(attr => attr.operator !== 'any');
    error.outcome = validateOutcome(outcome);

    if (!validCase) {
        return ({formError: 'Please specify atlease one attribute'});
    }
    
    attributes.forEach(attribute => {
        if (attribute.operator != 'any') {
            const err = validateAttribute(attribute);
            if (Object.keys(err).length > 0) {
                error.attributes.push({ ...err, name: attribute.name });
            }
        }
    });

    return error;
}