import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ToolBar from '../toolbar/toolbar';
import AddDecision from './add-decision';
import DecisionDetails from './decision-details';


class Decision extends Component {

    constructor(props){
        super(props);
        this.state={showAddRuleCase: false, editCaseFlag: false, editCase: []};
        this.handleAdd = this.handleAdd.bind(this);
        this.editCase = this.editCase.bind(this);
        this.addCase = this.addCase.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
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
            decisionIndex: decisionIndex, 
            editOutcome: {value: decision.outcome, type: decision.type }});
    }

    addCase(attributes, outcome) {
        const caseAttr = attributes.filter(attribute => attribute.operator !== 'any');
        this.props.handleRuleCase('ADD', { caseAttr, outcome });
        this.setState({showAddRuleCase: false});
    }

    updateCase(attributes, outcome) {
        const caseAttr = attributes.filter(attribute => attribute.operator !== 'any');
        this.props.handleRuleCase('UPDATE', { caseAttr, outcome, 
            caseIndex: this.state.editCaseIndex, decisionIndex: this.state.decisionIndex });
        this.setState({showAddRuleCase: false});
    }


    render() {
        const buttonProps = { primaryLabel: 'Add Rulecase', secondaryLabel: 'Cancel'};
        return (<div className="rulecases-container">
            <ToolBar handleAdd={this.handleAdd} submit={this.props.submit} reset={this.props.reset} />
            {this.state.showAddRuleCase && <AddDecision attributes={this.props.attributes} addCase={this.addCase} cancel={this.cancelAddAttribute} buttonProps={buttonProps} />}
            {this.state.editCaseFlag && <AddDecision attributes={this.state.editCase}
                 outcome={this.state.editOutcome} editDecision addCase={this.updateCase} cancel={this.cancelAddAttribute} buttonProps={buttonProps} />}
            <DecisionDetails decisions={this.props.decisions} editCase={this.editCase} />
      </div>);
    }
}

Decision.defaultProps = ({
    handleRuleCase: () => false,
    submit: () =>  false,
    reset: () =>  false,
    decisions: [],
    attributes: [],
});

Decision.propTypes = ({
    handleRuleCase: PropTypes.func,
    submit: PropTypes.func,
    reset: PropTypes.func,
    decisions: PropTypes.array,
    attributes: PropTypes.array,
});

export default Decision;