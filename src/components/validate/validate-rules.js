import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import Table from '../table/table';
import { DATA_TYPES } from '../../constants/data-types';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';

class ValidateRules extends Component {

    constructor(props) {
        super(props);
        this.state = { attributes: [], conditions: [{name: '', value: ''}], message: Message.NO_VALIDATION_MSG};
        this.handleAttribute = this.handleAttribute.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.validateRules = this.validateRules.bind(this);
    }

    handleAttribute(e, index) {
        const attribute = { ...this.state.conditions[index], name: e.target.value };
        const conditions = [ ...this.state.conditions.slice(0, index), attribute, ...this.state.conditions.slice(index + 1)];
        this.setState({ conditions });
    }

    handleValue(e, index) {
        const attribute = { ...this.state.conditions[index], value: e.target.value };
        const conditions = [ ...this.state.conditions.slice(0, index), attribute, ...this.state.conditions.slice(index + 1)];
        this.setState({ conditions });
    }

    handleAdd() {
        this.setState({ conditions: this.state.conditions.concat([{name: ''}])});
    }

    validateRules() {
        this.props.validateRules(this.state.conditions);
    }

    renderValueField(condition, index) {
        const { attributes } = this.props;
        let type = '';
        if (condition.name) {
            const attribute = attributes.find(attribute => attribute.name === condition.name);
            type = attribute && attribute.type;
        }
        if (type === DATA_TYPES.BOOLEAN) {
            return <SelectField options={['true', 'false']} onChange={e => this.handleValue(e, index)}
            value={condition.value} />
        } else {
            return <InputField onChange={e => this.handleValue(e, index)} value={condition.value} />
        }
     }


    attributeItems = () => {
        const { conditions } = this.state;
        const { attributes } = this.props;
        const options = attributes.map(att => att.name);

        const formElements = conditions.map((condition, index) =>
            (<tr key={condition.name + index || 'item'+index}>
                <td><SelectField options={options} onChange={(e) => this.handleAttribute(e, index)}
                     value={condition.name} /></td>
                <td>{this.renderValueField(condition, index)}</td>
                { index === conditions.length -1 &&
                 <td className="attributes-header">
                    <div className="attr-link" onClick={this.handleAdd}>
                        <span className="plus-icon" /><span className="text">Add</span> 
                    </div>
                    <div>
                    <Button label={'Validate Decision'} onConfirm={this.validateRules} classname="primary-btn" type="submit" />
                    </div>
                 </td>}
            </tr>)
        );
        const outcome = (<tr>
                <td>Outcome</td>
                <td>True</td>
        </tr>);

        return (<Table columns={['Name', 'Value']}>
                     {formElements} 
                     <tr><td colSpan={3}><hr /></td></tr>
                     {outcome}
                     <tr><td colSpan={3}><hr /></td></tr>  
            </Table>)
    }

    render() {
        return (<React.Fragment>
        {this.props.decisions.length < 1 && <Banner message={this.state.message}/> }
        {
        <Panel>
            <form>
                <div className="add-rulecase-wrapper">
                    {this.attributeItems()}
                </div>
            </form>
        </Panel>}
        </React.Fragment>);
    }
}

ValidateRules.defaultProps = ({
    attributes: [],
    decisions: [],
    validateRules: () => false,
});

ValidateRules.propTypes = ({
    attributes: PropTypes.array,
    decisions: PropTypes.array,
    validateRules: PropTypes.func,
});

export default ValidateRules;