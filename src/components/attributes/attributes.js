import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddAttributes from './add-atrribtues';
import AttributeDetails from './attr-details';
import ToolBar from '../toolbar/toolbar';

class Attributes extends Component {

    constructor(props){
        super(props);
        this.state={showAddAttr: false};
        this.handleAdd = this.handleAdd.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleSearch = () => {

    }

    handleAdd = () => {
        this.setState({showAddAttr: true});
    }

    addAttribute = (attribute) => {
        this.setState({showAddAttr: false});
        this.props.handleAttribute('ADD', attribute);
    }

    handleReset() {
        this.props.handleAttribute('RESET');
    }

    cancelAddAttribute = () => {
        this.setState({showAddAttr: false});
    }

    render() {
        const buttonProps = { primaryLabel: 'Add Attribute', secondaryLabel: 'Cancel'};
        return (<div className="attributes-container">
            <ToolBar handleAdd={this.handleAdd} reset={this.handleReset} />
            {this.state.showAddAttr && <AddAttributes addAttribute={this.addAttribute} cancel={this.cancelAddAttribute} buttonProps={buttonProps} />}
            {<AttributeDetails attributes={this.props.attributes} updateAttribute={this.props.handleAttribute} removeAttribute={this.props.handleAttribute} />}

      </div>);
    }
}

Attributes.defaultProps = ({
    handleAttribute: () => false,
    attributes: [],
});

Attributes.propTypes = ({
    handleAttribute: PropTypes.func,
    attributes: PropTypes.array,
});

export default Attributes;