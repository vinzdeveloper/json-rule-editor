import React, { Component } from 'react';
import Notification from '../notification/notification';
import { RULE_ERROR } from '../../constants/messages';
import PropTypes from 'prop-types';

class RuleErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        this.setState({ hasError:  true });
    }

    render() {
        return (<React.Fragment>
            {this.state.hasError && 
                <Notification heading={RULE_ERROR.heading} body={RULE_ERROR.body} type={RULE_ERROR.type} />}
            {this.props.children}
        </React.Fragment>)
    }
}

RuleErrorBoundary.defaultProps = {
    children: undefined,
};

RuleErrorBoundary.propTypes = {
    children: PropTypes.any,
};

export default RuleErrorBoundary;