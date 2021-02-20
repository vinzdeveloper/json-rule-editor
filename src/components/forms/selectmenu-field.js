import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const SelectField = ({
	isMulti = false,
	label,
	onChange,
	error,
	required,
	options,
	value,
	readOnly
}) => {
	const [fieldValue, setFieldValue] = useState(null);
	let errorClass = error ? 'error' : undefined;
	let readOnlyClass = readOnly ? 'readOnly' : undefined;

	useEffect(() => {
		setFieldValue(value);
	}, [value]);
	const change = (e) => {
		setFieldValue(e.value);

		onChange(e);
		if (required && e.value) {
			errorClass = undefined;
		}
	};
	const actualValue =
		fieldValue && fieldValue.includes(',')
			? fieldValue.split(',').map((f) => ({ label: f, value: f }))
			: fieldValue && { label: fieldValue, value: fieldValue };
	return (
		<div className="form-field">
			{label && <label>{label}</label>}

			<Select
				options={options && options.map((op) => ({ label: op, value: op }))}
				isClearable
				onChange={change}
				className={`form-field-drpdwn ${errorClass} ${readOnlyClass}`}
				value={fieldValue && actualValue}
				isDisabled={readOnly}
				isMulti={isMulti}
			/>
		</div>
	);
	// return (
	// 	<div className="form-field">
	// 		{label && <label>{label}</label>}
	// 		<select
	// 			onChange={change}
	// 			className={`form-field-drpdwn ${errorClass} ${readOnlyClass}`}
	// 			value={fieldValue}
	// 			disabled={readOnly}
	// 		>
	// 			<option value="-1">Please select...</option>
	// 			{options.length > 0 &&
	// 				options.map((option) => (
	// 					<option key={option} value={option}>
	// 						{option}
	// 					</option>
	// 				))}
	// 		</select>
	// 	</div>
	// );
};

SelectField.defaultProps = {
	label: undefined,
	onChange: () => undefined,
	error: undefined,
	required: false,
	options: [],
	value: '',
	readOnly: false
};

SelectField.propTypes = {
	label: PropTypes.string,
	onChange: PropTypes.func,
	error: PropTypes.string,
	required: PropTypes.bool,
	options: PropTypes.array,
	value: PropTypes.string,
	readOnly: PropTypes.bool,
	isMulti: PropTypes.bool
};

export default SelectField;
