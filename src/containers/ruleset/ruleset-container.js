
/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageTitle from '../../components/title/page-title';
import Tabs from '../../components/tabs/tabs';
import Attributes from '../../components/attributes/attributes';
import Decisions from '../../components/decisions/decision';
import ValidateRules from '../../components/validate/validate-rules';
import { handleAttribute } from '../../actions/attributes';
import { handleDecision } from '../../actions/decisions';
import Banner from '../../components/panel/banner';
import * as Message from '../../constants/messages';
import { groupBy } from 'lodash/collection';
import RuleErrorBoundary from '../../components/error/ruleset-error';
import SweetAlert from 'react-bootstrap-sweetalert';

const tabs = [{name: 'Facts'}, {name: 'Decisions'}, {name: 'Validate'}, {name: 'Generate'}];
class RulesetContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {activeTab: 'Facts', generateFlag: false };
        this.generateFile = this.generateFile.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
    }

    handleTab = (tabName) => {
        this.setState({activeTab: tabName});
    }

    generateFile() {
      const { ruleset } = this.props;
      const fileData = JSON.stringify(ruleset, null,'\t');
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = ruleset.name +'.json';
      link.href = url;
      link.click();
      this.setState({ generateFlag: true });
    }

    cancelAlert() {
      this.setState({ generateFlag: false })
    }

    successAlert = () => {
      const { name } = this.props.ruleset;
      return (<SweetAlert
          success
          title={"File generated!"}
          onConfirm={this.cancelAlert}
        > {`${name} rule is succefully generated at your default download location`}
        </SweetAlert>);
    }

    render() {
      const { attributes, decisions, name } = this.props.ruleset;

      const indexedDecisions = decisions && decisions.length > 0 && 
          decisions.map((decision, index) => ({ ...decision, index }));
  
      let outcomes;
      if (indexedDecisions && indexedDecisions.length > 0) {
          outcomes = groupBy(indexedDecisions, data => data.event.type);
      }

      const message = this.props.updatedFlag ? Message.MODIFIED_MSG : Message.NO_CHANGES_MSG;
  
      return <div>
        <RuleErrorBoundary>
          <PageTitle name={name} />
          <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
          <div className="tab-page-container">
              {this.state.activeTab === 'Facts' && <Attributes attributes={attributes} 
                handleAttribute={this.props.handleAttribute }/>}
              {this.state.activeTab === 'Decisions' && <Decisions decisions={indexedDecisions || []} attributes={attributes}
              handleDecisions={this.props.handleDecisions} outcomes={outcomes}/>}
              {this.state.activeTab === 'Validate' && <ValidateRules attributes={attributes} decisions={decisions} />}
              {this.state.activeTab === 'Generate' && <Banner message={message} ruleset={this.props.ruleset} onConfirm={this.generateFile}/> }
              {this.state.generateFlag && this.successAlert()}
          </div>
        </RuleErrorBoundary>
      </div>
    }
}

RulesetContainer.propTypes = {
  ruleset: PropTypes.object,
  handleAttribute: PropTypes.func,
  handleDecisions: PropTypes.func,
  updatedFlag: PropTypes.bool,
  runRules: PropTypes.func,
}

RulesetContainer.defaultProps = {
  ruleset: {},
  handleAttribute: () => false,
  handleDecisions: () => false,
  updatedFlag: false,
}

const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
  updatedFlag: state.ruleset.updatedFlag,
});

const mapDispatchToProps = (dispatch) => ({
  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesetContainer);