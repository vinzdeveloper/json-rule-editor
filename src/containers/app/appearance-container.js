import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppearanceContext from '../../context/apperance-context';

const themes = [{ name: 'Light', value: "light", class: 'light-mode'},
                { name: 'Dark', value: "dark", class: 'dark-mode' },
                { name: 'Midnight Blue', value: "md-blue", class: 'mdblue-mode' }];

class AppearanceContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { toggleBackground, background } = this.context;
        return(<div>
            <h3>Theme</h3>
            <div className="theme-container">
                { themes.map(theme => (<div className="theme-icon" key={theme.value}>
                    <span className={theme.class}></span>
                    <div><input type="radio" name="themeMode" value={theme.value} checked={ background === theme.value }
                        onClick={(e) => toggleBackground(e.target.value)}/>{theme.name}</div>
                    </div>))
                }
            </div>
        </div>);
    }

}

AppearanceContainer.contextType = AppearanceContext;

const mapStateToProps = () => {};

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(AppearanceContainer);