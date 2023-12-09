import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from '../tree/tree';
import { PanelBox } from '../panel/panel';
import 'font-awesome/css/font-awesome.min.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { transformRuleToTree } from '../../utils/transform';
import ViewAttribute from '../attributes/view-attributes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

class DecisionDetails extends Component {

    static getDerivedStateFromProps(props, state) {
        let sRules = DecisionDetails.getSortedRules(props.outcomes);
        if (Object.keys(sRules).length !== state.showCase.length) {
            //console.log(`sRules).length=${Object.keys(sRules).length}, state.showCase.length=${state.showCase.length}`);
            const showCase = Object.keys(sRules).map((key, index) => {
                return ({case: false, edit: false, index });
            });
            console.log(`Rules changed, showCase =========> ${JSON.stringify(showCase)}`);
            console.log(`Rules changed, sortedRule =========> ${JSON.stringify(state.sortedRules)}`);
            return { showCase };
        }
        return null;
    }

    static getSortedRules = (input) => {
        let output = {};
    
        // Iterate over each event type in the input object
        for (let eventType in input) {
            // Iterate over each rule for the current event type
            input[eventType].forEach(rule => {
                // Add the rule to the output object, using its index as the key
                output[rule.index] = rule;
            });
        }
    
        // Convert the output object to an array of rules
        let outputArray = Object.values(output);
    
        // Sort the array by index
        outputArray.sort((a, b) => a.index - b.index);
    
        // Convert the sorted array back to an object
        let sortedOutput = {};
        outputArray.forEach(rule => {
            sortedOutput[rule.index] = rule;
        });
    
        return sortedOutput;
    }

    static getSortedRulesBeta = (input) => {
        let output = [];
    
        // Flatten the input array of arrays into a single array
        input.forEach(subArray => {
            output = [...output, ...subArray];
        });
    
        // Sort the array by index
        output.sort((a, b) => a.index - b.index);
    
        return output;
    }

    constructor(props) {
        super(props);

        const sortedRules = DecisionDetails.getSortedRules(props.outcomes);

        const showCase = Object.keys(sortedRules).map((key, index) => {
            return ({case: false, edit: false, index});
        })
       
        console.log(`showCase =========> ${JSON.stringify(showCase)}`);
        console.log(`outcomes =========> ${JSON.stringify(props.outcomes)}`);
        console.log(`Sorted Rules =========> ${JSON.stringify(sortedRules)}`);


        this.state = { showCase, sortedRules, submitAlert: false, removeAlert:false, successAlert: false, removeDecisionAlert: false, moveRuleUpAlert: false, moveRuleDownAlert: false, moveRuleDownAlert: false, successMsg: ''};
        this.handleExpand = this.handleExpand.bind(this);
        this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
        this.handleRemoveConditions = this.handleRemoveConditions.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.removeDecisions = this.removeDecisions.bind(this);
        this.moveRuleUp = this.moveRuleUp.bind(this);
        this.moveRuleDown = this.moveRuleDown.bind(this);
    }


    handleEdit(e, val) {
        e.preventDefault();
        this.setState({showRuleIndex: val});
    }

    editCondition(e, decisionIndex) {
        e.preventDefault();
        this.props.editCondition(decisionIndex);
    }

    handleExpand(e, index) {
        e.preventDefault();
        const cases = [...this.state.showCase];
        let updateCase  = cases[index];
        updateCase = { ...updateCase, case: !updateCase.case}
        cases[index] = { ...updateCase };
        console.log(`cases [${index}] =========> ${JSON.stringify(cases)}`);
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
    }

    removeCase = () => {
        this.props.removeCase(this.state.removeDecisionIndex);
        this.setState({ removeAlert: false, successAlert: true, successMsg: 'Selected condition is removed' });
    }

    removeDecisions = () => {
        this.props.removeDecisions(this.state.removeOutcome);
        this.setState({ removeDecisionAlert: false, successAlert: true, successMsg: 'Selected conditions are removed', removeOutcome: ''});
    }

    moveRuleUp = (e, index) => {
        e.preventDefault();
        this.props.moveRuleUp(index);
        this.setState({ moveRuleUpAlert: true, successMsg: 'Selected condition is moved up'});
    }
    
    moveRuleDown = (e, index) => {
        e.preventDefault();
        this.props.moveRuleDown(index);
        this.setState({ moveRuleDownAlert: true, successMsg: 'Selected condition is moved down'});
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
            onConfirm={this.removeDecisions}
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

    renderConditions = (conditions, index) => {
        //console.log(`index =========> ${JSON.stringify(index)}`);
        //console.log(`conditions =========> ${JSON.stringify(conditions)}`);
        const transformedData = transformRuleToTree(conditions);
        //console.log(`transformedData =========> ${JSON.stringify(transformedData)}`);
        return (
            <div className="rule-flex-container">
                <div className="decision-box" key={`case - ${index}`}>
                    <div className="tool-flex">
                        <div><a href="" onClick={(e) => this.editCondition(e, transformedData.index)}><FontAwesomeIcon icon={faPenToSquare} /></a></div>
                        <div><a href="" onClick={((e) => this.handleRemoveCondition(e, transformedData.index))}><FontAwesomeIcon icon={faTrash} /></a></div>
                    </div>
                    <Tree treeData={transformedData.node} count={transformedData.depthCount} />
                    {/* {transformedData.event.params && <div className="view-params-container">
                        <h4>Params  </h4>
                        <ViewAttribute items={transformedData.event.params} />
                    </div>} */}
                </div>
            </div>)
    }

    render() {
        const { outcomes } = this.props;
        const { showCase} = this.state;
        const {sortedRules} = this.state;
        
        console.log(`sortedRules =========> ${JSON.stringify(sortedRules[0])}`);
        const conditions = Object.keys(sortedRules).map((key) =>
        (<div key={key}>
            <PanelBox className={'boolean'}>
                <div className="index">{Number(key) + 1}</div>
                <div className="name">{String(sortedRules[key].event.type)}</div>
                {/* <div className="type">conditions <span className="type-badge">{Object.keys(sortedRules[key].conditions).length}</span></div> */}
                <div className="move">
                    <a href="" onClick={((e) => this.moveRuleUp(e, key) )}>Up</a>
                    <a href="" onClick={((e) => this.moveRuleDown(e, key) )}>Down</a>
                </div>
                <div className="menu">
                    <a href="" onClick={(e) => this.handleExpand(e, key)}> { showCase[key].case ? 'Collapse' : 'View Conditions' }</a>
                    <a href="" onClick={((e) => this.handleRemoveConditions(e, String(key)))}>Remove</a>
                </div>
            </PanelBox>

            { showCase[key].case && this.renderConditions(sortedRules[key], key)}
        </div>));

    return (<div className="">
        { this.alert() }
        { conditions }
    </div>);
    }
}

DecisionDetails.defaultProps = ({
    decisions: [],
    editCondition: () => false,
    removeCase: () => false,
    removeDecisions: () => false,
    moveRuleUp: () => false,
    moveRuleDown: () => false,
    outcomes: {},
});

DecisionDetails.propTypes = ({
    decisions: PropTypes.array,
    editCondition: PropTypes.func,
    removeCase: PropTypes.func,
    removeDecisions: PropTypes.func,
    moveRuleUp: PropTypes.func,
    moveRuleDown: PropTypes.func,
    outcomes: PropTypes.object,
});

export default DecisionDetails;