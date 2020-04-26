import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import Search from '../search/search';

class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.reset = this.reset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.state={submitAlert: false, resetAlert:false, successAlert: false};
    }

    handleSubmit() {
        this.setState({submitAlert: true});
    }

    handleReset() {
        this.setState({resetAlert: true});
    }

    handleSearch(value) {
        this.props.searchTxt(value);
    }

    cancelAlert = () => {
        this.setState({submitAlert: false, resetAlert: false, successAlert: false});
    }

    submit = () => {
        this.props.submit();
        this.setState({submitAlert: false, successAlert: true, successMsg: 'Your changes are submiited'});
    }

    reset = () => {
        this.props.reset();
        this.setState({resetAlert: false, successAlert: true, successMsg: 'Your changes are reset'});
    }

    alert = () => {
       return (<div>
            {this.state.submitAlert && this.submitAlert()}
            {this.state.resetAlert && this.resetAlert()}
            {this.state.successAlert && this.successAlert()}
        </div>);
    }

    submitAlert = () => {
        return (<SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Submit it!"
            confirmBtnBsStyle="success"
            title="Submit your changes?"
            onConfirm={this.submit}
            onCancel={this.cancelAlert}
            focusCancelBtn
          >
            Your changes will be generated as ruleset files in your directory!!
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

    resetAlert = () => {
        return (<SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Reset it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={this.reset}
            onCancel={this.cancelAlert}
            focusCancelBtn
          >
            You will not be able to recover the changes!
          </SweetAlert>)
    }


    render() {
        return (<div className="attributes-header">
            {this.alert()}
            <div className="attr-link" onClick={this.props.handleAdd}>
                <span className="plus-icon" /><span className="text">Add</span> 
            </div>
            <div className="attr-link" onClick={this.handleReset}>
                 <span className="reset-icon" /><span className="text">Reset</span> 
            </div>
            <div><Search onConfirm={this.handleSearch} onChange={this.handleSearch}/></div>
        </div>)
    }
}




ToolBar.defaultProps = ({
    handleAdd: () => false,
    submit: () =>  false,
    reset: () =>  false,
    searchTxt: () => false,
});

ToolBar.propTypes = ({
    handleAdd: PropTypes.func,
    submit: PropTypes.func,
    reset: PropTypes.func,
    searchTxt: PropTypes.func,
});

export default ToolBar;