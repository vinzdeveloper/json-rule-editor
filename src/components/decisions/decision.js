import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ToolBar from '../toolbar/toolbar';
import AddDecision from './add-decision';
import DecisionDetails from './decision-details';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';


class Decision extends Component {

    constructor(props){
        super(props);
        this.state={showAddRuleCase: false, editCaseFlag: false, editCase: [], message: Message.NO_DECISION_MSG};
        this.handleAdd = this.handleAdd.bind(this);
        this.updateCase = this.updateCase.bind(this);
        this.editCase = this.editCase.bind(this);
        this.addCase = this.addCase.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
        this.removeDecision = this.removeDecision.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleSearch = () => {

    }

    handleAdd = () => {
        this.setState({showAddRuleCase: true});
    }

    cancelAddAttribute = () => {
        this.setState({showAddRuleCase: false, editCaseFlag: false});
    }

    editCase(caseAttribute, caseIndex, decisionIndex) {
        const editCase = this.props.attributes.map(attribute => {
            const editAttribute = caseAttribute.find(attr => attr.name === attribute.name)
            if (editAttribute) {
                return editAttribute;
            }
            return attribute;
        })
        const decision = this.props.decisions[decisionIndex];
        this.setState({ editCaseFlag: true, editCase, 
            editCaseIndex: caseIndex, 
            editDecisionIndex: decisionIndex, 
            editOutcome: {value: decision.outcome, type: decision.type }});
    }

    addCase(attributes, outcome) {
        const caseAttr = attributes.filter(attribute => attribute.operator !== 'any');
        this.props.handleDecisions('ADD', { caseAttr, outcome });
        this.setState({showAddRuleCase: false});
    }

    updateCase(attributes, outcome) {
        const caseAttr = attributes.filter(attribute => attribute.operator !== 'any');
        this.props.handleDecisions('UPDATE', { caseAttr, outcome, 
            caseIndex: this.state.editCaseIndex, decisionIndex: this.state.editDecisionIndex });
        this.setState({editCaseFlag: false});
    }

    removeCase(caseIndex, decisionIndex) {
        this.props.handleDecisions('REMOVECASE', { caseIndex, decisionIndex});
    }

    removeDecision(decisionIndex) {
        this.props.handleDecisions('REMOVEDECISION', { decisionIndex});
    }

    handleReset() {
        this.props.handleDecisions('RESET');
    }


    render() {
        const buttonProps = { primaryLabel: 'Add Rulecase', secondaryLabel: 'Cancel'};
        return (<div className="rulecases-container">
            { this.props.decisions.length > 0 && <ToolBar handleAdd={this.handleAdd} submit={this.props.submit} reset={this.handleReset} /> }
            {this.state.showAddRuleCase && <AddDecision attributes={this.props.attributes} addCase={this.addCase} cancel={this.cancelAddAttribute} buttonProps={buttonProps} />}
            {this.state.editCaseFlag && <AddDecision attributes={this.state.editCase}
                 outcome={this.state.editOutcome} editDecision addCase={this.updateCase} cancel={this.cancelAddAttribute} buttonProps={buttonProps} />}
            <DecisionDetails decisions={this.props.decisions} editCase={this.editCase} removeCase={this.removeCase} removeDecision={this.removeDecision} />
            {this.props.decisions.length < 1 && <Banner message={this.state.message} onConfirm={this.handleAdd}/> }
      </div>);
    }
}

Decision.defaultProps = ({
    handleDecisions: () => false,
    submit: () =>  false,
    reset: () =>  false,
    decisions: [],
    attributes: [],
});

Decision.propTypes = ({
    handleDecisions: PropTypes.func,
    submit: PropTypes.func,
    reset: PropTypes.func,
    decisions: PropTypes.array,
    attributes: PropTypes.array,
});

export default Decision;