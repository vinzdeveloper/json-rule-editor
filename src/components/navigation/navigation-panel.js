import React, { Component } from 'react';
import NavLinks from './navigation-link';
import PropTypes from 'prop-types';
import { createHashHistory } from 'history';
import FooterLinks from '../footer/footer';
import footerLinks from '../../data-objects/footer-links.json';
import AppearanceContext from '../../context/apperance-context';

const navmenu = [{ name: 'Create Rules', navigate: './create-ruleset', iconClass: "icon fa fa-plus-square-o", linkClass: 'navmenu'},
                 { name: 'Upload Rules', navigate: './home', iconClass: "icon fa fa-cloud-upload", linkClass: 'navmenu' },
                { name: 'Appearance', navigate: './appearance', iconClass: "icon fa fa-sliders", linkClass: 'navmenu'} ];
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
        const { closedState, loggedIn } = this.props;
        let rulesetLink = this.props.rulenames.length > 0 ?
         [{ name: 'Ruleset', sublinks: this.props.rulenames, iconClass:"rules-icon", linkClass: 'link-heading'}] : [];

        rulesetLink = rulesetLink.concat(navmenu);

        let sideNav = loggedIn && closedState ? 'open' : 'closed';

        let appctx = this.context;

        return (
            <div className={`nav-container ${closedState ? 'closed': 'open'} ${appctx.background}`}>
                <div className="menu-bar">
                       <a href="" onClick={(e) => { e.preventDefault();  this.props.updateState(sideNav)}}> <span className="close-icon fa fa-reorder" ></span></a>
                </div>
                {!closedState && <div className="links-section">
                    <div>
                        <NavLinks links={rulesetLink} onConfirm={this.handleNavLink} activeIndex={this.props.activeIndex}/>
                    </div>
                    <div className="footer-container sidenav">
                        <FooterLinks links={footerLinks} />
                    </div>
                 </div>
                }
            </div>
        )
    }
}

NavigationPanel.contextType = AppearanceContext;

NavigationPanel.defaultProps = {
    closedState: false,
    rulenames: [],
    setActiveRulesetIndex: () => false,
    loggedIn: false,
    updateState: () => false,
    activeIndex: 0,
};

NavigationPanel.propTypes = {
    closedState: PropTypes.bool,
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
    loggedIn: PropTypes.bool,
    updateState: PropTypes.func,
    activeIndex: PropTypes.number,
}

export default NavigationPanel;