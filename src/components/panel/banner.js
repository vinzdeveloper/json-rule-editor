import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';

class Banner extends Component {

    constructor(props){
        super(props);
    }

    getButtonClass() {
        const { message } = this.props;
        switch (message.type) {
            case 'warning-panel':
                return 'btn-warning';
            case 'submit-panel':
                return 'btn-primary';
            default:
                return 'btn-dark';
        }
        
    }

    render() {
        const { message } = this.props;
        const btnClass = this.getButtonClass();
        return (<div className="banner-container">
                <div className={`banner ${message.type}`}>
                    <React.Fragment>
                        <div>
                        <header><b>{message.header}</b></header>
                            <p>{message.body}</p>
                        </div>
                        {message.buttonProps && <div><Button label={message.buttonProps.label} classname={btnClass} onConfirm={this.props.onConfirm} /></div>}
                    </React.Fragment>
                </div>
        </div>)
    }
}

Banner.defaultProps = {
    ruleset: {},
    message: {},
    onConfirm: () => false,
};

Banner.propTypes = {
    ruleset: PropTypes.object,
    message: PropTypes.object,
    onConfirm: PropTypes.func,
}

export default Banner;
