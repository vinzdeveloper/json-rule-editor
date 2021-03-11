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
import Checkbox from '../forms/checkbox';

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
			note: '',
			override: false
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
		this.onChangeOverride = this.onChangeOverride.bind(this);
		this.onChangeNote = this.onChangeNote.bind(this);
		this.updateCondition = this.updateCondition.bind(this);
		this.resetCondition = this.resetCondition.bind(this);
		this.addExpression = this.addExpression.bind(this);
		this.addYield = this.addYield.bind(this);
		this.addNewItem = this.addNewItem.bind(this);
		this.onChangeNullable = this.onChangeNullable.bind(this);
	}
	addNewItem(type, rulecaseIndex) {
		const { expression, yield: Yield } = this.state;
		this.props.handleAddItem({ expression, yield: Yield, type, rulecaseIndex });

		this.setState({ expression: defaultExpression, yield: defaultYield });
	}

	onChangeNullable(value) {
		const expression = { ...this.state.expression };
		expression.nullable = value;
		this.setState({ expression });
	}

	cancel(type) {
		if (type === 'expression') {
			this.setState({
				showAddExpression: false,
				expression: defaultExpression
			});
		} else {
			this.setState({
				showAddYield: false,
				yield: defaultYield
			});
		}
	}

	addExpression() {
		this.setState({
			showAddExpression: true
		});
	}

	addYield() {
		this.setState({
			showAddYield: true
		});
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
		let error = {};

		if (name == 'weight') {
			if (isNaN(e.target.value)) {
				// console.log(typeof e.target.value);
				// yieldV[name] = parseFloat(e.target.value, 10);
				error.weight = 'Invalid decimal value';
			} else {
				if (parseFloat(e.target.value) > 1e-7) {
					yieldV[name] = e.target.value;
					error = {};
				} else if (parseFloat(e.target.value) > 0) {
					error.weight = "Entered value can't go beyond 6 decimal places";
					yieldV[name] = '';
				}
			}
			//  else {
			// error.weight = 'only numbers';
			// }
		} else {
			yieldV[name] = e.value;
			error = {};
		}
		this.setState({ yield: { ...yieldV, error } });
	}

	onChangeNote(e) {
		this.setState({ note: e.target.value });
	}

	onChangeOverride(checked, currentRuleIndex) {
		this.setState({ override: checked });
		this.props.updateCondition({
			currentEditType: 'override',
			override: checked,
			currentRuleIndex
		});
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
		const {
			note,
			expression,
			currentEditType,
			currentEditIndex,
			currentRuleIndex,
			override
		} = this.state;
		this.props.updateCondition({
			expression,
			yield: this.state.yield,
			currentEditIndex,
			currentRuleIndex,
			currentEditType,
			note,
			override
		});
		this.setState({
			currentEditIndex: -1,
			currentRuleIndex: -1,
			currentEditType: '',

			expression: defaultExpression
		});
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
		const currentExpression = this.state.expression;
		return (
			<SelectField
				options={FieldOptions[currentExpression.name || expression.name]}
				onChange={(e) => this.onChangeField(e, 'value')}
				value={expression.value}
				// error={expression && expression.error.value}
				label={null}
				placeholder={'Value'}
				isMulti
			/>
		);

		// if (
		// 	FieldOptions[currentExpression.name || expression.name] &&
		// 	FieldOptions[currentExpression.name || expression.name].length > 0
		// ) {
		// 	return (
		// 		<SelectField
		// 			options={FieldOptions[currentExpression.name || expression.name]}
		// 			onChange={(e) => this.onChangeField(e, 'value')}
		// 			value={expression.value}
		// 			// error={expression && expression.error.value}
		// 			label={null}
		// 			placeholder={'Value'}
		// 			isMulti
		// 		/>
		// 	);
		// } else {
		// 	return (
		// 		<InputField
		// 			onChange={(value) => this.onChangeField(value, 'value')}
		// 			value={expression && expression.value}
		// 			// error={expression.error.value}
		// 			label={null}
		// 			placeholder={'Value'}
		// 			// type={expression.operator === 'number' ? 'number' : 'text'}
		// 			// placeholder={PLACEHOLDER.number}
		// 		/>
		// 	);
		// }
	}
	renderConditions = (_, index) => {
		// const transformedData = transformRuleToTree(conditions);
		// eslint-disable-next-line no-unused-vars
		// const { data: { expressions = [], yields = [], note = '' } = {} } = this.props.ruleset;
		const { data: rulecases = [] } = this.props.ruleset;
		const { attributes = [] } = this.props;
		const attributeOptions = attributes.map((attr) => attr.name);

		const {
			currentEditIndex,
			showAddYield,
			showAddExpression,
			yield: currentYield,
			expression: currentExpression
		} = this.state;
		const { expressions = [], yields = [], note = '', override } = rulecases[index];

		// const attribute = expression.name && attributes.find((attr) => attr.name === expression.name);

		// const opertorOptions = attribute && operator[attribute.type];

		// const placeholder =
		// 	expression.operator === 'contains' || expression.operator === 'doesNotContain'
		// 		? PLACEHOLDER['string']
		// 		: PLACEHOLDER[attribute.type];
		const getOperators = (eName) => {
			const attribute = attributes.find((attr) => attr.name === eName);
			const opertorOptions = attribute && operator[attribute.fieldType || attribute.type];
			return opertorOptions;
		};
		const operatorsList = getOperators(this.state.expression.name);

		return (
			<div className="rule-flex-container">
				<div className="decision-box" key={`case - `}>
					{note && (
						<>
							<div className="add-field-panel">
								{this.state.currentEditType !== 'note' ? (
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div style={{ width: '80%' }}>
											<InputField
												// onChange={(value) => this.onChangeField(value, 'value')}
												value={note}
												// error={expression.error.value}
												label={'Note'}
												readOnly
												// placeholder={placeholder}
											/>
										</div>
										<div style={{ marginLeft: 'auto', marginRight: 45, marginTop: 12 }}>
											<a href="" onClick={(e) => this.editCondition(e, -1, index, 'note')}>
												<span className="fa fa-edit" />
											</a>
										</div>
									</div>
								) : (
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-starts',
											alignItems: 'center'
										}}
									>
										<div style={{ width: '80%' }}>
											<InputField
												onChange={this.onChangeNote}
												value={note}
												label="Note"
												placeholder="Note..."
											/>
										</div>
										<div style={{ marginTop: 6 }}>
											<Button
												label="Update"
												onConfirm={this.updateCondition}
												classname="primary-btn small-btn"
												// type="submit"
											/>
										</div>
										<div style={{ marginTop: 6 }}>
											<Button
												label="Cancel"
												onConfirm={this.resetCondition}
												classname="cancel-btn small-btn"
												// type="submit"
											/>
										</div>
									</div>
								)}
							</div>
						</>
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
												options={operatorsList || getOperators(expression.name)}
												onChange={(e) => this.onChangeField(e, 'operator')}
												value={expression.operator}
												// error={expression.error.operator}
												label={null}
												placeholder={'Operator'}
											/>
										</div>
										<div>{this.renderValueField({ expression, hideLabel: true })}</div>
										<div>
											<Checkbox
												onChange={(value) => this.onChangeNullable(value)}
												value={expression.nullable}
												label={'Nullable?'}
											/>
										</div>
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
												readOnly
												// placeholder={placeholder}
											/>
										</div>
										<div>
											<InputField
												// onChange={(value) => this.onChangeField(value, 'value')}
												value={expression.operator}
												// error={expression.error.operator}
												label={idx === 0 && 'Operator'}
												readOnly
												// placeholder={placeholder}
											/>
										</div>
										<div>
											{expression.value.includes(',') ? (
												<SelectField
													options={FieldOptions[currentExpression.name || expression.name]}
													onChange={(e) => this.onChangeField(e, 'value')}
													value={expression.value}
													// error={expression && expression.error.value}
													label={idx === 0 && 'Value'}
													placeholder={'Value'}
													isMulti
													readOnly
												/>
											) : (
												<InputField
													// onChange={(value) => this.onChangeField(value, 'value')}
													value={
														typeof expression.value !== 'undefined' && expression.value !== ''
															? expression.value
															: 'null'
													}
													// error={expression.error.value}
													label={idx === 0 && 'Value'}
													readOnly
													style={{ width: 500 }}
													// placeholder={placeholder}
												/>
											)}
										</div>
										<div style={{ marginLeft: 24 }}>
											<Checkbox
												// onChange={(value) => this.onChangeNullable(value)}
												value={expression.nullable}
												label={'Nullable?'}
												readOnly
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
						<div className="view-field-panel-row" style={{ alignItems: 'center' }}>
							{showAddExpression ? (
								<>
									<div className="field" key={`field-new`}>
										<SelectField
											options={attributeOptions}
											onChange={(e) => this.onChangeField(e, 'name')}
											value={currentExpression.name}
											// error={expression.error.name}
											label={null}
											placeholder={'Expression'}
										/>
									</div>
									<div>
										<SelectField
											options={getOperators(currentExpression.name)}
											onChange={(e) => this.onChangeField(e, 'operator')}
											value={currentExpression.operator}
											// error={expression.error.operator}
											label={null}
											placeholder={'Operator'}
										/>
									</div>
									<div>
										{this.renderValueField({ expression: currentExpression, hideLabel: true })}
									</div>
									<div>
										<Checkbox
											onChange={(value) => this.onChangeNullable(value)}
											value={currentExpression.nullable}
											label={'Nullable?'}
										/>
									</div>
									<Button
										label="Add Expression"
										onConfirm={() => this.addNewItem('expression', index)}
										classname="primary-btn small-btn"
										// type="submit"
									/>
									<Button
										label="Cancel"
										onConfirm={() => this.cancel('expression')}
										classname="cancel-btn small-btn"
										// type="submit"
									/>
								</>
							) : (
								<div className="view-field-panel-row" style={{ alignItems: 'center' }}>
									<Button
										label="Add Expression"
										onConfirm={() => this.addExpression()}
										classname="primary-btn small-btn"
										// type="submit"
									/>
								</div>
							)}
						</div>
					</div>
					<div className="add-field-panel">
						{yields.map((yld, idx) => (
							<div key={yld.name} className="view-field-panel-row" style={{ alignItems: 'center' }}>
								{currentEditIndex === idx && this.state.currentEditType === 'yield' ? (
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
												label={null}
												error={currentYield.error.weight}
												placeholder={PLACEHOLDER.number}
											/>
										</div>
										<Button
											label="Update"
											onConfirm={() => this.updateCondition()}
											classname="primary-btn small-btn"
											disabled={currentYield.error.weight}
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
						<div className="view-field-panel-row" style={{ alignItems: 'center' }}>
							{showAddYield ? (
								<>
									<div>
										<SelectField
											options={partnerOptions}
											onChange={(e) => this.onChangeYield(e, 'partner')}
											value={currentYield.partner}
											// error={currentYield.error.partner}
											label={null}
										/>
									</div>
									<div>
										<InputField
											onChange={(value) => this.onChangeYield(value, 'weight')}
											value={currentYield.weight}
											error={currentYield.error.weight}
											label={null}
											placeholder={PLACEHOLDER.number}
										/>
									</div>

									<Button
										label="Add Yield"
										onConfirm={() => this.addNewItem('yield', index)}
										classname="primary-btn small-btn"
										// type="submit"
									/>
									<Button
										label="Cancel"
										onConfirm={() => this.cancel('yield')}
										classname="cancel-btn small-btn"
										// type="submit"
									/>
								</>
							) : (
								<Button
									label="Add Yield"
									onConfirm={() => this.addYield()}
									classname="primary-btn small-btn"
									// type="submit"
								/>
							)}
						</div>
					</div>
					<div className="add-field-panel">
						<Checkbox
							onChange={(value) => this.onChangeOverride(value, index)}
							value={override}
							label="Override"
						/>
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
		const { data: rulecasesWithoutIndex = [] } = this.props.ruleset;
		const { searchCriteria = '' } = this.props;
		// { expressions = [], yields = [], note = '' }
		const outcomes = rulecasesWithoutIndex.map(({ note }) => note);
		const rulecases = rulecasesWithoutIndex.map((rulecase, index) => ({ ...rulecase, index }));

		const conditions = rulecases
			.filter(
				({ note = '', yields, expressions }) =>
					note.toLowerCase().includes(searchCriteria.toLowerCase()) ||
					yields
						.map(({ partner = '', weight = '' }) => `${partner}${weight}`)
						.join('')
						.toLowerCase()
						.includes(searchCriteria.toLowerCase()) ||
					expressions
						.map(({ value = '' }) => `${value}`)
						.join('')
						.toLowerCase()
						.includes(searchCriteria.toLowerCase())
			)
			.map(({ expressions, note, index }) => (
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
	handleAddItem: PropTypes.func,
	searchCriteria: PropTypes.string
};

export default DecisionDetails;
