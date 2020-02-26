
export const validateAttribute = (attribute) => {
    const error = {};
    if (!attribute.name) {
        error.name = 'Please specify the attribute name'
    }

    if (!attribute.type) {
        error.type = 'Please specify the attribute type'
    }

    return error;
}

export default function attributeValidations(attribute) {
    return validateAttribute(attribute);
}
