import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppearanceContext from '../../context/apperance-context';

const themes = [{ name: 'Light', value: "light", src: '../../assets/icons/light-mode.png'},
                { name: 'Dark', value: "dark", src: '../../assets/icons/dark-mode.png' },
                { name: 'Midnight Blue', value: "md-blue", src: '../../assets/icons/mdblue-mode.png' }];

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
                    <img src={theme.src} alt></img>
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