import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import SelectField from '../forms/selectmenu-field';
import InputField from '../forms/input-field';

// import Tree from '../tree/tree';
import { PanelBox } from '../panel/panel';
import 'font-awesome/css/font-awesome.min.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import operator from '../../constants/operators.json';
import { PLACEHOLDER } from '../../constants/data-types';
import SelectField from '../forms/selectmenu-field';
import FieldOptions from '../../constants/options.json';
import partnerOptions from '../../constants/yeildTypes.json';
import Button from '../button/button';

const defaultExpression = { error: {}, name: '', operator: '', value: '' };
const defaultYield = { error: {}, partner: '', weight: '' };

class DecisionDetails extends Component {
	static getDerivedStateFromProps(props, state) {
		const { data: rulecases = [] } = props.ruleset;

		const outcomes = rulecases.map(({ note }) => note);

		// const outcomes = { note };

		if (Object.keys(outcomes).length !== state.showCase.length) {
			const showCase = Object.keys(outcomes).map((key, index) => {
				return { case: false, edit: false, index };
			});
			return { showCase };
		}
		return null;
	}

	constructor(props) {
		super(props);
		const { data: rulecases = [] } = props.ruleset;

		const outcomes = rulecases.map(({ note }) => note);

		const showCase = Object.keys(outcomes).map((key, index) => {
			return { case: false, edit: false, index };
		});

		this.state = {
			showCase,
			submitAlert: false,
			removeAlert: false,
			successAlert: false,
			removeDecisionAlert: false,
			selectedRuleCaseIndex: -1,
			expression: defaultExpression,
			yield: defaultYield,
			note: ''
		};
		this.handleExpand = this.handleExpand.bind(this);
		this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
		this.handleRemoveConditions = this.handleRemoveConditions.bind(this);
		this.editCondition = this.editCondition.bind(this);
		this.cancelAlert = this.cancelAlert.bind(this);
		this.removeCase = this.removeCase.bind(this);
		this.removeDecisions = this.removeDecisions.bind(this);
		this.changeRulecaseOrder = this.changeRulecaseOrder.bind(this);
		this.onChangeField = this.onChangeField.bind(this);
		this.onChangeYield = this.onChangeYield.bind(this);
		this.onChangeNote = this.onChangeNote.bind(this);
		this.updateCondition = this.updateCondition.bind(this);
		this.resetCondition = this.resetCondition.bind(this);
	}
	onChangeField(e, name) {
		const expression = { ...this.state.expression };
		if (Array.isArray(e)) {
			expression[name] = e && e.map(({ value }) => value).join(',');
		} else {
			if (name === 'name' || name === 'operator') {
				expression[name] = e.value;
			} else {
				expression[name] = e.target.value;
			}
		}
		this.setState({ expression });
	}
	// onChangeField(e, name) {}

	onChangeYield(e, name) {
		const yieldV = { ...this.state.yield };
		const error = {};

		if (name == 'weight') {
			if (!isNaN(e.target.value)) {
				yieldV[name] = parseFloat(e.target.value);
			} else {
				error.weight = 'only numbers';
			}
		} else {
			yieldV[name] = e.value;
		}

		this.setState({ yield: { ...yieldV, error } });
	}

	onChangeNote(e) {
		this.setState({ note: e.target.value });
		// this.props.addCondition({ note: e.target.value });
	}
	handleEdit(e, val) {
		e.preventDefault();
		this.setState({ showRuleIndex: val });
	}

	editCondition(e, decisionIndex, rulecaseIndex, type) {
		e.preventDefault();
		this.setState({
			currentEditIndex: decisionIndex,
			currentRuleIndex: rulecaseIndex,
			currentEditType: type
		});
		// this.props.editCondition(decisionIndex, rulecaseIndex);
	}
	updateCondition() {
		const { note, expression, currentEditType, currentEditIndex, currentRuleIndex } = this.state;
		this.props.updateCondition({
			expression,
			yield: this.state.yield,
			currentEditIndex,
			currentRuleIndex,
			currentEditType,
			note
		});
		this.setState({ currentEditIndex: -1, currentRuleIndex: -1, currentEditType: '' });
	}
	resetCondition() {
		this.setState({ currentEditIndex: -1, currentRuleIndex: -1, currentEditType: '' });
	}
	handleExpand(e, index) {
		e.preventDefault();
		const cases = [...this.state.showCase];

		let updateCase = cases[index];
		// if (!updateCase.case) {
		// 	this.setState({});
		// }
		updateCase = { ...updateCase, case: !updateCase.case };
		cases[index] = { ...updateCase };
		this.setState({ showCase: cases });
	}

	handleRemoveCondition(e, decisionIndex, rulecaseIndex, type) {
		e.preventDefault();
		this.setState({
			removeAlert: true,
			removeDecisionIndex: decisionIndex,
			removeRuleCaseIndex: rulecaseIndex,
			removeRuleCaseType: type
		});
	}

	handleRemoveConditions(e, index) {
		e.preventDefault();
		this.setState({ removeDecisionAlert: true, removeOutcome: index });
	}

	cancelAlert = () => {
		this.setState({ removeAlert: false, successAlert: false, removeDecisionAlert: false });
	};

	removeCase = () => {
		this.props.removeCase(
			this.state.removeDecisionIndex,
			this.state.removeRuleCaseIndex,
			this.state.removeRuleCaseType
		);
		this.setState({
			removeAlert: false,
			successAlert: true,
			successMsg: 'Selected condition is removed'
		});
	};

	removeDecisions = () => {
		this.props.removeDecisions(this.state.removeOutcome);
		this.setState({
			removeDecisionAlert: false,
			successAlert: true,
			successMsg: 'Selected conditions are removed',
			removeOutcome: ''
		});
	};

	removeCaseAlert = () => {
		return (
			<SweetAlert
				warning
				showCancel
				confirmBtnText="Yes, Remove it!"
				confirmBtnBsStyle="danger"
				title="Are you sure?"
				onConfirm={this.removeCase}
				onCancel={this.cancelAlert}
				focusCancelBtn
			>
				You will not be able to recover the changes!
			</SweetAlert>
		);
	};

	removeDecisionAlert = () => {
		return (
			<SweetAlert
				warning
				showCancel
				confirmBtnText="Yes, Remove it!"
				confirmBtnBsStyle="danger"
				title="Are you sure?"
				onConfirm={this.removeDecisions}
				onCancel={this.cancelAlert}
				focusCancelBtn
			>
				You will not be able to recover the changes!
			</SweetAlert>
		);
	};

	successAlert = () => {
		return (
			<SweetAlert success title={this.state.successMsg} onConfirm={this.cancelAlert}></SweetAlert>
		);
	};

	alert = () => {
		return (
			<div>
				{this.state.removeAlert && this.removeCaseAlert()}
				{this.state.removeDecisionAlert && this.removeDecisionAlert()}
				{this.state.successAlert && this.successAlert()}
			</div>
		);
	};

	changeRulecaseOrder(e, payload) {
		e.preventDefault();
		this.props.changeRulecaseOrder(payload);
	}
	renderValueField({ expression }) {
		if (FieldOptions[expression.name] && FieldOptions[expression.name].length > 0) {
			return (
				<SelectField
					options={FieldOptions[expression.name]}
					onChange={(e) => this.onChangeField(e, 'value')}
					value={expression.value}
					// error={expression && expression.error.value}
					label={null}
					placeholder={'Value'}
					isMulti
				/>
			);
		} else {
			return (
				<InputField
					onChange={(value) => this.onChangeField(value, 'value')}
					value={expression.value}
					// error={expression.error.value}
					label={null}
					placeholder={'Value'}
					type={expression.operator === 'number' ? 'number' : 'text'}
					// placeholder={PLACEHOLDER.number}
				/>
			);
		}
	}
	renderConditions = (_, index) => {
		// const transformedData = transformRuleToTree(conditions);
		// eslint-disable-next-line no-unused-vars
		// const { data: { expressions = [], yields = [], note = '' } = {} } = this.props.ruleset;
		const { data: rulecases = [] } = this.props.ruleset;
		const { attributes = [] } = this.props;
		const attributeOptions = attributes.map((attr) => attr.name);

		const { currentEditIndex } = this.state;
		const { expressions = [], yields = [], note = '' } = rulecases[index];

		// const attribute = expression.name && attributes.find((attr) => attr.name === expression.name);

		// const opertorOptions = attribute && operator[attribute.type];

		// const placeholder =
		// 	expression.operator === 'contains' || expression.operator === 'doesNotContain'
		// 		? PLACEHOLDER['string']
		// 		: PLACEHOLDER[attribute.type];
		const getOperators = (eName) => {
			const attribute = attributes.find((attr) => attr.name === eName);
			const opertorOptions = attribute && operator[attribute.type];
			return opertorOptions;
		};

		return (
			<div className="rule-flex-container">
				<div className="decision-box" key={`case - `}>
					{note && (
						<div className="add-field-panel">
							<label>Note: </label>
							{note}
						</div>
					)}
					<div className="add-field-panel">
						{expressions.map((expression, idx) => (
							<div
								key={`${expression.name}${expression.value}`}
								className="view-field-panel-row"
								style={{ alignItems: 'center', paddingTop: 8 }}
							>
								{currentEditIndex === idx && this.state.currentEditType === 'expression' ? (
									<>
										<div className="field" key={`field${expression.name}${expression.value}`}>
											<SelectField
												options={attributeOptions}
												onChange={(e) => this.onChangeField(e, 'name')}
												value={expression.name}
												// error={expression.error.name}
												label={null}
												placeholder={'Expression'}
											/>
										</div>
										<div>
											<SelectField
												options={getOperators(expression.name)}
												onChange={(e) => this.onChangeField(e, 'operator')}
												value={expression.operator}
												// error={expression.error.operator}
												label={null}
												placeholder={'Operator'}
											/>
										</div>
										<div>{this.renderValueField({ expression, hideLabel: true })}</div>
										<Button
											label="Update"
											onConfirm={() => this.updateCondition('expression')}
											classname="primary-btn small-btn"
											// type="submit"
										/>
										<Button
											label="Cancel"
											onConfirm={this.resetCondition}
											classname="cancel-btn small-btn"
											// type="submit"
										/>
									</>
								) : (
									<>
										<div className="field">
											<InputField
												// onChange={(value) => this.onChangeField(value, 'value')}
												value={expression.name}
												// error={expression.error.value}
												label={idx === 0 && 'Expressions'}
												readOnly={currentEditIndex !== idx}
												// placeholder={placeholder}
											/>
										</div>
										<div>
											<InputField
												// onChange={(value) => this.onChangeField(value, 'value')}
												value={expression.operator}
												// error={expression.error.operator}
												label={idx === 0 && 'Operator'}
												readOnly={currentEditIndex !== idx}
												// placeholder={placeholder}
											/>
										</div>
										<div>
											<InputField
												// onChange={(value) => this.onChangeField(value, 'value')}
												value={
													typeof expression.value !== 'undefined' && expression.value !== ''
														? expression.value
														: 'null'
												}
												// error={expression.error.value}
												label={idx === 0 && 'Value'}
												readOnly={currentEditIndex !== idx}
												style={{ width: 500 }}
												// placeholder={placeholder}
											/>
										</div>
									</>
								)}
								<div className="tool-flex" key={`tool-flex${expression.name}${expression.value}`}>
									<div>
										{/* {currentEditIndex !== idx && this.state.currentEditType !== 'expression' && ( */}
										<a href="" onClick={(e) => this.editCondition(e, idx, index, 'expression')}>
											<span className="fa fa-edit" />
										</a>
										{/* )} */}
									</div>

									<div>
										<a
											href=""
											onClick={(e) => this.handleRemoveCondition(e, idx, index, 'expression')}
										>
											<span className="fa fa-trash-o" />
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="add-field-panel">
						{yields.map((yld, idx) => (
							<div key={yld.name} className="view-field-panel-row" style={{ alignItems: 'center' }}>
								{currentEditIndex !== idx && this.state.currentEditType !== 'yield' ? (
									<>
										<div className="field">
											<InputField
												value={yld.partner}
												// error={yld.error.value}
												label={idx === 0 && 'Yields'}
												readOnly
												// placeholder={placeholder}
											/>
										</div>
										<div>
											<InputField
												// onChange={(value) => this.onChangeField(value, 'value')}
												value={
													typeof yld.weight !== 'undefined' &&
													yld.weight !== '' &&
													!isNaN(yld.weight)
														? yld.weight
														: 'null'
												}
												// error={expression.error.value}
												label={idx === 0 && 'Weight'}
												readOnly
												// placeholder={placeholder}
											/>
										</div>
									</>
								) : (
									<>
										<div>
											<SelectField
												options={partnerOptions}
												onChange={(e) => this.onChangeYield(e, 'partner')}
												value={yld.partner}
												// error={yld.error.partner}
												label={null}
											/>
										</div>
										<div>
											<InputField
												onChange={(value) => this.onChangeYield(value, 'weight')}
												value={yld.weight}
												// error={yld.error.weight}
												label={null}
												placeholder={PLACEHOLDER.number}
											/>
										</div>
										<Button
											label="Update"
											onConfirm={() => this.updateCondition()}
											classname="primary-btn small-btn"
											// type="submit"
										/>
										<Button
											label="Cancel"
											onConfirm={this.resetCondition}
											classname="cancel-btn small-btn"
											// type="submit"
										/>
									</>
								)}

								<div className="tool-flex">
									<div>
										{currentEditIndex !== idx && this.state.currentEditType !== 'yield' && (
											<a href="" onClick={(e) => this.editCondition(e, idx, index, 'yield')}>
												<span className="fa fa-edit" />
											</a>
										)}
									</div>

									<div>
										<a href="" onClick={(e) => this.handleRemoveCondition(e, idx, index, 'yield')}>
											<span className="fa fa-trash-o" />
										</a>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* <Tree treeData={data.node} count={data.depthCount} /> */}
					{/* {data.event.params && (
								<div className="view-params-container">
									<h4>Params </h4>
									<ViewAttribute items={data.event.params} />
								</div>
							)} */}
				</div>
				{
					// transformedData &&
					// 	transformedData.map((data, caseIndex) => (
					// 		<div className="decision-box" key={`case - ${caseIndex} `}>
					// 			<div className="tool-flex">
					// 				<div>
					// 					<a href="" onClick={(e) => this.editCondition(e, data.index)}>
					// 						<span className="fa fa-edit" />
					// 					</a>
					// 				</div>
					// 				<div>
					// 					<a href="" onClick={(e) => this.handleRemoveCondition(e, data.index)}>
					// 						<span className="fa fa-trash-o" />
					// 					</a>
					// 				</div>
					// 			</div>
					// 			{/* <Tree treeData={data.node} count={data.depthCount} /> */}
					// 			{data.event.params && (
					// 				<div className="view-params-container">
					// 					<h4>Params </h4>
					// 					<ViewAttribute items={data.event.params} />
					// 				</div>
					// 			)}
					// 		</div>
					// 	))
				}
			</div>
		);
	};
	// const { data: [{ expressions = [], yields = [] }] = [{}] } = this.props.ruleset;
	// console.log('expressions', expressions);
	// return (
	//     <div className="rule-flex-container">
	//         sdf
	//         {expressions &&
	//             expressions.map((data, caseIndex) => (
	//                 <div className="decision-box" key={`case - ${caseIndex} `}>
	//                     <div className="tool-flex">
	//                         <div>
	//                             <a href="" onClick={(e) => this.editCondition(e, data.index)}>
	//                                 <span className="fa fa-edit" />
	//                             </a>
	//                         </div>
	//                         <div>
	//                             <a href="" onClick={(e) => this.handleRemoveCondition(e, data.index)}>
	//                                 <span className="fa fa-trash-o" />
	//                             </a>
	//                         </div>
	//                     </div>
	//                 </div>
	//             ))}
	//     </div>
	// );
	render() {
		// const { outcomes } = this.props;
		const { showCase } = this.state;
		// eslint-disable-next-line no-unused-vars
		const { data: rulecases = [] } = this.props.ruleset;
		const { searchCriteria = '' } = this.props;
		// { expressions = [], yields = [], note = '' }
		const outcomes = rulecases.map(({ note }) => note);

		const conditions = rulecases
			.filter(
				({ note = '', yields }) =>
					note.toLowerCase().includes(searchCriteria.toLowerCase()) ||
					yields
						.map(({ partner = '', weight = '' }) => `${partner}${weight}`)
						.join('')
						.toLowerCase()
						.includes(searchCriteria.toLowerCase())
			)
			.map(({ expressions, note }, index) => (
				<div key={note}>
					<PanelBox className={'boolean'} key={`PanelBox-${note}`}>
						<div style={{ width: 60 }}>
							{index !== 0 && (
								<a
									style={{ marginRight: 14 }}
									href=""
									onClick={(e) =>
										this.changeRulecaseOrder(e, { direction: 'up', rulecaseIndex: index })
									}
								>
									<span className="fa fa-arrow-up" />
								</a>
							)}
							{index !== rulecases.length - 1 && (
								<a
									style={{ marginRight: 0 }}
									href=""
									onClick={(e) =>
										this.changeRulecaseOrder(e, { direction: 'down', rulecaseIndex: index })
									}
								>
									<span className="fa fa-arrow-down" />
								</a>
							)}
						</div>
						<div className="index">{index + 1}</div>
						<div className="name">{String(note)}</div>
						<div className="type">
							conditions <span className="type-badge">{expressions.length}</span>
						</div>
						<div className="menu">
							<a href="" onClick={(e) => this.handleExpand(e, index)}>
								{showCase[index].case ? 'Collapse' : 'View Conditions'}
							</a>
							<a href="" onClick={(e) => this.handleRemoveConditions(e, /*String(note)*/ index)}>
								Remove
							</a>
						</div>
					</PanelBox>

					{showCase[index].case && this.renderConditions(outcomes[note], index)}
				</div>
			));

		return (
			<div className="">
				{this.alert()}
				{/* {this.renderConditions()} */}
				{conditions}
			</div>
		);
	}
}

DecisionDetails.defaultProps = {
	decisions: [],
	editCondition: () => false,
	removeCase: () => false,
	removeDecisions: () => false,
	outcomes: {}
};

DecisionDetails.propTypes = {
	decisions: PropTypes.array,
	editCondition: PropTypes.func,
	removeCase: PropTypes.func,
	removeDecisions: PropTypes.func,
	outcomes: PropTypes.object,
	ruleset: PropTypes.object,
	changeRulecaseOrder: PropTypes.func,
	attributes: PropTypes.array,
	updateCondition: PropTypes.func,
	searchCriteria: PropTypes.string
};

export default DecisionDetails;
