
export const validateOutcome = (outcome) => {
    const error = {};

    if (!outcome.value) {
        error.value = 'Please specify the outcome value'
    }

    return error;
} 

const isEmpty = (val) => {
    if(!val) {
        return true;
    } else if (!val.trim()) {
        return true;
    }
    return false;
}

const fieldValidationByType = (value, type, operator) => {
    switch(type) {
        case 'string':
            return value.indexOf(',') === -1;
        case 'number': {
            const re = RegExp('[+-]?([0-9]*[.])?[0-9]+');
            if (re.test(value)) {
                return !(isNaN(Number(value)));
            } 
            return re.test(value);
        }
        case 'array': {
            if (operator === 'doesNotContain' || operator === 'contains') {
                return value.indexOf(',') === -1;
            } else {
                const arrValues = value.split(',');
                if (arrValues && arrValues.length > 0) {
                    return !arrValues.some(v => isEmpty(v))
                } else {
                    return false;
                }
            }
        }
        default:
            return true;
    }
}

export const validateAttribute = (attribute, attributes) => {
    const error = {};
    if (isEmpty(attribute.operator)) {
        error.operator = 'Please specify the operator type'
    }

    if (isEmpty(attribute.value)) {
        error.value = 'Please specify the attribute value'
    } else {
        if (attribute.name) {
            const attProps = attributes.find(att => att.name === attribute.name);
            if(attProps && attProps.type) {
                if (!fieldValidationByType(attribute.value, attProps.type, attribute.operator)) {
                    error.value = 'Please specify the valid attribute value' ;
                }
               
            }
        }
    }

    if (isEmpty(attribute.name)) {
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