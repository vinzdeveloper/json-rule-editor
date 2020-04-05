import React from 'react';
import {HashRouter, Switch, Route } from 'react-router-dom';
import HomeContainer from '../containers/home/home-container';
import RulesetContainer from '../containers/ruleset/ruleset-container';
import CreateRulesetContainer from '../containers/ruleset/create-ruleset-container';
import PropTypes from 'prop-types';

const AppRoutes = (props) => {

    return (<div className={`main-container ${props.closedState ? 'closed': 'open'}`}>
        <HashRouter>
            <Switch>
                <Route path="/" exact component={HomeContainer} />
                <Route path="/ruleset" exact component={RulesetContainer} />
                <Route path="/create-ruleset" exact component={CreateRulesetContainer} />
            </Switch>   
        </HashRouter>
    </div>);

};

AppRoutes.defaultProps = {
    closedState: false,
};

AppRoutes.propTypes = {
    closedState: PropTypes.bool,
}

export default AppRoutes;