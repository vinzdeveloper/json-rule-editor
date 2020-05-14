import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import attributeValidations from '../../validations/attribute-validations';
import dataTypes from '../../data-objects/operator.json';

class AddAttributes extends Component {

    constructor(props) {
        super(props);
        this.state = {error: {}, name: props.attribute.name, type: props.attribute.type};
        this.handleCancel = this.handleCancel.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    onChangeName(e) {
       this.setState({name: e.target.value});
    }

    onChangeType(e) {
        this.setState({type: e.target.value});
    }

    handleAdd(e) {
        e.preventDefault();
        const error = attributeValidations({name: this.state.name, type: this.state.type});
        
        if (Object.keys(error).length > 0) {
            this.setState({error});
        } else {
            this.props.addAttribute({name: this.state.name, type: this.state.type});
        }
    }

    handleCancel() {
        this.props.cancel();
    }
    
    render() {
        const { buttonProps } = this.props;
        const attribute_types = Object.keys(dataTypes);
        return (<Panel>
            <form>
                <div className="add-attribute-wrapper">
                    <div className='form-groups-inline'>
                        <InputField label="Name" onChange={this.onChangeName} value={this.props.attribute.name} error={this.state.error.name} />
                        <SelectField label="Type" options={attribute_types} onChange={this.onChangeType} value={this.props.attribute.type} error={this.state.error.type} />
                    </div>
                    <div className="btn-group">
                        <Button label={buttonProps.primaryLabel} onConfirm={this.handleAdd} classname="primary-btn" type="submit" />
                        <Button label={buttonProps.secondaryLabel} onConfirm={this.handleCancel} classname="cancel-btn"/>
                    </div>
                </div>
            </form>
        </Panel>);
    }
}


AddAttributes.defaultProps = ({
    addAttribute: () => false,
    cancel: () => false,
    attribute: {},
    buttonProps: {},
});

AddAttributes.propTypes = ({
    addAttribute: PropTypes.func,
    cancel: PropTypes.func,
    attribute: PropTypes.object,
    buttonProps: PropTypes.object,
});

export default AddAttributes;

