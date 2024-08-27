import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import Table from '../table/table';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { validateRuleset } from '../../validations/rule-validation';
import Loader from '../loader/loader';
import { ViewOutcomes } from '../attributes/view-attributes';

class ValidateRules extends Component {

    constructor(props) {
        super(props);
        const conditions = props.attributes.filter(attr => attr.type !== 'object' && ({ name: attr.name, value: ''}))
        this.state = { attributes: [],
             conditions,
             message: Message.NO_VALIDATION_MSG,
             loading: false,
             outcomes: [],
             error: false,
            };
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

    validateRules(e) {
        e.preventDefault();
        let facts = {};
        const { decisions, attributes } = this.props;
        this.setState({loading: true});
        this.state.conditions.forEach(condition => {
           const attrProps = attributes.find(attr => attr.name === condition.name);
           if (attrProps.type === 'number') {
            facts[condition.name] = Number(condition.value);
           } else if (condition.value && condition.value.indexOf(',') > -1) {
            facts[condition.name] = condition.value.split(',');
           } else {
            facts[condition.name] = condition.value;
           }
        })
        validateRuleset(facts, decisions).then(outcomes => {
            this.setState({loading: false, outcomes,  result: true, error: false, errorMessage: '',});
        }).catch((e) => {
            this.setState({loading: false, error: true, errorMessage: e.error, result: true, });
        });
    }

    attributeItems = () => {
        const { conditions, loading, outcomes, result, error, errorMessage } = this.state;
        const { attributes } = this.props;
        const options = attributes.map(att => att.name);

        const formElements = conditions.map((condition, index) =>
            (<tr key={condition.name + index || 'item'+index}>
                <td><SelectField options={options} onChange={(e) => this.handleAttribute(e, index)}
                     value={condition.name} readOnly/></td>
                <td colSpan='2'>{<InputField onChange={e => this.handleValue(e, index)} value={condition.value} />}</td>
            </tr>)
        );

        let message;
        if (result) {
            if (error) {
                message = <div className="form-error">Problem occured when processing the rules. Reason is {errorMessage}</div>
            } else if (outcomes && outcomes.length < 1) {
                message = <div>No results found</div>
            } else if (outcomes && outcomes.length > 0) {
                message = (<div className="view-params-container">
                                <h4>Outcomes  </h4>
                                <ViewOutcomes  items={outcomes}/>
                            </div>)
            } else {
                message = undefined;
            }
        }
        return (
        <React.Fragment>
            <Table columns={['Name', 'Value']}>
                     {formElements}
            </Table>
            <div className="btn-group">
               <Button label={'Validate Ruleset'} onConfirm={this.validateRules} classname="primary-btn" type="submit" />
           </div>
            <hr/>
                { loading && <Loader /> }
                { !loading && message }
        </React.Fragment>)
    }

    render() {
        return (<React.Fragment>
        {this.props.decisions.length < 1 && <Banner message={this.state.message}/> }
        {this.props.decisions.length > 0 &&
        <Panel>
            <form>
                <div>
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
});

ValidateRules.propTypes = ({
    attributes: PropTypes.array,
    decisions: PropTypes.array,
});

export default ValidateRules;