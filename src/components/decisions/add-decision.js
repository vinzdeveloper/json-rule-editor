import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import ButtonGroup from '../button/button-groups';
import operator from '../../data-objects/operator.json';
import paramsOptions from '../../data-objects/params.json';
import decisionValidations from '../../validations/decision-validation';
import Tree from '../tree/tree';
import { has } from 'lodash/object';
import { getNodeDepthDetails, getNodeDepth } from '../../utils/treeutils';
import { transformTreeToRule } from '../../utils/transform';
import { sortBy } from 'lodash/collection';
import { validateAttribute } from '../../validations/decision-validation';
import { PLACEHOLDER } from '../../constants/data-types';
import ApperanceContext from '../../context/apperance-context';


const nodeStyle ={
    shape: 'circle',
    shapeProps: {
        fill: '#1ABB9C',
        r: 10,
    },
  };

const factsButton = [{ label : 'Add Facts', disable: false },
                     { label : 'Add All', disable: false },
                     { label : 'Add Any', disable: false },
                     { label : 'Remove', disable: false }];

const topLevelOptions = [{ label : 'All', active: false, disable: false },
                         { label : 'Any', active: false, disable: false }];

const outcomeOptions = [{ label : 'Add Outcome', active: false, disable: false },
                        { label : 'Edit Conditions', active: false, disable: false }];

class AddDecision extends Component {
    constructor(props) {
        super(props);

        const outcome = props.editDecision ? props.outcome : ({ value: '', error: {}, params: []});
        const addAttribute = { error: {}, name: '', operator: '', value: ''};
        const node = props.editDecision ? props.editCondition.node : {};
        const activeNode = { index: 0, depth: 0 };
        const eventTypes = paramsOptions["event-type"];

        this.state = {
            attributes: props.attributes,
            outcome: [{
                index: 0,
                value: eventTypes.length > 0 ? eventTypes[0] : '',
                error:{},
                params: []
            }],
            addAttribute,
            enableTreeView: props.editDecision,
            enableFieldView: false,
            enableOutcomeView: false,
            node,
            metadata: { 
                ruleName: '', 
                description: '', 
                enabled: true, 
                ruleIndex: 0
            },
            topLevelOptions,
            factsButton: factsButton.map(f => ({ ...f, disable: true })),
            outcomeOptions: outcomeOptions.map(f => ({ ...f, disable: true })),
            formError: '',
            addPathflag: false,
            activeNodeDepth: [activeNode]
        };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onChangeNewFact = this.onChangeNewFact.bind(this);
        this.onChangeOutcomeValue = this.onChangeOutcomeValue.bind(this);
        this.handleTopNode = this.handleTopNode.bind(this);
        this.handleActiveNode = this.handleActiveNode.bind(this);
        this.handleChildrenNode = this.handleChildrenNode.bind(this);
        this.handleFieldCancel = this.handleFieldCancel.bind(this);
        this.handleOutputPanel = this.handleOutputPanel.bind(this);
        this.handleOutputParams = this.handleOutputParams.bind(this);
        this.addParams = this.addParams.bind(this);
        this.addPath = this.addPath.bind(this);
        this.addOutcome = this.addOutcome.bind(this);
        this.mergeEvent = this.mergeEvent.bind(this);
    }

    handleAdd(e) {
        e.preventDefault();
        console.log(`Printing props =========> ${JSON.stringify(this.props)}`);
        const errors = this.state.outcome.map(outcome => decisionValidations(this.state.node, outcome));
        const formError = errors.some(error => error.formError);

        if (formError) {
            const updatedOutcomes = this.state.outcome.map((outcome, index) => ({ ...outcome, error: errors[index].outcome }));
            this.setState({ formError, outcome: updatedOutcomes });
        } else {
            const conditions = this.state.outcome.map((outcome, index) => {
                let outcomeParams = {};
                outcome.params.forEach(param => {
                    outcomeParams[param.pkey] = param.pvalue;
                    console.log(`param: param.pkey: ${param.pkey}; param.pvalue: ${param.pvalue}`);
                })
                console.log(`Printing outcome params ==========> ${JSON.stringify(outcomeParams)}`);
                return transformTreeToRule(this.state.node, outcome, outcomeParams);
                //return event;
            });
            console.log(`Printing new events =========> ${JSON.stringify(conditions)}`);
    
            const mergedConditions = this.mergeEvent(conditions);
            console.log(`Printing mergedConditions =========> ${JSON.stringify(mergedConditions)}`);
            console.log(`Printing metadata =========> ${JSON.stringify(this.state.metadata)}`);
            this.props.addCondition(mergedConditions, this.state.metadata);
            //conditions.forEach(condition => this.props.addCondition(condition));
        }
    }

    mergeEvent(conditions) {
        let merged = []
        let firstCondition = conditions[0];

        firstCondition.event = [firstCondition.event];

        for (let i = 1; i < conditions.length; i++) {
            firstCondition.event.push(conditions[i].event);
        }
        firstCondition.event = firstCondition.event.map((event, index) => ({ ...event, index: index + 1 }));

        merged.push(firstCondition);
        return merged;
    }

    handleCancel() {
        this.props.cancel();
    }
 
     onChangeNewFact(e, name) {
         const addAttribute = { ...this.state.addAttribute };
         addAttribute[name] = e.target.value;
         this.setState({ addAttribute });
     }

     onChangeOutcomeValue(e, type, index){
        const outcomes = [...this.state.outcome];
        outcomes[index][type] = e.target.value;
        this.setState({ outcome:outcomes });
     }

     addParams(outcomeIndex) {
        const { outcome: outcomes } = this.state;
        const newParams = outcomes[outcomeIndex].params.concat({ pkey: '', pvalue: '' });
        outcomes[outcomeIndex].params = newParams;
        this.setState({ outcome: outcomes});
     }

     addPath() {
        this.setState({ addPathflag: true });
     }

     addOutcome = () => {
        this.setState(prevState => {
            const lastIndex = prevState.outcome.length > 0 ? prevState.outcome[prevState.outcome.length - 1].index : -1;
            console.log(`Printing lastIndex =========> ${lastIndex}`);
            return {
                outcome: [...prevState.outcome, { value: '', params: [], index: lastIndex + 1 }],
            };
        });
    }

     handleOutputParams(e, type, index, outcomeIndex){
        console.log(`Printing index =========> ${index}`);
        console.log(`Printing outcomeIndex =========> ${outcomeIndex}`);
        console.log(`Printing type =========> ${type}`);
        console.log(`Printing e.target.value =========> ${e.target.value}`);
         const { outcome:outcomes } = this.state;
         const paramOption = paramsOptions["param-type"];
         const params = [ ...outcomes[outcomeIndex].params ];
         const newParams = params.map((param, ind) => {
             if (index === ind) {
                if (type === 'pvalue' && !param.pkey && e.target.value) {
                    return { ...param, pkey: paramOption[0], [type]: e.target.value };
                } else {
                    return { ...param, [type]: e.target.value };
                }
             }
             return param;
         });
         outcomes[outcomeIndex].params = newParams;
         console.log(`Printing outcomes =========> ${JSON.stringify(outcomes)}`);
         this.setState({outcome: outcomes});
     }

    handleTopNode(value) {
        let parentNode = { ...this.state.node};
        const activeNode = { index: 0, depth: 0 };
        if (has(parentNode, 'name')) {
            parentNode.name = value === 'All' ? 'all' : 'any';
        } else {
            parentNode = { name: value === 'All' ? 'all' : 'any', nodeSvgShape: nodeStyle, children: [] };
        }
        const topLevelOptions = this.state.topLevelOptions.map(option => {
            if (option.label === value) {
                return { ...option, active: true};
            }
            return { ...option, active: false};
        })

        const factsButton = this.state.factsButton.map(button => ({ ...button, disable: false }));
        const outcomeOptions = this.state.outcomeOptions.map(button => ({ ...button, disable: false }));

        this.setState({ enableTreeView: true, topNodeName: value, node: parentNode,
             activeNodeDepth: [activeNode], topLevelOptions, factsButton, outcomeOptions });
    }

    mapNodeName(val) {
        const node = {};
        const { addAttribute: { name, operator, value, path }, attributes } = this.state;
        if (val === 'Add All' || val === 'Add Any') {
            node['name'] = val === 'Add All' ? 'all' : 'any';
            node['nodeSvgShape'] = nodeStyle;
            node['children'] = [];
        } else {
            node['name'] = name;
            let factValue = value.trim();
            const attProps = attributes.find(att => att.name === name);
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

    handleChildrenNode(value) {
        let factOptions = [ ...factsButton];
        if (value === 'Add Facts') {
            this.setState({enableFieldView: true});
        } else {
            const { activeNodeDepth, node, attributes } = this.state;
            const addAttribute = { error: {}, name: '', operator: '', value: ''};
            if (value === 'Add fact node') {
                const error = validateAttribute(this.state.addAttribute, attributes);
                if (Object.keys(error).length > 0 ) {
                    let addAttribute = this.state.addAttribute;
                    addAttribute.error = error;
                    this.setState({addAttribute});
                    return undefined;
                }
            }
            if (activeNodeDepth && node) {
                const newNode = { ...node };

                const getActiveNode = (pNode, depthIndex) => pNode[depthIndex];
                
                let activeNode = newNode;
                const cloneDepth = value === 'Remove' ? activeNodeDepth.slice(0, activeNodeDepth.length -1 ): [ ...activeNodeDepth ] 
                cloneDepth.forEach(nodeDepth => {
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
                    factOptions = this.state.factsButton.map(button =>
                        ({ ...button, disable: true }));
                }
                
                this.setState({node: newNode, enableFieldView: false, addAttribute, factsButton: factOptions});
            }
        }
    }


    handleActiveNode(node) {
        const depthArr = getNodeDepthDetails(node);
        const sortedArr = sortBy(depthArr, 'depth');

        const factsNodemenu = this.state.factsButton.map(button => {
            if (button.label !== 'Remove') {
                return { ...button, disable: true };
            }
            return { ...button, disable: false };
        });

        const parentNodeMenu = this.state.factsButton.map(button => {
            if (sortedArr.length < 1 && button.label === 'Remove') {
                return { ...button, disable: true };
            }
            return { ...button, disable: false };
        });
        
        const facts = node.name === 'all' || node.name === 'any' ? parentNodeMenu : factsNodemenu;
        const outcomeMenus = outcomeOptions.map(option => ({ ...option, disable: false }));
        this.setState({ activeNodeDepth: sortedArr, factsButton: facts, outcomeOptions: outcomeMenus });
    }

    handleFieldCancel() {
        const addAttribute = { error: {}, name: '', operator: '', value: ''};
        this.setState({ enableFieldView: false, addAttribute });
    }

    handleOutputPanel(value) {
        if(value === 'Add Outcome') {
            const factsOptions = this.state.factsButton.map(fact => ({ ...fact, disable: true }))
            const options = this.state.outcomeOptions.map(opt => {
                if(opt.label === 'Add Outcome') {
                    return { ...opt, active: true };
                }
                return { ...opt, active: false };
            });
            this.setState({ enableOutcomeView: true, enableTreeView: false,
                 enableFieldView: false, outcomeOptions: options, factsButton: factsOptions });
        }
        if(value === 'Edit Conditions') {
            const options = this.state.outcomeOptions.map(opt => {
                if(opt.label === 'Edit Conditions') {
                    return { ...opt, active: true };
                }
                return { ...opt, active: false };
            });
            this.setState({ enableOutcomeView: false, enableTreeView: true, enableFieldView: false, outcomeOptions: options });
        }
    }

    topPanel() {
        const { topLevelOptions, factsButton, outcomeOptions, metadata } = this.state;
        console.log(`Printing node =========> ${JSON.stringify(this.state.node)}`);
        return (<div className="add-decision-step">
            <div className="step0">
                <div>Rule Name:</div>
                <InputField
                    value={metadata.ruleName}
                    onChange={(e) => {
                        const newMetadata = { ...this.state.metadata, ruleName: e.target.value };
                        this.setState({ metadata: newMetadata });
                    }}
                />
            </div>
            <div className="step1"><div>Step 1: Add Toplevel</div><ButtonGroup buttons={topLevelOptions} onConfirm={this.handleTopNode} /></div>
            <div className="step2"><div> Step 2: Add / Remove facts</div><ButtonGroup buttons={factsButton} onConfirm={this.handleChildrenNode} /></div>
            <div className="step3"><div> Step 3: Add Outcome</div><ButtonGroup buttons={outcomeOptions} onConfirm={this.handleOutputPanel} /></div>
        </div>)
    }

    fieldPanel() {
        const { attributes, addAttribute, addPathflag} = this.state;
        const attributeOptions = attributes.map(attr => attr.name);
        const attribute = addAttribute.name && attributes.find(attr => attr.name === addAttribute.name);
        const operatorOptions = attribute && operator[attribute.type];
        const { background } = this.context;

        const placeholder = addAttribute.operator === 'contains' || addAttribute.operator === 'doesNotContain' ?
         PLACEHOLDER['string'] : PLACEHOLDER[attribute.type]

        return (<Panel>
            
            <div className={`attributes-header ${background}`}>
                    <div className="attr-link" onClick={this.addPath}>
                        <span className="plus-icon" /><span className="text">Add Path</span> 
                    </div>
            </div>

            <div className="add-field-panel">
                <div><SelectField options={attributeOptions} onChange={(e) => this.onChangeNewFact(e, 'name')}
                        value={addAttribute.name} error={addAttribute.error.name} label="Facts"/></div>
                <div><SelectField options={operatorOptions} onChange={(e) => this.onChangeNewFact(e, 'operator')}
                        value={addAttribute.operator} error={addAttribute.error.operator} label="Operator"/></div>
                <div><InputField onChange={(value) => this.onChangeNewFact(value, 'value')} value={addAttribute.value}
                        error={addAttribute.error.value} label="Value" placeholder={placeholder}/></div>
            </div>

            { addPathflag && <div className="add-field-panel half-width">
                <div>
                    {/*<InputField onChange={(value) => this.onChangeNewFact(value, 'path')} value={addAttribute.path}
                        label="Path" placeholder={"Enter path value - dont give prefix ' . ' "}/> */}
                    <SelectField options={attributeOptions} onChange={(e) => this.onChangeNewFact(e, 'path')}
                        value={addAttribute.path} label="Path"/>
                </div>
            </div> }

            <div className="btn-group">
                    <Button label={'Add'} onConfirm={() => this.handleChildrenNode('Add fact node') } classname="btn-toolbar" type="submit" />
                    <Button label={'Cancel'} onConfirm={this.handleFieldCancel} classname="btn-toolbar"/>
            </div>
        </Panel>)
    }

    outputPanel() {
        const { outcome:outcomes } = this.state;
        console.log(`Printing outcomes =========> ${JSON.stringify(outcomes)}`);
        const { editDecision } = this.props;
        const { background } = this.context;
        const paramOptions = paramsOptions["param-type"];
        const eventTypes = paramsOptions["event-type"];


        return (<Panel>

            <div className={`attributes-header ${background}`}>
                <div className="attr-link" onClick={() => this.addOutcome()}>
                    <span className="plus-icon" /><span className="text">Add More Outcome</span>
                </div>
            </div>
            
            {outcomes.map((outcome, index) => (
                <div key={index}>
                    <div className="add-field-panel half-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <SelectField options={eventTypes} onChange={(e) => this.onChangeOutcomeValue(e, 'value', index)} readOnly={editDecision} />
                        </div>
                        <div className={`attributes-header ${background}`}>
                            <div className="attr-link" onClick={() => this.addParams(index)} style={{ marginRight: '10px' }}>
                                <span className="plus-icon" /><span className="text">Add Params</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {outcome.params.length > 0 && outcome.params.map((param, ind) =>
                            <div key={ind} className="add-field-panel" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px' }}>Key</label>
                                    <select value={param.pkey} onChange={(e) => this.handleOutputParams(e, 'pkey', ind, index)}>
                                        {paramOptions.map((option, index) =>
                                            <option key={index} value={option}>{option}</option>
                                        )}
                                    </select>
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginRight: '10px' }}>Value</label>
                                    <InputField onChange={(value) => this.handleOutputParams(value, 'pvalue', ind, index)} value={param.pvalue} />
                                </div>
                            </div>)}
                    </div>
                </div>
            ))}
            
        </Panel>)
    }

    treePanel() {
        const { node } = this.state;
        const depthCount = getNodeDepth(node);

        return(<Panel>
                <Tree treeData={node} count={depthCount} onConfirm={this.handleActiveNode} />
            </Panel>)
    }


    addPanel() {
        const { enableTreeView, enableFieldView, enableOutcomeView } = this.state;

        return (<div>
            {this.topPanel()}
            {enableFieldView && this.fieldPanel()}
            {enableOutcomeView && this.outputPanel()}
            {enableTreeView && this.treePanel()}
        </div>);

    }

    render() {
        const { buttonProps } = this.props;
        return (
            <form>
                <div className="add-rulecase-wrapper">
                    {this.addPanel()}
                    {this.state.formError && <p className="form-error"> {this.state.formError}</p>}
                    <div className="btn-group">
                        <Button label={buttonProps.primaryLabel} onConfirm={this.handleAdd} classname="primary-btn" type="submit" />
                        <Button label={buttonProps.secondaryLabel} onConfirm={this.handleCancel} classname="cancel-btn"/>
                    </div>
                    
                </div>
            </form>
        );
    }
}

AddDecision.contextType = ApperanceContext;

AddDecision.defaultProps = ({
    addCondition: () => false,
    cancel: () => false,
    attribute: {},
    buttonProps: {},
    attributes: [],
    outcome: {},
    editDecision: false,
    editCondition: {}
});

AddDecision.propTypes = ({
    addCondition: PropTypes.func,
    cancel: PropTypes.func,
    attribute: PropTypes.object,
    buttonProps: PropTypes.object,
    attributes: PropTypes.array,
    outcome: PropTypes.object,
    editDecision: PropTypes.bool,
    editCondition: PropTypes.object
});


export default AddDecision;