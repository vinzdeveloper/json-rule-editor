import React, {Component} from 'react';
import { connect } from 'react-redux';
import Title from '../../components/title/title';
import NavigationPanel from '../../components/navigation/navigation-panel';
import AppRoutes from '../../routes/app-routes';
import { createHashHistory } from 'history';
import PropTypes from 'prop-types';
import { updateRulesetIndex } from '../../actions/ruleset';
class ApplicationContainer extends Component {

    constructor(props){
        super(props);
        const history = createHashHistory();
        this.state = {closednav: true};
         this.unlisten = history.listen((location) => {
            if (location.pathname.indexOf('ruleset') > -1) {
                this.setState({closednav: false});
            }
        });
    }

    componentWillUnmount() {
        if (this.unlisten){
            this.unlisten();
        }
    }

    render() {
        return(
            <React.Fragment>
              <Title title={'Rule Editor'} />
              <NavigationPanel closedState={this.state.closednav} rulenames={this.props.rulenames} setActiveRulesetIndex={this.props.setActiveRulesetIndex} />
              <AppRoutes closedState={this.state.closednav}/>
            </React.Fragment>
        )
    }
}

ApplicationContainer.defaultProps = {
    rulenames: [],
    setActiveRulesetIndex: () => false,
};

ApplicationContainer.propTypes = {
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
}


const mapStateToProps = (state, ownProps) => ({
    name: state.app.name,
    rulenames: state.ruleset.rulesets.map(r => r.name),
    ownProps
});

const mapDispatchToProps = (dispatch) => ({
    handleClick: () => {
        return false;
    },
    setActiveRulesetIndex: (name) => dispatch(updateRulesetIndex(name))

});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);