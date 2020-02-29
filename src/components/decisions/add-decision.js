import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import operator from '../../data-objects/operator.json';
import Table from '../table/table';
import decisionValidations from '../../validations/decision-validation';
import {DATA_TYPES} from '../../constants/data-types';


class AddDecision extends Component {
    constructor(props) {
        super(props);
        const attributes = props.attributes.map(attribute => {
            if (props.editDecision) {
                return ({...attribute, operator: attribute.operator, error: {}, value: attribute.value});
            }
            else {
                return ({...attribute, operator: 'any', error: {}, value: ''});
            }
        });
        const outcome = { ...props.outcome, error: {}};
        this.state = { attributes, outcome };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeOutcomeType = this.onChangeOutcomeType.bind(this);
        this.onChangeOutcomeValue = this.onChangeOutcomeValue.bind(this);
    }

    handleAdd() {
        const error = decisionValidations(this.state.attributes, this.state.outcome);

        if (error.formError) {
            return '';
        }

        if (error.attributes.length > 0 || Object.keys(error.outcome).length > 0) {

            const attributes = this.state.attributes.map(attribute => {
                const errorAttr = error.attributes.find(attr => attr.name === attribute.name) || {};
                return { ...attribute, error: errorAttr };
            });
            const outcome = { ...this.state.outcome, error: error.outcome };
            this.setState({attributes, outcome});

        } else {
            this.props.addCase(this.state.attributes, this.state.outcome);
        }
    }

    handleCancel() {
        this.props.cancel();
    }

    onChangeValue(e, index) {
        const attribute = this.state.attributes[index];
        attribute.value = e.target.value;
        const attributes = [ ...this.state.attributes.slice(0, index), attribute, ...this.state.attributes.slice(index + 1)];
        this.setState({attributes});
     }
 
     onChangeType(e, index) {
        const attribute = this.state.attributes[index];
        attribute.operator = e.target.value;
        const attributes = [ ...this.state.attributes.slice(0, index), attribute, ...this.state.attributes.slice(index + 1)];
        this.setState({attributes});
     }

     onChangeOutcomeType(e) {
        const outcome = this.state.outcome;
        outcome.type = e.target.value;
        this.setState({outcome});
     }

     onChangeOutcomeValue(e){
        const outcome = this.state.outcome;
        outcome.value = e.target.value;
        this.setState({outcome});
     }

     renderOutputField(type) {
        if (type === DATA_TYPES.BOOLEAN) {
            return <SelectField options={['true', 'false']} onChange={this.onChangeOutcomeValue}
            value={this.state.outcome.value} error={this.state.outcome.error.value} readOnly={this.props.editDecision}/>
        } else {
            return <InputField onChange={this.onChangeOutcomeValue} value={this.state.outcome.value}
             error={this.state.outcome.error.value} readOnly={this.props.editDecision} />
        }
     }

    attributeItems = () => {
        const { attributes } = this.state;

        const formElements = attributes.map((attribute, index) =>
            (<tr key={attribute.name}>
                <td>{attribute.name}</td>
                <td><SelectField options={operator[attribute.type]} onChange={(e) => this.onChangeType(e, index)}
                     value={attribute.operator} error={attribute.error.operator} /></td>
                <td><InputField onChange={(value) => this.onChangeValue(value, index)} value={attribute.value}
                     readOnly={attribute.operator === 'any'} error={attribute.error.name}/></td>
            </tr>)
        );
        const outcome = (<tr>
                <td>Outcome</td>
                <td><SelectField options={Object.keys(operator)} onChange={this.onChangeOutcomeType}
                     value={this.state.outcome.type} error={this.state.outcome.error.type} readOnly={this.props.editDecision}/></td>
                <td>{this.renderOutputField(this.state.outcome.type)}</td>
        </tr>);

        return (<Table columns={['Name', 'Operator', 'Value']}>
                     {formElements}
                     <tr><td colSpan={3}><hr /></td></tr>
                     {outcome}
                     <tr><td colSpan={3}><hr /></td></tr>
            </Table>)
    }

    rulecasePanel = () => {

    }


    render() {
        const { buttonProps } = this.props;
        return (<Panel>
            <form>
                <div className="add-rulecase-wrapper">
                    {this.attributeItems()}
                    <div className="btn-group">
                    <Button label={buttonProps.primaryLabel} onConfirm={this.handleAdd} classname="primary-btn" type="submit" />
                    <Button label={buttonProps.secondaryLabel} onConfirm={this.handleCancel} classname="cancel-btn"/>
                    </div>
                    
                </div>
            </form>
        </Panel>);
    }
}

AddDecision.defaultProps = ({
    addCase: () => false,
    cancel: () => false,
    attribute: {},
    buttonProps: {},
    attributes: [],
    outcome: {},
    editDecision: false,
});

AddDecision.propTypes = ({
    addCase: PropTypes.func,
    cancel: PropTypes.func,
    attribute: PropTypes.object,
    buttonProps: PropTypes.object,
    attributes: PropTypes.array,
    outcome: PropTypes.object,
    editDecision: PropTypes.bool,
});


export default AddDecision;