import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const InputField = (props) => {
	const { label, onChange, value, readOnly } = props;
	const [fieldValue, setFieldValue] = useState(value);

	useEffect(() => {
		setFieldValue(value);
	}, [value]);

	const change = (e) => {
		setFieldValue(e.target.checked);
		onChange(e.target.checked);
		// if (required && e.target.value) {
		// 	errorClass = undefined;
		// }
	};

	return (
		<div className="form-field22" style={{ marginRight: 8 }}>
			{label && <label>{label}</label>}
			<input
				style={props.style && { ...props.style }}
				type="checkbox"
				checked={!!fieldValue}
				value={fieldValue}
				onChange={change}
				disabled={readOnly}
			/>
		</div>
	);
};

InputField.defaultProps = {
	label: undefined,
	onChange: () => undefined,
	error: undefined,
	value: '',
	required: false,
	readOnly: false,
	placeholder: ''
};

InputField.propTypes = {
	label: PropTypes.string,
	onChange: PropTypes.func,
	error: PropTypes.string,
	value: PropTypes.any,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	placeholder: PropTypes.string,
	type: PropTypes.string,
	style: PropTypes.object
};

export default InputField;
