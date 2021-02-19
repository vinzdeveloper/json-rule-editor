/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import ButtonGroup from '../button/button-groups';
import operator from '../../constants/operators.json';
import partnerOptions from '../../constants/yeildTypes.json';

import { rulesetValidation } from '../../validations/decision-validation';
import Tree from '../tree/tree';
import { has } from 'lodash/object';
import { getNodeDepthDetails, getNodeDepth } from '../../utils/treeutils';
// import { transformTreeToRule } from '../../utils/transform';
import { sortBy } from 'lodash/collection';
import { validateAttribute } from '../../validations/decision-validation';
import { PLACEHOLDER } from '../../constants/data-types';

const nodeStyle = {
	shape: 'circle',
	shapeProps: {
		fill: '#4574c3',
		r: 10
	}
};

const factsButton = [
	{ label: 'Add Fields', disable: false },
	{ label: 'Add All', disable: false },
	{ label: 'Add Any', disable: false },
	{ label: 'Remove', disable: false }
];

const topLevelOptions = [
	{ label: 'All', active: false, disable: false },
	{ label: 'Any', active: false, disable: false }
];

const outcomeOptions = [
	{ label: 'Add Outcome', active: false, disable: false },
	{ label: 'Edit Conditions', active: false, disable: false }
];
const defaultExpression = { error: {}, name: '', operator: '', value: '' };
const defaultYield = { error: {}, partner: '', weight: '' };

class AddDecision extends Component {
	constructor(props) {
		super(props);

		const outcome = props.editDecision ? props.outcome : { value: '', error: {}, params: [] };
		const addAttribute = { error: {}, name: '', operator: '', value: '' };
		const node = props.editDecision
			? props.editCondition.node
			: { name: 'all', nodeSvgShape: nodeStyle, children: [] };
		const activeNode = { index: 0, depth: 0 };
		// const node = ;

		this.state = {
			note: '',
			attributes: props.attributes,
			expression: defaultExpression,
			yield: defaultYield,
			expressions: [],
			yields: [],
			outcome,
			addAttribute,
			enableTreeView: true,
			enableFieldView: true,
			enableOutcomeView: false,
			node,
			topLevelOptions,
			factsButton: factsButton.map((f) => ({ ...f, disable: true })),
			outcomeOptions: outcomeOptions.map((f) => ({ ...f, disable: true })),
			formError: '',
			addPathflag: false,
			activeNodeDepth: [activeNode]
		};
		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onChangeField = this.onChangeField.bind(this);
		this.onEditField = this.onEditField.bind(this);
		this.onChangeYield = this.onChangeYield.bind(this);
		this.onEditYield = this.onEditYield.bind(this);

		this.onChangeYield = this.onChangeYield.bind(this);
		this.onChangeNote = this.onChangeNote.bind(this);
		this.onChangeOutcomeValue = this.onChangeOutcomeValue.bind(this);
		this.handleTopNode = this.handleTopNode.bind(this);
		this.handleActiveNode = this.handleActiveNode.bind(this);
		this.handleChildrenNode = this.handleChildrenNode.bind(this);

		this.handleAddRule = this.handleAddRule.bind(this);
		this.handleAddYield = this.handleAddYield.bind(this);

		this.handleFieldCancel = this.handleFieldCancel.bind(this);
		this.handleOutputPanel = this.handleOutputPanel.bind(this);
		this.handleOutputParams = this.handleOutputParams.bind(this);
		this.addParams = this.addParams.bind(this);
		this.addPath = this.addPath.bind(this);
	}

	handleAdd(e) {
		e.preventDefault();
		const { expressions, yields, note } = this.state;
		const error = rulesetValidation({ expressions, yields });

		if (error.formError) {
			this.setState({
				formError: error.formError
			});
		}
		this.props.addCondition({ expressions, yields, note });
		this.props.cancel();

		// else {
		// 	let outcomeParams = {};
		// 	this.state.outcome.params.forEach((param) => {
		// 		outcomeParams[param.pkey] = param.pvalue;
		// 	});
		// 	const condition = transformTreeToRule(this.state.node, this.state.outcome, outcomeParams);
		// 	this.props.addCondition(condition);
		// }
	}

	handleCancel() {
		this.props.cancel();
	}
	onEditField(e, name, index) {
		const expressions = [...this.state.expressions];
		expressions[index][name] = e.target.value;
		this.setState({ expressions });
	}
	onChangeField(e, name) {
		const expression = { ...this.state.expression };

		expression[name] = e.target.value;
		this.setState({ expression });
	}
	// onChangeField(e, name) {}
	onEditYield(e, name, index) {
		const yields = [...this.state.yields];
		yields[index][name] = e.target.value;
		this.setState({ yields });
	}
	onChangeYield(e, name) {
		const yieldV = { ...this.state.yield };

		yieldV[name] = e.target.value;
		this.setState({ yield: yieldV });
	}

	onChangeNote(e) {
		this.setState({ note: e.target.value });
		this.props.addCondition({ note: e.target.value });
	}

	onChangeOutcomeValue(e, type) {
		const outcome = { ...this.state.outcome };
		outcome[type] = e.target.value;
		this.setState({ outcome });
	}

	addParams() {
		const { outcome } = this.state;
		const newParams = outcome.params.concat({ pkey: '', pvalue: '' });
		this.setState({ outcome: { ...outcome, params: newParams } });
	}

	addPath() {
		this.setState({ addPathflag: true });
	}

	handleOutputParams(e, type, index) {
		const { outcome } = this.state;
		const params = [...outcome.params];
		const newParams = params.map((param, ind) => {
			if (index === ind) {
				if (type === 'pkey') {
					return { ...param, pkey: e.target.value };
				} else {
					return { ...param, pvalue: e.target.value };
				}
			}
			return param;
		});
		this.setState({ outcome: { ...outcome, params: newParams } });
	}

	handleTopNode(value) {
		let parentNode = { ...this.state.node };
		const activeNode = { index: 0, depth: 0 };
		if (has(parentNode, 'name')) {
			parentNode.name = value === 'All' ? 'all' : 'any';
		} else {
			parentNode = { name: value === 'All' ? 'all' : 'any', nodeSvgShape: nodeStyle, children: [] };
		}
		const topLevelOptions = this.state.topLevelOptions.map((option) => {
			if (option.label === value) {
				return { ...option, active: true };
			}
			return { ...option, active: false };
		});

		const factsButton = this.state.factsButton.map((button) => ({ ...button, disable: false }));
		const outcomeOptions = this.state.outcomeOptions.map((button) => ({
			...button,
			disable: false
		}));

		this.setState({
			enableTreeView: true,
			topNodeName: value,
			node: parentNode,
			activeNodeDepth: [activeNode],
			topLevelOptions,
			factsButton,
			outcomeOptions
		});
	}

	mapNodeName(val) {
		const node = {};
		const {
			addAttribute: { name, operator, value, path },
			attributes
		} = this.state;
		if (val === 'Add All' || val === 'Add Any') {
			node['name'] = val === 'Add All' ? 'all' : 'any';
			node['nodeSvgShape'] = nodeStyle;
			node['children'] = [];
		} else {
			node['name'] = name;
			let factValue = value.trim();
			const attProps = attributes.find((att) => att.name === name);
			if (attProps.type === 'number') {
				factValue = Number(value.trim());
			}
			let fact = { [operator]: factValue };
			if (path) {
				fact['path'] = `.${path}`;
			}
			node['attributes'] = { ...fact };
		}
		return node;
	}
	handleAddYield() {
		const ys = Array.from(this.state.yields);
		const { partner, weight } = this.state.yield;
		ys.push({ partner, weight });
		this.setState(
			{
				yields: ys
			},
			() => {
				this.setState({
					yield: defaultYield
				});
			}
		);
		// const { error: _, ...Yield } = this.state.yield;
		// this.props.addCondition({ yields: [{ ...Yield }] });
	}

	handleAddRule() {
		const { attributes } = this.state;

		const error = validateAttribute(this.state.expression, attributes);
		if (Object.keys(error).length > 0) {
			let expression = this.state.expression;
			expression.error = error;
			this.setState({ expression });
			return undefined;
		}

		const exprs = Array.from(this.state.expressions);
		const { operator, value, name } = this.state.expression;
		exprs.push({ operator, value, name });
		this.setState({
			expressions: exprs,
			expression: defaultExpression
		});
		const { error: _, ...expression } = this.state.expression;
		// this.props.addCondition({ expressions: [{ ...expression }] });
	}
	handleChildrenNode(value) {
		let factOptions = [...factsButton];
		if (value === 'Add Fields') {
			this.setState({ enableFieldView: true });
		} else {
			const { activeNodeDepth, node, attributes } = this.state;
			const addAttribute = { error: {}, name: '', operator: '', value: '' };
			if (value === 'Add fact node') {
				const error = validateAttribute(this.state.addAttribute, attributes);
				if (Object.keys(error).length > 0) {
					let addAttribute = this.state.addAttribute;
					addAttribute.error = error;
					this.setState({ addAttribute });
					return undefined;
				}
			}
			if (activeNodeDepth && node) {
				const newNode = { ...node };

				const getActiveNode = (pNode, depthIndex) => pNode[depthIndex];

				let activeNode = newNode;
				const cloneDepth =
					value === 'Remove'
						? activeNodeDepth.slice(0, activeNodeDepth.length - 1)
						: [...activeNodeDepth];
				cloneDepth.forEach((nodeDepth) => {
					if (nodeDepth.depth !== 0) {
						activeNode = getActiveNode(activeNode.children, nodeDepth.index);
					}
				});
				const childrens = activeNode['children'] || [];
				if (value !== 'Remove') {
					activeNode['children'] = childrens.concat(this.mapNodeName(value));
				} else {
					const lastNode = activeNodeDepth[activeNodeDepth.length - 1];
					childrens.splice(lastNode.index, 1);
					factOptions = this.state.factsButton.map((button) => ({ ...button, disable: true }));
				}

				this.setState({
					node: newNode,
					enableFieldView: false,
					addAttribute,
					factsButton: factOptions
				});
			}
		}
	}

	handleActiveNode(node) {
		const depthArr = getNodeDepthDetails(node);
		const sortedArr = sortBy(depthArr, 'depth');

		const factsNodemenu = this.state.factsButton.map((button) => {
			if (button.label !== 'Remove') {
				return { ...button, disable: true };
			}
			return { ...button, disable: false };
		});

		const parentNodeMenu = this.state.factsButton.map((button) => {
			if (sortedArr.length < 1 && button.label === 'Remove') {
				return { ...button, disable: true };
			}
			return { ...button, disable: false };
		});

		const facts = node.name === 'all' || node.name === 'any' ? parentNodeMenu : factsNodemenu;
		const outcomeMenus = outcomeOptions.map((option) => ({ ...option, disable: false }));
		this.setState({ activeNodeDepth: sortedArr, factsButton: facts, outcomeOptions: outcomeMenus });
	}

	handleFieldCancel() {
		const addAttribute = { error: {}, name: '', operator: '', value: '' };
		this.setState({ enableFieldView: false, addAttribute });
	}

	handleOutputPanel(value) {
		if (value === 'Add Outcome') {
			const factsOptions = this.state.factsButton.map((fact) => ({ ...fact, disable: true }));
			const options = this.state.outcomeOptions.map((opt) => {
				if (opt.label === 'Add Outcome') {
					return { ...opt, active: true };
				}
				return { ...opt, active: false };
			});
			this.setState({
				enableOutcomeView: true,
				enableTreeView: false,
				enableFieldView: false,
				outcomeOptions: options,
				factsButton: factsOptions
			});
		}
		if (value === 'Edit Conditions') {
			const options = this.state.outcomeOptions.map((opt) => {
				if (opt.label === 'Edit Conditions') {
					return { ...opt, active: true };
				}
				return { ...opt, active: false };
			});
			this.setState({
				enableOutcomeView: false,
				enableTreeView: true,
				enableFieldView: false,
				outcomeOptions: options
			});
		}
	}

	topPanel() {
		const { topLevelOptions, factsButton, outcomeOptions } = this.state;

		return (
			<div className="add-decision-step">
				<div className="step1">
					<div>Step 1: Add Toplevel</div>
					<ButtonGroup buttons={topLevelOptions} onConfirm={this.handleTopNode} />
				</div>
				<div className="step2">
					<div> Step 2: Add / Remove facts</div>
					<ButtonGroup buttons={factsButton} onConfirm={this.handleAddRule} />
				</div>
				<div className="step3">
					<div> Step 3: Add Outcome</div>
					<ButtonGroup buttons={outcomeOptions} onConfirm={this.handleOutputPanel} />
				</div>
			</div>
		);
	}

	fieldPanel() {
		const {
			note,
			attributes,
			expression,
			expressions = [],
			yields = [],
			yield: Yield
		} = this.state;
		const attributeOptions = attributes.map((attr) => attr.name);
		const attribute = expression.name && attributes.find((attr) => attr.name === expression.name);

		const opertorOptions = attribute && operator[attribute.type];

		const placeholder =
			expression.operator === 'contains' || expression.operator === 'doesNotContain'
				? PLACEHOLDER['string']
				: PLACEHOLDER[attribute.type];
		const getOperators = (eName) => {
			const attribute = attributes.find((attr) => attr.name === eName);
			const opertorOptions = attribute && operator[attribute.type];
			return opertorOptions;
		};
		return (
			<Panel>
				<div className="attributes-header">
					{/* Add Path  <div className="attr-link" onClick={this.addPath}>
						<span className="plus-icon" />
						<span className="text">Add Path</span>
					</div> */}
				</div>

				<div className="add-field-panel">
					<div className="add-field-panel-row">
						<InputField
							onChange={this.onChangeNote}
							note={note}
							label="Note"
							placeholder={placeholder}
						/>
					</div>
					{expressions &&
						expressions.map((expression, index) => (
							<div key={`${expression.name}${expression.value}`} className="add-field-panel-row">
								<div className="field">
									<SelectField
										options={attributeOptions}
										onChange={(e) => this.onEditField(e, 'name', index)}
										value={expression.name}
										// error={expression.error.name}
										label="Expressions"
									/>
								</div>
								<div>
									<SelectField
										options={getOperators(expression.name)}
										onChange={(e) => this.onEditField(e, 'operator', index)}
										value={expression.operator}
										// error={expression.error.operator}
										label="Operator"
									/>
								</div>
								<div>
									<InputField
										onChange={(value) => this.onEditField(value, 'value', index)}
										value={expression.value}
										// error={expression.error.value}
										label="Value"
										placeholder={placeholder}
									/>
								</div>
							</div>
						))}
					<div className="add-field-panel-row">
						<div className="field">
							<SelectField
								options={attributeOptions}
								onChange={(e) => this.onChangeField(e, 'name')}
								value={expression.name}
								error={expression.error.name}
								label="Expressions"
							/>
						</div>
						<div>
							<SelectField
								options={opertorOptions}
								onChange={(e) => this.onChangeField(e, 'operator')}
								value={expression.operator}
								error={expression.error.operator}
								label="Operator"
							/>
						</div>
						<div>
							<InputField
								onChange={(value) => this.onChangeField(value, 'value')}
								value={expression.value}
								error={expression.error.value}
								label="Value"
								placeholder={PLACEHOLDER.number}
							/>
						</div>
					</div>

					<div className="add-field-panel-row ">
						<Button
							label={'Add Expression'}
							onConfirm={() => this.handleAddRule('Add fact node')}
							classname="btn-toolbar"
							type="submit"
						/>
						<Button label={'Cancel'} onConfirm={this.handleFieldCancel} classname="btn-toolbar" />
					</div>
					<div className="add-field-panel-row">
						<div>
							<SelectField
								options={partnerOptions}
								onChange={(e) => this.onChangeYield(e, 'partner')}
								value={Yield.partner}
								error={Yield.error.operator}
								label="Yields"
							/>
						</div>
						<div>
							<InputField
								onChange={(value) => this.onChangeYield(value, 'weight')}
								value={Yield.weight}
								error={Yield.error.value}
								label="Weight"
								placeholder={PLACEHOLDER.number}
							/>
						</div>
					</div>

					<div className="add-field-panel-row ">
						<Button
							label={'Add Yield'}
							onConfirm={() => this.handleAddYield('Add fact node')}
							classname="btn-toolbar"
							type="submit"
						/>
						<Button label={'Cancel'} onConfirm={this.handleFieldCancel} classname="btn-toolbar" />
					</div>
					{yields.map((yld) => (
						<div key={`${yld.partner}${yld.weight}`} className="add-field-panel-row">
							<div>
								<SelectField
									options={partnerOptions}
									onChange={(e) => this.onChangeYield(e, 'partner')}
									value={yld.partner}
									// error={yld.error.operator}
									label="Yields"
								/>
							</div>
							<div>
								<InputField
									onChange={(value) => this.onChangeYield(value, 'weight')}
									value={yld.weight}
									// error={yld.error.value}
									label="Weight"
									placeholder={PLACEHOLDER.number}
								/>
							</div>
						</div>
					))}
				</div>

				{
					// addPathflag && (
					// 	<div className="add-field-panel half-width">
					// 		<div>
					// 			{/*<InputField onChange={(value) => this.onChangeNewFact(value, 'path')} value={addAttribute.path}
					//         label="Path" placeholder={"Enter path value - dont give prefix ' . ' "}/> */}
					// 			<SelectField
					// 				options={attributeOptions}
					// 				onChange={(e) => this.onChangeField(e, 'path')}
					// 				value={addAttribute.path}
					// 				label="Path"
					// 			/>
					// 		</div>
					// 	</div>
					// )
				}
			</Panel>
		);
	}

	outputPanel() {
		const { outcome } = this.state;
		const { editDecision } = this.props;

		return (
			<Panel>
				<div className="attributes-header">
					<div className="attr-link" onClick={this.addParams}>
						<span className="plus-icon" />
						<span className="text">Add Params</span>
					</div>
				</div>
				<div className="add-field-panel half-width">
					<div>
						<InputField
							onChange={(value) => this.onChangeOutcomeValue(value, 'value')}
							value={outcome.value}
							error={outcome.error && outcome.error.value}
							label="Type"
							readOnly={editDecision}
						/>
					</div>
				</div>
				<div>
					{outcome.params.length > 0 &&
						outcome.params.map((param, ind) => (
							<div key={ind} className="add-field-panel">
								<InputField
									onChange={(value) => this.handleOutputParams(value, 'pkey', ind)}
									value={param.pkey}
									label="key"
								/>
								<InputField
									onChange={(value) => this.handleOutputParams(value, 'pvalue', ind)}
									value={param.pvalue}
									label="Value"
								/>
							</div>
						))}
				</div>
			</Panel>
		);
	}

	treePanel() {
		const { node } = this.state;

		const depthCount = getNodeDepth(node);

		return (
			<Panel>
				<Tree treeData={node} count={depthCount} onConfirm={this.handleActiveNode} />
			</Panel>
		);
	}

	addPanel() {
		const { enableFieldView } = this.state;

		return (
			<div>
				{/* {this.topPanel()} */}
				{enableFieldView && this.fieldPanel()}
				{/* {this.outputPanel()} */}
				{/* {enableOutcomeView && this.outputPanel()}
				{enableTreeView && this.treePanel()} */}
			</div>
		);
	}

	render() {
		const { buttonProps } = this.props;
		return (
			<form>
				<div className="add-rulecase-wrapper">
					{this.addPanel()}
					{this.state.formError && <p className="form-error"> {this.state.formError}</p>}
					<div className="btn-group">
						<Button
							label={buttonProps.primaryLabel}
							onConfirm={this.handleAdd}
							classname="primary-btn"
							type="submit"
						/>
						<Button
							label={buttonProps.secondaryLabel}
							onConfirm={this.handleCancel}
							classname="cancel-btn"
						/>
					</div>
				</div>
			</form>
		);
	}
}

AddDecision.defaultProps = {
	addCondition: () => false,
	cancel: () => false,
	attribute: {},
	buttonProps: {},
	attributes: [],
	outcome: {},
	editDecision: false,
	editCondition: {}
};

AddDecision.propTypes = {
	addCondition: PropTypes.func,
	cancel: PropTypes.func,
	attribute: PropTypes.object,
	buttonProps: PropTypes.object,
	attributes: PropTypes.array,
	outcome: PropTypes.object,
	editDecision: PropTypes.bool,
	editCondition: PropTypes.object
};

export default AddDecision;
