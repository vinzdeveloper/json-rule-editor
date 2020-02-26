import React, {useState} from 'react';
import PropTypes from 'prop-types';

const InputField = (props) => {
    const {label, onChange, error, value, required, readOnly} = props;
    const [fieldValue, setFieldValue] = useState(value);

    let errorClass = error ? 'error': undefined;
    let readOnlyClass = readOnly ? 'readOnly': undefined;

    const change = (e) => {
        setFieldValue(e.target.value);
        onChange(e);
        if (required && e.target.value) {
            errorClass = undefined;
        }
    }

    return (<div className="form-field">
        {label && <label>{label}</label>}
        <input type="text" onChange={change} value={fieldValue} className={`${errorClass} ${readOnlyClass}`} disabled={readOnly} />
    </div>);
};


InputField.defaultProps = {
    label: undefined,
    onChange: () => undefined,
    error: undefined,
    value: '',
    required: false,
    readOnly: false,
  };
  
  InputField.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
};


export default InputField;