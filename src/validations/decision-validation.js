
export const validateOutcome = (outcome) => {
    const error = {};

    if (!outcome.value) {
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

    if (!attribute.name) {
        error.name = 'Please specify the attribute name'
    }

    return error;
}

export default function decisionValidations(node={}, outcome) {
    const error = {node: {}, outcome: {}};
    error.outcome = validateOutcome(outcome);
    const validCase = node.children && node.children.length > 0;
    
    if (!validCase) {
        error.formError = 'Please specify atlease one condition';
    } else if (Object.keys(error.outcome).length > 0){
        error.formError = 'Please specify valid output values';
    }
    return error;
}