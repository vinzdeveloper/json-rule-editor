import React, { Component } from 'react';
import NavButton from '../button/nav-button';
import NavLinks from './navigation-link';
import links from '../../data-objects/nav-links.json';

class NavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleNavBtn() {

    }

    render() {

        return (
            <div className="nav-container">
                <NavLinks links={links.links} iconClass={links.links.iconClass} />
                <NavButton label="Create Ruleset" onConfirm={this.handleNavBtn} classname={'nav-glass-btn'} />
            </div>
        )
    }
}

export default NavigationPanel;