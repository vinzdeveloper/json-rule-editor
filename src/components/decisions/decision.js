import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ToolBar from '../toolbar/toolbar';
import AddDecision from './add-decision';
import DecisionDetails from './decision-details';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { transformRuleToTree } from '../../utils/transform';
import { isContains } from '../../utils/stringutils';

class Decision extends Component {

    constructor(props){
        super(props);
        this.state={showAddRuleCase: false,
             searchCriteria: '',
             editCaseFlag: false,
             editCondition: [],
             message: Message.NO_DECISION_MSG,
             decisions: props.decisions || [],
             bannerflag: false };
        this.handleAdd = this.handleAdd.bind(this);
        this.updateCondition = this.updateCondition.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.addCondition = this.addCondition.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
        this.removeDecisions = this.removeDecisions.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch = (value) => {
        this.setState({ searchCriteria: value})
    }

    handleAdd = () => {
        this.setState({showAddRuleCase: true, bannerflag: true });
    }

    cancelAddAttribute = () => {
        this.setState({ showAddRuleCase: false, editCaseFlag: false, bannerflag: false });
    }

    editCondition(decisionIndex) {
        const decision = this.props.decisions[decisionIndex];
        const editCondition = transformRuleToTree(decision);
        let outputParams = [];
        if (decision.event.params && Object.keys(decision.event.params).length > 0) {
             outputParams = Object.keys(decision.event.params).map(key => ({ pkey: key, pvalue: decision.event.params[key] }))
        }
        
        this.setState({ editCaseFlag: true, editCondition, 
            editDecisionIndex: decisionIndex, 
            editOutcome: { value: decision.event.type, params: outputParams }});
    }

    addCondition(condition) {
        this.props.handleDecisions('ADD', { condition });
        this.setState({ showAddRuleCase: false });
    }

    updateCondition(condition) {
        this.props.handleDecisions('UPDATE', { condition, 
            decisionIndex: this.state.editDecisionIndex });
        this.setState({ editCaseFlag: false });
    }

    removeCase(decisionIndex) {
        this.props.handleDecisions('REMOVECONDITION', { decisionIndex});
    }

    removeDecisions(outcome) {
        this.props.handleDecisions('REMOVEDECISIONS', { outcome});
    }

    handleReset() {
        this.props.handleDecisions('RESET');
    }

    filterOutcomes = () => {
        const { searchCriteria } = this.state;
        const { outcomes } = this.props;
        let filteredOutcomes = {};
        Object.keys(outcomes).forEach((key) => {
            if (isContains(key, searchCriteria)) {
                filteredOutcomes[key] = outcomes[key];
            }
        });
        return filteredOutcomes;
    }


    render() {
        const { searchCriteria, bannerflag } = this.state;
        const buttonProps = { primaryLabel: 'Add Rulecase', secondaryLabel: 'Cancel'};
        const editButtonProps = { primaryLabel: 'Edit Rulecase', secondaryLabel: 'Cancel'};
        const filteredOutcomes = searchCriteria ? this.filterOutcomes() : this.props.outcomes;
        const { outcomes } = this.props;

        return (<div className="rulecases-container">

            { <ToolBar handleAdd={this.handleAdd} reset={this.handleReset} searchTxt={this.handleSearch} /> }

            { this.state.showAddRuleCase && <AddDecision attributes={this.props.attributes} addCondition={this.addCondition} cancel={this.cancelAddAttribute} buttonProps={buttonProps} /> }
            
            { this.state.editCaseFlag && <AddDecision attributes={this.props.attributes} editCondition={this.state.editCondition}
                 outcome={this.state.editOutcome} editDecision addCondition={this.updateCondition} cancel={this.cancelAddAttribute} buttonProps={editButtonProps} /> }
            
            <DecisionDetails outcomes={filteredOutcomes} editCondition={this.editCondition} removeCase={this.removeCase} removeDecisions={this.removeDecisions} />
            
            { !bannerflag && Object.keys(outcomes).length < 1 && <Banner message={this.state.message} onConfirm={this.handleAdd}/> }
      </div>);
    }
}

Decision.defaultProps = ({
    handleDecisions: () => false,
    submit: () =>  false,
    reset: () =>  false,
    decisions: [],
    attributes: [],
    outcomes: {},
});

Decision.propTypes = ({
    handleDecisions: PropTypes.func,
    submit: PropTypes.func,
    reset: PropTypes.func,
    decisions: PropTypes.array,
    attributes: PropTypes.array,
    outcomes: PropTypes.object,
});

export default Decision;