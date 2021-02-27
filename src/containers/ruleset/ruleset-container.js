/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageTitle from '../../components/title/page-title';
import Tabs from '../../components/tabs/tabs';
import Attributes from '../../components/attributes/attributes';
import Decisions from '../../components/decisions/decision';
import ValidateRules from '../../components/validate/validate-rules';
import { handleAttribute } from '../../actions/attributes';
import Button from '../../components/button/button';
import {
	handleDecision,
	addRulesetData,
	changeRulecaseOrder,
	addNewItem
} from '../../actions/decisions';
import InputField from '../../components/forms/input-field';

import { updateRulesetName } from '../../actions/ruleset';
import Banner from '../../components/panel/banner';
import * as Message from '../../constants/messages';
import { groupBy } from 'lodash/collection';
import RuleErrorBoundary from '../../components/error/ruleset-error';
import SweetAlert from 'react-bootstrap-sweetalert';
import attributes from '../../constants/attributes.json';
import { getSha, updateFile } from '../../api';
import { PREFERENCE_PATH } from '../../constants/paths.json';
const operatorsMap = {
	equal: '==',
	notEqual: '!=',
	lessThanInclusive: '<=',
	lessThan: '<',
	greaterThan: '>',
	greaterThanInclusive: '>=',
	notIn: 'not_in'
};
const tabs = [
	{ name: 'Fields' },
	{ name: 'Rulesets' },
	{ name: 'Validate' },
	{ name: 'Generate' },
	{ name: 'Push' }
];
const getFormattedValue = (value, type) => {
	switch (type) {
		case 'boolean':
			return value === 'true';
		case 'number':
			// eslint-disable-next-line no-case-declarations
			const num = parseFloat(value, 10);
			return num;
		default:
			return value;
	}
};
class RulesetContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'Fields',
			generateFlag: false,
			message: '',
			error: {},
			pushError: '',
			pushFlag: false
		};
		this.generateFile = this.generateFile.bind(this);
		this.cancelAlert = this.cancelAlert.bind(this);
		this.onChangeMessage = this.onChangeMessage.bind(this);

		this.pushToRepo = this.pushToRepo.bind(this);
	}
	onChangeMessage(e) {
		this.setState({ message: e.target.value });
	}
	handleTab = (tabName) => {
		this.setState({ activeTab: tabName });
	};

	prepareFile() {
		const attributesMap = {};

		attributes.forEach((v) => {
			attributesMap[v.name] = v.type;
		});
		const { ruleset: { name = 'rulesetDefault', data = [] } = {} } = this.props;

		const rules = data.map(({ expressions, note, yields, override }) => {
			if (override) {
				return {
					note,
					expressions: expressions.map(({ name: lhs, operator, value: rhs = 'null' }) => ({
						lhs,
						operator: operatorsMap[operator] || operator,
						rhs: getFormattedValue(rhs, attributesMap[lhs])
					})),
					yields,
					override: true
				};
			}
			return {
				note,
				expressions: expressions.map(({ name: lhs, operator, value: rhs = 'null' }) => ({
					lhs,
					operator: operatorsMap[operator] || operator,
					rhs
				})),
				yields
			};
		});

		// converting from  name,value format to  lhs,rhs format
		// const expressions = ruleset.data.expressions.map(({ name: lhs, operator, value: rhs }) => ({
		// 	lhs,
		// 	operator: operatorsMap[operator] || operator,
		// 	rhs
		// }));
		const exportedObj = {
			name: name,
			stage: 'preference',
			rules
		};
		return exportedObj;
	}
	async fetchData() {}
	generateFile() {
		const obj = this.prepareFile();
		const fileData = JSON.stringify(obj, null, '\t');
		const blob = new Blob([fileData], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = obj.name + '.json';
		link.href = url;
		link.click();
		this.setState({ pushFlag: true });
	}
	async pushToRepo() {
		if (this.state.message === '') {
			this.setState({ error: { message: 'Commit message is required for pushing' } });
		}
		const obj = this.prepareFile();

		// get latest sha if the file already exists
		let sha;
		try {
			const { data: { sha: Sha } = {} } = await getSha({
				path: PREFERENCE_PATH
			});
			sha = Sha;
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log('err');
			this.setState({
				pushError: err.message
			});
		}
		try {
			await updateFile({
				message: this.state.message,
				content: JSON.stringify(obj, null, '\t'),
				sha,
				path: PREFERENCE_PATH
			});
			this.setState({
				pushFlag: true
			});
		} catch (err) {
			this.setState({
				pushError: err.message
			});
			// eslint-disable-next-line no-console
			console.log('err', err);
		}
	}
	cancelAlert() {
		this.setState({ generateFlag: false, pushFlag: false, pushError: '' });
	}

	successAlert = ({
		msg = 'rule is successfully generated at your default download location',
		error = false,
		title = 'File generated'
	}) => {
		const { name } = this.props.ruleset;
		return (
			<SweetAlert success={!error} error={error} title={title} onConfirm={this.cancelAlert}>
				{`${name} ${msg}`}
			</SweetAlert>
		);
	};

	render() {
		const { decisions, name, data: { expressions = [] } = {} } = this.props.ruleset;

		const indexedDecisions =
			decisions &&
			decisions.length > 0 &&
			decisions.map((decision, index) => ({ ...decision, index }));
		let outcomes;
		if (indexedDecisions && indexedDecisions.length > 0) {
			outcomes = groupBy(indexedDecisions, (data) => data && data.event && data.event.type);
		}

		const message = this.props.updatedFlag ? Message.MODIFIED_MSG : Message.NO_CHANGES_MSG;
		// const uploadMessage = this.props.updatedFlag ? Message.UPLOAD_MSG : Message.NO_CHANGES_MSG;
		return (
			<div>
				<RuleErrorBoundary>
					<PageTitle name={name} onEdit={this.props.onUpdateRulesetName} />
					<Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
					<div className="tab-page-container">
						{this.state.activeTab === 'Fields' && (
							<Attributes attributes={attributes} handleAttribute={this.props.handleAttribute} />
						)}
						{this.state.activeTab === 'Rulesets' && (
							<Decisions
								decisions={indexedDecisions || []}
								attributes={attributes}
								handleDecisions={this.props.handleDecisions}
								handleAddRulesetData={this.props.handleAddRulesetData}
								outcomes={outcomes}
								changeRulecaseOrder={this.props.changeRulecaseOrderAction}
								ruleset={this.props.ruleset}
								handleAddItem={this.props.handleAddItem}
							/>
						)}
						{this.state.activeTab === 'Validate' && (
							<ValidateRules
								attributes={attributes}
								decisions={decisions}
								expressions={expressions}
								ruleset={this.props.ruleset}
							/>
						)}
						{this.state.activeTab === 'Generate' && (
							<>
								<Banner
									message={message}
									ruleset={this.props.ruleset}
									onConfirm={this.generateFile}
								/>
							</>
						)}
						{this.state.generateFlag && this.successAlert()}

						{this.state.activeTab === 'Push' && (
							<>
								<div className="add-attribute-wrapper" style={{ marginTop: 32, marginLeft: 34 }}>
									<div className="form-groups-inline">
										<InputField
											label="Commit Message"
											onChange={this.onChangeMessage}
											value={this.state.message}
											error={this.state.error.message}
										/>
									</div>
									<div className="btn-group">
										{this.state.error.message && this.state.message === '' && (
											<span style={{ color: 'red' }}>{this.state.error.message}</span>
										)}
									</div>

									<Button label="Push" onConfirm={this.pushToRepo} classname="primary-btn" />
								</div>
							</>
						)}
						{this.state.pushFlag &&
							this.successAlert({
								msg: 'rule is successfully pushed to the repository',
								title: 'Pushed successfully'
							})}
						{this.state.pushError &&
							this.successAlert({
								msg: this.state.pushError,
								title: 'Push failed',
								error: !!this.state.pushError
							})}
					</div>
				</RuleErrorBoundary>
			</div>
		);
	}
}

RulesetContainer.propTypes = {
	ruleset: PropTypes.object,
	handleAttribute: PropTypes.func,
	handleDecisions: PropTypes.func,
	handleAddRulesetData: PropTypes.func,
	updatedFlag: PropTypes.bool,
	runRules: PropTypes.func,
	changeRulecaseOrderAction: PropTypes.func,
	handleAddItem: PropTypes.func,
	onUpdateRulesetName: PropTypes.func
};

RulesetContainer.defaultProps = {
	ruleset: {},
	handleAttribute: () => false,
	handleDecisions: () => false,
	updatedFlag: false
};

const mapStateToProps = (state) => ({
	ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
	updatedFlag: state.ruleset.updatedFlag
});

const mapDispatchToProps = (dispatch) => ({
	handleAttribute: (operation, attribute, index) =>
		dispatch(handleAttribute(operation, attribute, index)),
	handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
	handleAddRulesetData: (payload) => dispatch(addRulesetData(payload)),
	changeRulecaseOrderAction: (payload) => dispatch(changeRulecaseOrder(payload)),
	handleAddItem: (payload) => dispatch(addNewItem(payload)),
	onUpdateRulesetName: (payload) => dispatch(updateRulesetName(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesetContainer);
