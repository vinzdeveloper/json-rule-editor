/* eslint-disable no-unused-vars */
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
	const customStyles = {
		placeholder: () => ({
			padding: 10,
			fontSize: 16,
			color: '#2a3f54'
		}),
		control: (provided) => ({
			...provided,
			width: `400px`,
			height: '100%',
			cursor: 'pointer',
			backgroundColor: '#fff',
			fontSize: '16px',
			marginTop: 5
		}),
		option: (provided, state) => ({
			...provided,
			// color: colors.white,
			'&:hover': {
				// background: colors.offBlack
			},
			cursor: 'pointer',

			background: state.isSelected ? '#4574c3' : state.isFocused ? '#d1e2ff' : '#fff',
			color: state.isSelected ? '#fff' : state.isFocused ? '#2a3f54' : '#2a3f54',

			padding: 10
		}),
		singleValue: (provided) => ({
			...provided,
			color: '#2a3f54'
		}),
		input: (provided) => ({
			...provided,
			color: '#2a3f54'
		}),
		menuList: () => ({
			position: 'absolute',
			width: `400px`,
			maxHeight: '300px',
			overflowY: 'auto',
			borderRadius: '5px',
			border: `2px solid #2a3f54`
		}),
		indicatorsContainer: () => ({
			position: 'relative',
			top: '-2px',
			display: 'flex'
		}),
		multiValue: (provided) => ({
			...provided
			// background: colors.greenMain
		}),
		multiValueLabel: (provided) => ({
			...provided,
			color: '#2a3f54'
		}),
		multiValueRemove: (provided) => ({
			...provided,
			color: '#2a3f54',

			'&:hover': {
				background: '#fff'
				// color: colors.greenMain
			}
		})
	};
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
		<div style={{ marginTop: 5, marginRight: 8 }}>
			{label && <label>{label}</label>}

			<Select
				options={options && options.map((op) => ({ label: op, value: op }))}
				isClearable
				onChange={change}
				// className={`form-field-drpdwn ${errorClass} ${readOnlyClass}`}
				value={fieldValue && actualValue}
				isDisabled={readOnly}
				isMulti={isMulti}
				styles={customStyles}
				placeholder={label}
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
