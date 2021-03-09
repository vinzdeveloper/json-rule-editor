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
import { getSha, updateFile, getBranchSha, createPR, createBranch } from '../../api';
import { PREFERENCE_PATH } from '../../constants/paths.json';
import Loader from '../../components/loader/loader';

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
const opMap = {
	'==': 'in',
	'!=': 'not_in'
};
const revOpMap = {
	in: '==',
	not_in: '!='
};
const getActualOperator = ({ operator, value, nullable }) => {
	if ((value && value.includes(',')) || nullable) {
		return opMap[operator] || operator;
	}
	return revOpMap[operator] || operator;
};
const getFormattedValue = (value, { type, fieldType } = {}, nullable) => {
	switch (type) {
		case 'string':
			if (value === 'null') {
				return null;
			}
			if (value && value.includes(',')) {
				const arr = value && value.split(',').map((v) => (!v ? null : v));
				if (nullable) {
					arr.push(null);
					return arr;
				} else {
					return arr;
				}
			}
			return value ? (nullable ? [value, null] : value) : [null];
		// if (value.includes(',')) {
		// 	return value && value.split(',').map((v) => (!v ? null : v));
		// }

		case 'boolean':
			if (nullable) {
				return null;
			}
			return value === 'true';
		case 'number':
			if (fieldType === 'array') {
				if (value && value.includes(',')) {
					const arr = value && value.split(',').map((v) => (!v ? null : parseFloat(v)));
					if (nullable) {
						arr.push(null);
						return arr;
					} else {
						return arr;
					}
				}
				return value ? [value] : [null];
			} else {
				if (nullable) {
					return null;
				}
				// eslint-disable-next-line no-case-declarations
				const num = parseFloat(value, 10);

				return num;
			}
		default:
			return value;
	}
};
const parseTypeFloat = (val) => {
	return parseFloat(val);
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
			pushFlag: false,
			accessToken: '',
			loading: false,
			prTitle: '',
			prBody: '',
			prURL: ''
		};
		this.generateFile = this.generateFile.bind(this);
		this.cancelAlert = this.cancelAlert.bind(this);
		this.onChangeMessage = this.onChangeMessage.bind(this);
		this.onChangeAccessToken = this.onChangeAccessToken.bind(this);
		this.onChangePR = this.onChangePR.bind(this);

		this.pushToRepo = this.pushToRepo.bind(this);
	}
	onChangeMessage(e) {
		this.setState({ message: e.target.value });
	}
	handleTab = (tabName) => {
		this.setState({ activeTab: tabName });
	};
	onChangeAccessToken(e) {
		this.setState({ accessToken: e.target.value });
	}

	onChangePR(e, type) {
		this.setState({ [type]: e.target.value });
	}

	prepareFile() {
		const attributesMap = {};

		attributes.forEach(({ name, type, fieldType }) => {
			attributesMap[name] = { type, fieldType };
		});
		const { ruleset: { name = 'rulesetDefault', data = [] } = {} } = this.props;

		const rules = data.map(({ expressions, note, yields, override }) => {
			if (override) {
				return {
					note,
					expressions: expressions.map(({ name: lhs, operator, value: rhs = null, nullable }) => ({
						lhs,
						operator: getActualOperator({
							value: rhs,
							nullable,
							operator: operatorsMap[operator] || operator
						}),
						rhs: getFormattedValue(
							rhs,
							attributesMap[lhs],
							nullable,
							operatorsMap[operator] || operator
						)
					})),
					yields: yields.map(({ partner, weight }) => ({
						partner,
						weight: parseTypeFloat(weight)
					})),
					override: true
				};
			}
			return {
				note,
				expressions: expressions.map(({ name: lhs, operator, value: rhs = null, nullable }) => ({
					lhs,
					operator: getActualOperator({
						value: rhs,
						nullable,
						operator: operatorsMap[operator] || operator
					}),
					rhs: getFormattedValue(
						rhs,
						attributesMap[lhs],
						nullable,
						operatorsMap[operator] || operator
					)
				})),
				yields: yields.map(({ partner, weight }) => ({
					partner,
					weight: parseTypeFloat(weight)
				}))
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
		const fileData = JSON.stringify(obj, null, 2);
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
			return;
		}
		if (this.state.accessToken === '') {
			this.setState({ error: { accessToken: 'Access Token is required for pushing' } });
			return;
		}
		this.setState({ loading: true, prURL: '' });
		const obj = this.prepareFile();

		// get latest sha if the file already exists
		try {
			let sha;

			const { data: { sha: Sha } = {} } = await getSha({
				path: PREFERENCE_PATH,
				token: this.state.accessToken
			});
			sha = Sha;

			let branchSha;
			const {
				object: { sha: bSha }
			} = await getBranchSha({
				path: PREFERENCE_PATH,
				token: this.state.accessToken
			});
			branchSha = bSha;
			const timestamp = new Date().toISOString().slice(0, 16).replace(':', '');
			const branch = `routing-rule-changes-${new Date()
				.toISOString()
				.slice(0, 16)
				.replace(':', '')}`;
			await createBranch({ token: this.state.accessToken, sha: branchSha, branch });
			await updateFile({
				message: this.state.message,
				content: JSON.stringify(obj, null, 2),
				sha,
				path: PREFERENCE_PATH,
				token: this.state.accessToken,
				branch
			});
			const { html_url } = await createPR({
				token: this.state.accessToken,
				title: this.state.prTitle || `Routing Rule Changes - ${timestamp}`,
				content: this.state.prBody || `Routing Rule Changes - ${timestamp}`,
				head: branch
			});
			this.setState({
				pushFlag: true,
				prURL: html_url
			});
		} catch (err) {
			this.setState({
				pushError: err.message
			});
			// eslint-disable-next-line no-console
			console.log('err', err);
		}
		this.setState({ loading: false });
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
									<div className="form-groups-inline">
										<InputField
											label="Github Access Token"
											onChange={this.onChangeAccessToken}
											value={this.state.accessToken}
											error={this.state.error.accessToken}
										/>
									</div>
									<div className="form-groups-inline">
										<InputField
											label="PR Title"
											onChange={(e) => this.onChangePR(e, 'prTitle')}
											value={this.state.prTitle}
											error={this.state.error.prTitle}
										/>
									</div>
									<div className="form-groups-inline">
										<InputField
											label="PR Body"
											onChange={(e) => this.onChangePR(e, 'prBody')}
											value={this.state.prBody}
											error={this.state.error.prBody}
										/>
									</div>
									<div className="btn-group">
										{this.state.error.message && this.state.message === '' && (
											<span style={{ color: 'red' }}>{this.state.error.message}</span>
										)}
										{this.state.error.accessToken && this.state.accessToken === '' && (
											<span style={{ color: 'red' }}>{this.state.error.accessToken}</span>
										)}
									</div>
									{this.state.loading && <Loader />}
									<Button label="Push" onConfirm={this.pushToRepo} classname="primary-btn" />

									{this.state.prURL && (
										<div style={{ marginTop: 24 }}>
											Pull request URL :{' '}
											<a href={this.state.prURL} target="_blank" rel="noopener noreferrer">
												{this.state.prURL}
											</a>
										</div>
									)}
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
