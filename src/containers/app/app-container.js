import React, {Component} from 'react';
import { connect } from 'react-redux';
import Title from '../../components/title/title';
import NavigationPanel from '../../components/navigation/navigation-panel';
import AppRoutes from '../../routes/app-routes';
import PropTypes from 'prop-types';
import { updateRulesetIndex } from '../../actions/ruleset';
import { updateState } from '../../actions/app';
import { createHashHistory } from 'history';
class ApplicationContainer extends Component {

    constructor(props){
        super(props);
        const history = createHashHistory();
        if (!this.props.loggedIn) {
            history.push('./home');
        }
    }

    componentWillUnmount() {
        if (this.unlisten){
            this.unlisten();
        }
    }

    render() {
        const closednav = this.props.navState !== 'open';
        return(
            <React.Fragment>
              <Title title={'Json Rule Editor'} />
              <NavigationPanel closedState={closednav} updateState={this.props.updateState} activeIndex={this.props.activeIndex}
                    rulenames={this.props.rulenames} setActiveRulesetIndex={this.props.setActiveRulesetIndex} loggedIn={this.props.loggedIn}/>
              <AppRoutes closedState={closednav} loggedIn={this.props.loggedIn} />
            </React.Fragment>
        )
    }
}

ApplicationContainer.defaultProps = {
    rulenames: [],
    setActiveRulesetIndex: () => false,
    navState: undefined,
    activeIndex: 0,
    loggedIn: false,
    updateState: () => false,
};

ApplicationContainer.propTypes = {
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
    navState: PropTypes.string,
    loggedIn: PropTypes.bool,
    updateState: PropTypes.func,
    activeIndex: PropTypes.number,
}


const mapStateToProps = (state, ownProps) => ({
    navState: state.app.navState,
    rulenames: state.ruleset.rulesets.map(r => r.name),
    loggedIn: state.app.loggedIn,
    activeIndex: state.ruleset.activeRuleset,
    ownProps
});

const mapDispatchToProps = (dispatch) => ({
    handleClick: () => {
        return false;
    },
    setActiveRulesetIndex: (name) => dispatch(updateRulesetIndex(name)),
    updateState: (val) => dispatch(updateState(val)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);