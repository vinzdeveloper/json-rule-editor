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
        if ((Object.keys(sRules).length !== state.showCase.length) || (state.changedFlag == true)) {
            //console.log(`sRules).length=${Object.keys(sRules).length}, state.showCase.length=${state.showCase.length}`);
            // if (state.changedFlag == true) {
            //     console.log(`Rules changed, changedFlag =========> ${JSON.stringify(state.changedFlag)}`);
            // }
            const showCase = Object.keys(sRules).map((key, index) => {
                return ({case: false, edit: false, index });
            });
            // console.log(`Rules changed, showCase =========> ${JSON.stringify(showCase)}`);
            // console.log(`Rules changed, sRUles =========> ${JSON.stringify(sRules)}`);
            // console.log(`Rules changed, sortedRule =========> ${JSON.stringify(state.sortedRules)}`);
            return { showCase, sortedRules: Object.values(sRules), changedFlag: false};
        }
        return null;
    }

    
    static getSortedRules = (input) => {
        let output = {};

        if (!input) {
            return {};
        }

        // Iterate over each rule in the input array
        input.forEach(rule => {
            // Add the rule to the output object, using its ruleIndex as the key
            output[rule.ruleIndex] = rule;
        });

        // Convert the output object to an array of rules
        let outputArray = Object.values(output);

        // Sort the array by ruleIndex
        outputArray.sort((a, b) => a.ruleIndex - b.ruleIndex);

        // Convert the sorted array back to an object
        let sortedOutput = {};
        outputArray.forEach(rule => {
            sortedOutput[rule.ruleIndex] = rule;
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

        this.state = { showCase, sortedRules, submitAlert: false, removeAlert:false, successAlert: false, removeDecisionAlert: false, moveRuleUpAlert: false, moveRuleDownAlert: false, changedFlag: false, successMsg: '', ruleCount: 0};
        this.handleExpand = this.handleExpand.bind(this);
        this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
        this.handleRemoveConditions = this.handleRemoveConditions.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.removeDecisions = this.removeDecisions.bind(this);
        this.moveRuleUp = this.moveRuleUp.bind(this);
        this.moveRuleDown = this.moveRuleDown.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        this.updateRule = this.updateRule.bind(this);
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
        console.log(`in handleRemoveCondition, decisionIndex =========> ${JSON.stringify(decisionIndex)}`);
        console.log(`in handleRemoveCondition, this.props =========> ${JSON.stringify(this.props)}`);
        console.log(`in handleRemoveCondition, this.state =========> ${JSON.stringify(this.state)}`);
        this.setState({ removeAlert: true, removeDecisionIndex: decisionIndex });
    }

    handleRemoveConditions(e, outcome) {
        e.preventDefault();
        console.log(`in handleRemoveConditions, outcome =========> ${JSON.stringify(outcome)}`);
        this.setState({ removeDecisionAlert: true, removeOutcome: outcome });
    }

    cancelAlert = () => {
        this.setState({ removeAlert: false, successAlert: false, removeDecisionAlert: false });
    }

    removeCase = () => {
        console.log('In removeCase')
        this.props.removeCase(this.state.removeDecisionIndex);
        this.setState({ removeAlert: false, successAlert: true, successMsg: 'Selected condition is removed' });
    }

    removeDecisions = () => {
        console.log(`this.props =========> ${JSON.stringify(this.props)}`)
        this.props.removeDecisions(this.state.removeIndex);
        this.setState({ removeDecisionAlert: false, successAlert: true, successMsg: 'Selected conditions are removed', removeIndex: ''});
    }

    updateRule = (rule) => {
        //console.log(`In updateRule, rule =========> ${JSON.stringify(rule)}`);
        //console.log(`In updateRule, this.props =========> ${JSON.stringify(this.props)}`)
        //console.log(`in updateRule, this.state =========> ${JSON.stringify(this.state)}`);
        //this.props.removeCase(rule);
        const result = this.props.updateRule(rule);

        console.log(`In updateRule, the result is =========> ${JSON.stringify(result)}`);
    }

    moveRuleUp = (e, index) => {
        e.preventDefault();
        console.log(`In moveRuleUp, index =========> ${JSON.stringify(index)}`);
        this.props.moveUp(index);
        this.setState({ changedFlag: true, moveRuleUpAlert: true, successMsg: 'Selected condition is moved up'});
    }
    
    moveRuleDown = (e, index) => {
        e.preventDefault();
        console.log(`In moveRuleDown, index =========> ${JSON.stringify(index)}`);
        this.props.moveDown(index);
        this.setState({ changedFlag: true, moveRuleDownAlert: true, successMsg: 'Selected condition is moved down'});
    }

    toggleActive = (e, rule) => {
        e.preventDefault();
        console.log(`In toggleActive, rule =========> ${JSON.stringify(rule)}`);

        rule.enabled = !rule.enabled;
        console.log(`In toggleActive after change, rule =========> ${JSON.stringify(rule)}`);
        
        this.updateRule(rule);
        this.setState({changedFlag: true});
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
        console.log(`transformedData =========> ${JSON.stringify(transformedData)}`);
        return (
            <div className="rule-flex-container">
                <div className="decision-box" key={`case - ${index}`}>
                    <div className="tool-flex">
                        <div><a href="" onClick={(e) => this.editCondition(e, transformedData.index)}><FontAwesomeIcon icon={faPenToSquare} /></a></div>
                        <div><a href="" onClick={((e) => this.handleRemoveCondition(e, transformedData.index))}><FontAwesomeIcon icon={faTrash} /></a></div>
                    </div>
                    <Tree treeData={transformedData.node} count={transformedData.depthCount} />
                    {transformedData.event.params && <div className="view-params-container">
                        <h4>Params  </h4>
                        <ViewAttribute items={transformedData.event.params} />
                    </div>}
                </div>
            </div>)
    }

    render() {
        const { outcomes } = this.props;
        const { showCase} = this.state;
        const {sortedRules} = this.state;
        
        console.log(`sortedRules =========> ${JSON.stringify(sortedRules)}`);
        const conditions = Object.keys(sortedRules).map((key) =>
        (<div key={key}>
            <PanelBox className={'boolean'}>
                <div className="enable">
                    <input type="checkbox" checked={sortedRules[key].enabled} onChange={((e) => this.toggleActive(e, sortedRules[key]))}/>
                    <label style={{ fontSize: '0.8em' }}>{sortedRules[key].enabled ? 'Enabled' : 'Disabled'}</label>
                </div>
                <div className="index">{Number(key) + 1}</div>
                <div className="name">{String(sortedRules[key].ruleName)}</div>
                {/* <div className="type">conditions <span className="type-badge">{Object.keys(sortedRules[key].conditions).length}</span></div> */}
                <div className="move">
                    <a href="" onClick={((e) => this.moveRuleUp(e, sortedRules[key].ruleIndex))}>Up</a>
                    <a href="" onClick={((e) => this.moveRuleDown(e, sortedRules[key].ruleIndex))}>Down</a>
                </div>
                <div className="menu">
                    <a href="" onClick={(e) => this.handleExpand(e, key)}> {showCase[key].case ? 'Collapse' : 'View Conditions'}</a>
                    <a href="" onClick={((e) => this.handleRemoveCondition(e, String(key)))}>Remove</a>
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
    moveUp: () => false,
    moveDown: () => false,
    updateRule: () => false,
    outcomes: {},
});

DecisionDetails.propTypes = ({
    decisions: PropTypes.array,
    editCondition: PropTypes.func,
    removeCase: PropTypes.func,
    removeDecisions: PropTypes.func,
    moveUp: PropTypes.func,
    moveDown: PropTypes.func,
    updateRule: PropTypes.func,
    outcomes: PropTypes.object,
});

export default DecisionDetails;