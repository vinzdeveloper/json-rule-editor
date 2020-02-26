import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageTitle from '../../components/title/page-title';
import Tabs from '../../components/tabs/tabs';
import Attributes from '../../components/attributes/attributes';
import Decisions from '../../components/decisions/decision';
import { handleAttribute, resetAttribute } from '../../actions/attributes';
import { handleDecision } from '../../actions/decisions';

class HomeContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {activeTab: 'Attributes'};
    }

    tabs = [{name: 'Attributes'}, {name: 'Decisions'}]

    handleTab = (tabName) => {
        this.setState({activeTab: tabName});
    }

    render() {
      const { attributes, decisions } = this.props.ruleset;
      return <div>
        <PageTitle name="Home Container" />
        <Tabs tabs={this.tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
        <div className="tab-page-container">
            {this.state.activeTab === 'Attributes' && <Attributes attributes={attributes} 
              handleAttribute={this.props.handleAttribute }/>}
            {this.state.activeTab === 'Decisions' && <Decisions decisions={decisions} attributes={attributes}
             handleRuleCase={this.props.handleDecisions} />}
        </div>
      </div>
    }
}

HomeContainer.propTypes = {
  ruleset: PropTypes.object,
  handleAttribute: PropTypes.func,
  handleDecisions: PropTypes.func,
}

HomeContainer.defaultProps = {
  ruleset: [],
  handleAttribute: () => false,
  handleDecisions: () => false,
}

const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
});

const mapDispatchToProps = (dispatch) => ({

  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision, index) => dispatch(handleDecision(operation, decision, index)),


});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);