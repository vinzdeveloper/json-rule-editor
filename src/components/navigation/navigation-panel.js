import React, { Component } from 'react';
import NavButton from '../button/nav-button';
import NavLinks from './navigation-link';
// import links from '../../data-objects/nav-links.json';
import PropTypes from 'prop-types';
import { createHashHistory } from 'history';

class NavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {links: []};
        this.handleNavLink = this.handleNavLink.bind(this);
        this.handleNavBtn = this.handleNavBtn.bind(this);
    }

    handleNavBtn() {
        const history = createHashHistory();
        history.push('./create-ruleset');
    }

    handleNavLink(name) {
        const history = createHashHistory();
        this.props.setActiveRulesetIndex(name);
        history.push('./ruleset');

    }

    render() {
        const { closedState } = this.props;
        const rulesetLink = this.props.rulenames.length > 0 ?
         {name: 'Ruleset', sublinks: this.props.rulenames, iconClass:"rules-icon"}: undefined;

        return (
            <div className={`nav-container ${closedState || !rulesetLink ? 'closed': 'open'}`}>
                {!closedState && rulesetLink && <React.Fragment>
                    <NavLinks links={[rulesetLink]} onConfirm={this.handleNavLink}/>
                    <NavButton label="Create Ruleset" onConfirm={this.handleNavBtn} classname={'nav-glass-btn'} />
                 </React.Fragment>
                }
            </div>
        )
    }
}

NavigationPanel.defaultProps = {
    closedState: false,
    rulenames: [],
    setActiveRulesetIndex: () => false,
};

NavigationPanel.propTypes = {
    closedState: PropTypes.bool,
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
}

export default NavigationPanel;