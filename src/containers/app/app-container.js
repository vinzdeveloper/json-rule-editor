import React, {Component} from 'react';
import { connect } from 'react-redux';
import Title from '../../components/title/title';
import NavigationPanel from '../../components/navigation/navigation-panel';
import AppRoutes from '../../routes/app-routes';
import PropTypes from 'prop-types';
import { updateRulesetIndex } from '../../actions/ruleset';
class ApplicationContainer extends Component {

    constructor(props){
        super(props);
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
              <Title title={'Rule Editor'} />
              <NavigationPanel closedState={closednav}
                    rulenames={this.props.rulenames} setActiveRulesetIndex={this.props.setActiveRulesetIndex} />
              <AppRoutes closedState={closednav} loggedIn={this.props.loggedIn} />
            </React.Fragment>
        )
    }
}

ApplicationContainer.defaultProps = {
    rulenames: [],
    setActiveRulesetIndex: () => false,
    navState: undefined,
    activeIndex: undefined,
    loggedIn: false,
};

ApplicationContainer.propTypes = {
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
    navState: PropTypes.string,
    loggedIn: PropTypes.bool,
}


const mapStateToProps = (state, ownProps) => ({
    navState: state.app.navState,
    rulenames: state.ruleset.rulesets.map(r => r.name),
    loggedIn: state.app.loggedIn,
    ownProps
});

const mapDispatchToProps = (dispatch) => ({
    handleClick: () => {
        return false;
    },
    setActiveRulesetIndex: (name) => dispatch(updateRulesetIndex(name))

});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);