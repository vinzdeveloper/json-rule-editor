import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Timeline from '../timeline/timeline';
import { PanelBox } from '../panel/panel';
import 'font-awesome/css/font-awesome.min.css';
import SweetAlert from 'react-bootstrap-sweetalert';

class DecisionDetails extends Component {

    static getDerivedStateFromProps(props, state) {
        if (props.decisions.length !== state.showCase.length) {
            const showCase = props.decisions.map((decision, index) =>
            ({case: false, edit: false, index }));
            return { showCase };
        }
        return null;
    }

    constructor(props) {
        super(props);
        const showCase = props.decisions.map((decision, index) =>
           ({case: false, edit: false, index })
        )
        this.state = { showCase, submitAlert: false, removeAlert:false, successAlert: false, removeDecisionAlert: false};
        this.handleExpand = this.handleExpand.bind(this);
        this.handleRemoveCase = this.handleRemoveCase.bind(this);
        this.handleRemoveDecision = this.handleRemoveDecision.bind(this);
        this.editCase = this.editCase.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.removeDecision = this.removeDecision.bind(this);
    }


    handleEdit(e, val) {
        e.preventDefault();
        this.setState({showRuleIndex: val});
    }

    editCase(e, caseAttribute, caseIndex, decisionIndex) {
        e.preventDefault();
        this.props.editCase(caseAttribute, caseIndex, decisionIndex);
    }

    handleExpand(e, index) {
        e.preventDefault();
        const cases = [...this.state.showCase];
        let updateCase  = cases[index];
        updateCase = {case: !updateCase.case}
        cases[index] = {...updateCase};
        this.setState({showCase: cases});
    }

    handleRemoveCase(e, caseIndex, decisionIndex) {
        e.preventDefault();
        this.setState({removeAlert: true, removeCaseIndex: caseIndex, removeDecisionIndex: decisionIndex});
    }

    handleRemoveDecision(e, decisionIndex) {
        e.preventDefault();
        this.setState({removeDecisionAlert: true, removeDecisionIndex: decisionIndex});
    }

    cancelAlert = () => {
        this.setState({removeAlert: false, successAlert: false, removeDecisionAlert: false});
    }

    removeCase = () => {
        this.props.removeCase(this.state.removeCaseIndex, this.state.removeDecisionIndex);
        this.setState({removeAlert: false, successAlert: true, successMsg: 'Selected Case is removed'});
    }

    removeDecision = () => {
        this.props.removeDecision(this.state.removeDecisionIndex);
        this.setState({removeDecisionAlert: false, successAlert: true, successMsg: 'Selected Decision is removed'});
    }

    removeCaseAlert = () => {
        return (<SweetAlert
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
          </SweetAlert>)
    }

    removeDecisionAlert = () => {
        return (<SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Remove it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={this.removeDecision}
            onCancel={this.cancelAlert}
            focusCancelBtn
          >
            You will not be able to recover the changes!
          </SweetAlert>)
    }

    successAlert = () => {
        return (<SweetAlert
            success
            title={this.state.successMsg}
            onConfirm={this.cancelAlert}
          >
          </SweetAlert>);
    }

    alert = () => {
        return (<div>
             {this.state.removeAlert && this.removeCaseAlert()}
             {this.state.removeDecisionAlert && this.removeDecisionAlert()}
             {this.state.successAlert && this.successAlert()}
         </div>);
     }

    renderCases = (cases, decisionIndex) => {
        return (<div className="rule-flex-container">
         { cases && cases.map((caseAttribute, caseIndex) => (<div className="decision-box" key={`case - ${caseIndex} - ${decisionIndex}`}>
            <div className="tool-flex">
                <div><a href="" onClick={(e) => this.editCase(e, caseAttribute, caseIndex, decisionIndex)}><span className="fa fa-edit" /></a></div>
                <div><a href="" onClick={((e) => this.handleRemoveCase(e, caseIndex, decisionIndex))}><span className="fa fa-trash-o" /></a></div>
            </div>
            <Timeline caseAttribute={caseAttribute} />
            </div>))}
        </div>)
    }

    render() {
        const { decisions } = this.props;
        const { showCase} = this.state;

        const decisionList = decisions.map((decision, index) =>
            (<div key={decision.outcome}>
                <PanelBox className={decision.type}>
                    <div>{index + 1}</div>
                    <div>{String(decision.outcome)}</div>
                    <div><span className={decision.type}>{decision.type}</span></div>
                    <div>{`cases (${decision.cases.length})`}</div>
                    <div>
                        <a href="" onClick={(e) => this.handleExpand(e, index)}> { showCase[index].case ? 'Collapse' : 'Expand' }</a>
                        <a href="" onClick={((e) => this.handleRemoveDecision(e, index))}>Remove</a>
                    </div>
                 </PanelBox>
                 { showCase[index].case && this.renderCases(decision.cases, index)}
            </div>));

        return (<div className="">
            { this.alert() }
            { decisionList }
        </div>);
    }
}

DecisionDetails.defaultProps = ({
    decisions: [],
    editCase: () => false,
    removeCase: () => false,
    removeDecision: () => false,
});

DecisionDetails.propTypes = ({
    decisions: PropTypes.array,
    editCase: PropTypes.func,
    removeCase: PropTypes.func,
    removeDecision: PropTypes.func,
});

export default DecisionDetails;