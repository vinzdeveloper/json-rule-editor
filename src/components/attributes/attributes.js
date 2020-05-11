import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddAttributes from './add-atrribtues';
import AttributeDetails from './attr-details';
import ToolBar from '../toolbar/toolbar';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { isContains } from '../../utils/stringutils';

class Attributes extends Component {

    constructor(props){
        super(props);
        this.state={showAddAttr: false, message: Message.NO_ATTRIBUTE_MSG, searchCriteria: '', bannerflag: false };
        this.handleAdd = this.handleAdd.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch = (value) => {
        this.setState({ searchCriteria: value})
    }

    handleAdd = () => {
        this.setState({showAddAttr: true, bannerflag: true });
    }

    addAttribute = (attribute) => {
        this.setState({showAddAttr: false});
        this.props.handleAttribute('ADD', attribute);
    }

    handleReset() {
        this.props.handleAttribute('RESET');
    }

    cancelAddAttribute = () => {
        this.setState({ showAddAttr: false, bannerflag: false });
    }

    filterAttribute = () => {
        const { searchCriteria } = this.state;
        const filteredAttributes = this.props.attributes.filter(att => isContains(att.name, searchCriteria) ||
            isContains(att.type, searchCriteria));
        return filteredAttributes;
    }

    render() {
        const { searchCriteria, bannerflag } = this.state;

        const buttonProps = { primaryLabel: 'Add Facts', secondaryLabel: 'Cancel'};

        const filteredAttributes = searchCriteria ? this.filterAttribute() : this.props.attributes;
        
        return (<div className="attributes-container">
            
            { <ToolBar handleAdd={this.handleAdd} reset={this.handleReset} searchTxt={this.handleSearch}/> }
            
            { this.state.showAddAttr && <AddAttributes addAttribute={this.addAttribute} cancel={this.cancelAddAttribute} buttonProps={buttonProps} /> }
            
            { <AttributeDetails attributes={filteredAttributes} updateAttribute={this.props.handleAttribute} removeAttribute={this.props.handleAttribute} /> }
            
            { !bannerflag && this.props.attributes.length < 1 && <Banner message={this.state.message} onConfirm={this.handleAdd}/> }

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