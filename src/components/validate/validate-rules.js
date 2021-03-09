import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import Table from '../table/table';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { validateRuleset } from '../../validations/rule-validation';
import Loader from '../loader/loader';
import { ViewOutcomes } from '../attributes/view-attributes';
import FieldOptions from '../../constants/options.json';

const opMap = {
	equal: 'in',
	notEqual: 'notIn',
	not_in: 'notIn'
};
const revOpMap = {
	in: 'equal',
	not_in: 'notEqual'
};
const getActualOperator = ({ operator, value, nullable }) => {
	if ((value && value.includes(',')) || nullable) {
		const rt = opMap[operator] || operator;
		return rt;
	}
	const rt = revOpMap[operator] || operator;
	return rt;
};
class ValidateRules extends Component {
	constructor(props) {
		super(props);
		const conditions = this.props.conditions || [];
		this.state = {
			attributes: [],
			conditions,
			message: Message.NO_VALIDATION_MSG,
			loading: false,
			outcomes: [],
			error: false
		};
		// this.handleAttribute = this.handleAttribute.bind(this);
		// this.handleValue = this.handleValue.bind(this);
		// this.handleAdd = this.handleAdd.bind(this);
		this.validateRules = this.validateRules.bind(this);
	}

	// handleAttribute(e, index) {
	// 	const attribute = { ...this.props.conditions[index], name: e.value };
	// 	const conditions = [
	// 		...this.props.conditions.slice(0, index),
	// 		attribute,
	// 		...this.props.conditions.slice(index + 1)
	// 	];
	// 	this.setState({ conditions });
	// }

	// handleValue(e, index) {
	// 	let value;
	// 	if (Array.isArray(e)) {
	// 		value = e && e.map(({ value }) => value).join(',');
	// 	} else {
	// 		value = typeof e !== 'string' ? e.value : e;
	// 	}
	// 	const attribute = { ...this.props.conditions[index], value };
	// 	const conditions = [
	// 		...this.props.conditions.slice(0, index),
	// 		attribute,
	// 		...this.props.conditions.slice(index + 1)
	// 	];
	// 	this.setState({ conditions });
	// }

	// handleAdd() {
	// 	this.setState({ conditions: this.props.conditions.concat([{ name: '' }]) });
	// }

	validateRules(e) {
		e.preventDefault();
		let facts = {};
		// const { attributes } = this.props;
		// console.log('expressions', expressions);
		this.setState({ loading: true });
		this.props.conditions.forEach((condition) => {
			// const attrProps = attributes.find((attr) => attr.name === condition.name);
			// if (attrProps.type === 'number' && !isNaN(condition.value)) {
			// 	facts[condition.name] = Number(condition.value);
			// } else
			if (condition.value && condition.value.indexOf(',') > -1) {
				facts[condition.name] = condition.value.split(',');
			} else if (condition.value) {
				facts[condition.name] = condition.value;
			}
		});
		// const expressions2 = expressions.map(({ name: fact, operator, value }) => ({
		// 	fact,
		// 	operator,
		// 	value
		// }));
		const decisions = this.props.ruleset.data

			.filter(({ expressions }) => expressions.length > 0)
			.map(({ expressions, note }) => {
				return {
					conditions: {
						all: expressions.map(({ name: fact, operator, value, nullable }) => ({
							fact,
							operator: getActualOperator({ operator, value, nullable }),
							value: nullable
								? Array.isArray(value)
									? [...value, undefined]
									: [value, undefined]
								: value
						}))
					},
					event: { type: note }
				};
			});
		// conditionsBeforeParsing
		// console.log('conditionsBeforeParsing', conditionsBeforeParsing);
		// const decisions = [
		// 	{ conditions: { all: [...expressions2] }, event: { type: 'Valid' } }
		// 	// { conditions: { all: [...expressions2] }, event: { type: '2 isValid' } }
		// ];
		validateRuleset(facts, decisions)
			.then((outcomes) => {
				this.setState({ loading: false, outcomes, result: true, error: false, errorMessage: '' });
			})
			.catch((e) => {
				this.setState({ loading: false, error: true, errorMessage: e.error, result: true });
			});
	}

	attributeItems = () => {
		const { conditions, loading, outcomes, result, error, errorMessage } = this.state;
		const { attributes } = this.props;
		const options = attributes.map((att) => att.name);

		const formElements = conditions.map((condition, index) => (
			<tr key={condition.name + index || 'item' + index}>
				<td>
					<SelectField
						options={options}
						onChange={(e) => this.props.handleAttribute(e, index)}
						value={condition.name}
						readOnly
						width={200}
					/>
				</td>
				<td colSpan="4">
					{FieldOptions[condition.name] && FieldOptions[condition.name].length > 0 ? (
						<SelectField
							options={FieldOptions[condition.name]}
							onChange={(e) => this.props.handleValue(e, index)}
							value={condition.value}
							isMulti={
								condition.name !== 'color' &&
								condition.name !== 'double_sided' &&
								FieldOptions[condition.name].length !== 1
							}
							width={700}
						/>
					) : (
						<InputField
							onChange={(e) => this.props.handleValue(e.target.value, index)}
							value={condition.value}
						/>
					)}
				</td>
			</tr>
		));

		let message;
		if (result) {
			if (error) {
				message = (
					<div className="form-error">
						Problem occured when processing the rules. Reason is {errorMessage}
					</div>
				);
			} else if (outcomes && outcomes.length === 0) {
				message = (
					<div className="view-params-container">
						<h4>Outcomes (Valid Rulecases) </h4>
						<div>No matching rulesets found</div>
					</div>
				);
			} else if (outcomes && outcomes.length > 0) {
				message = (
					<div className="view-params-container">
						<h4>Outcomes (Valid Rulecases) </h4>
						<ViewOutcomes items={outcomes} />
					</div>
				);
			} else {
				message = undefined;
			}
		}
		return (
			<React.Fragment>
				<Table columns={['Name', 'Value']}>{formElements}</Table>
				<div className="btn-group">
					<Button
						label={'Validate Ruleset'}
						onConfirm={this.validateRules}
						classname="primary-btn"
						type="submit"
					/>
				</div>
				<hr />
				{loading && <Loader />}
				{!loading && message}
			</React.Fragment>
		);
	};

	render() {
		const { data = [] } = this.props.ruleset;
		return (
			<React.Fragment>
				{data.length < 1 && <Banner message={this.state.message} />}
				{data.length > 0 && (
					<Panel>
						<form>
							<div>{this.attributeItems()}</div>
						</form>
					</Panel>
				)}
			</React.Fragment>
		);
	}
}

ValidateRules.defaultProps = {
	attributes: [],
	decisions: []
};

ValidateRules.propTypes = {
	attributes: PropTypes.array,
	decisions: PropTypes.array,
	expressions: PropTypes.array,
	ruleset: PropTypes.array,
	conditions: PropTypes.array,
	handleAttribute: PropTypes.func,
	handleValue: PropTypes.func
};

export default ValidateRules;
