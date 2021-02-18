import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Tree from '../tree/tree';
// import { PanelBox } from '../panel/panel';
import 'font-awesome/css/font-awesome.min.css';
import SweetAlert from 'react-bootstrap-sweetalert';
class DecisionDetails extends Component {
	static getDerivedStateFromProps(props, state) {
		if (Object.keys(props.outcomes).length !== state.showCase.length) {
			const showCase = Object.keys(props.outcomes).map((key, index) => {
				return { case: false, edit: false, index };
			});
			return { showCase };
		}
		return null;
	}

	constructor(props) {
		super(props);
		const showCase = Object.keys(props.outcomes).map((key, index) => {
			return { case: false, edit: false, index };
		});

		this.state = {
			showCase,
			submitAlert: false,
			removeAlert: false,
			successAlert: false,
			removeDecisionAlert: false
		};
		this.handleExpand = this.handleExpand.bind(this);
		this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
		this.handleRemoveConditions = this.handleRemoveConditions.bind(this);
		this.editCondition = this.editCondition.bind(this);
		this.cancelAlert = this.cancelAlert.bind(this);
		this.removeCase = this.removeCase.bind(this);
		this.removeDecisions = this.removeDecisions.bind(this);
	}

	handleEdit(e, val) {
		e.preventDefault();
		this.setState({ showRuleIndex: val });
	}

	editCondition(e, decisionIndex) {
		e.preventDefault();
		this.props.editCondition(decisionIndex);
	}

	handleExpand(e, index) {
		e.preventDefault();
		const cases = [...this.state.showCase];
		let updateCase = cases[index];
		updateCase = { ...updateCase, case: !updateCase.case };
		cases[index] = { ...updateCase };
		this.setState({ showCase: cases });
	}

	handleRemoveCondition(e, decisionIndex) {
		e.preventDefault();
		this.setState({ removeAlert: true, removeDecisionIndex: decisionIndex });
	}

	handleRemoveConditions(e, outcome) {
		e.preventDefault();
		this.setState({ removeDecisionAlert: true, removeOutcome: outcome });
	}

	cancelAlert = () => {
		this.setState({ removeAlert: false, successAlert: false, removeDecisionAlert: false });
	};

	removeCase = () => {
		this.props.removeCase(this.state.removeDecisionIndex);
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

	renderConditions = () => {
		// const transformedData = transformRuleToTree(conditions);
		// eslint-disable-next-line no-unused-vars
		const { data: { expressions = [], yields = [], note = '' } = {} } = this.props.ruleset;

		return (
			<div className="rule-flex-container">
				{JSON.stringify(this.props.ruleset)}
				<label>Note</label>
				{note}

				<label>Expression</label>
				{/* {expressions.map((expr) => (
					<div>{JSON.stringify(expr)}</div>
				))}
				<label>Yields</label>
				{yields.map((expr) => (
					<div>{JSON.stringify(expr)}</div>
				))} */}

				<div className="decision-box" key={`case - `}>
					{expressions.map((expr, index) => (
						<div key={expr.field} className="tool-flex">
							<div>
								<a href="" onClick={(e) => this.editCondition(e, index)}>
									<span className="fa fa-edit" />
								</a>
							</div>
							<div>
								<a href="" onClick={(e) => this.handleRemoveCondition(e, index)}>
									<span className="fa fa-trash-o" />
								</a>
							</div>
						</div>
					))}
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
		// const { showCase } = this.state;
		// eslint-disable-next-line no-unused-vars

		return (
			<div className="">
				{this.alert()}
				{this.renderConditions()}
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
	ruleset: PropTypes.object
};

export default DecisionDetails;
