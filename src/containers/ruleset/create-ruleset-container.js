import React, { Component } from 'react';
import { TitlePanel } from '../../components/panel/panel';
import InputField from '../../components/forms/input-field';
import Button from '../../components//button/button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { includes } from 'lodash/collection';
import { createHashHistory } from 'history';
import { addRuleset } from '../../actions/ruleset';

class CreateRulesetContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {name: '', error: {}};
        this.onChangeName = this.onChangeName.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    onChangeName(e) {
        this.setState({name:e.target.value});
    }

    handleAdd(){
        const history = createHashHistory();
        if (!this.state.name || !this.state.name.trim()) {
            this.setState({error: {name: 'Please specify value'}});
        } else if (includes(this.props.rulesetnames, this.state.name)) {
            this.setState({error: {name: 'Please specify value'}});
        } else {
            this.props.addRuleset(this.state.name);
            history.push('./ruleset');
        }
        
    }

    render() {

        return (
            <div className="single-panel-container">
                <TitlePanel title="Add Ruleset" titleClass="fa fa-plus-square-o">
                    <form>
                        <div className="upload-panel">
                            <InputField label="Name" onChange={this.onChangeName} value={this.state.name} error={this.state.error.name} />
                            <Button label={'Add ruleset'} onConfirm={this.handleAdd} classname="primary-btn" type="submit" />
                        </div>
                    </form>
                </TitlePanel>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    rulesetnames: state.ruleset.rulesets.map(r => r.name),
})

const mapDispatchToProps = dispatch => ({
    addRuleset: (name) => dispatch(addRuleset(name))
});

CreateRulesetContainer.defaultProps = {
    addRuleset: () => false,
    rulesetnames: [],
};

CreateRulesetContainer.propTypes = {
    rulesetnames: PropTypes.array,
    addRuleset: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRulesetContainer);