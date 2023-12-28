
/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageTitle from '../../components/title/page-title';
import Tabs from '../../components/tabs/tabs';
import Klist from '../../components/klists/klist';
import Decisions from '../../components/decisions/decision';
import ValidateRules from '../../components/validate/validate-rules';
import { handleKlist } from '../../actions/klists';
import { handleDecision } from '../../actions/decisions';
import Banner from '../../components/panel/banner';
import * as Message from '../../constants/messages';
import { groupBy } from 'lodash/collection';
import RuleErrorBoundary from '../../components/error/ruleset-error';
import SweetAlert from 'react-bootstrap-sweetalert';

// const tabs = [{ name: 'Facts' }, { name: 'Decisions' }, { name: 'Validate' }, { name: 'Generate' }, { name: 'Apply' }];
const tabs = [{ name: 'Decisions' }, { name: 'Keyword Lists'}, { name: 'Validate' }, { name: 'Generate' }, { name: 'Apply' }];

class RulesetContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      activeTab: 'Decisions', 
      klNames: [],
      generateFlag: false, 
      applyFlag: false, 
      applyErrFlag: false };
    this.generateFile = this.generateFile.bind(this);
    this.cancelAlert = this.cancelAlert.bind(this);
    this.sendJson = this.sendJson.bind(this);
    this.getKlnames = this.getKlnames.bind(this);
  }

  handleTab = (tabName) => {
    this.setState({ activeTab: tabName });
  }

  generateFile() {
    const { ruleset } = this.props;
    console.log(`ruleset == ${ruleset}`);
    const fileData = JSON.stringify(ruleset, null, '\t');
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = ruleset.name + '.json';
    link.href = url;
    link.click();
    this.setState({ generateFlag: true });
  }

  sendJson() {
    const { ruleset } = this.props;
    const fileData = JSON.stringify(ruleset, null, '\t');

    console.log(`The JSON body is: ${fileData}`);

    fetch('http://localhost:3000/receive-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: fileData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        this.setState({ applyFlag: true });
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.message === 'Failed to fetch') {
          console.error('Network error. Is the server running?');
        }
        this.setState({ applyErrFlag: true });
      });
  }

  cancelAlert() {
    this.setState({ generateFlag: false });
    this.setState({ applyFlag: false });
    this.setState({ applyErrFlag: false });
  }

  successAlert = () => {
    const { name } = this.props.ruleset;
    return (<SweetAlert
      success
      title={"File generated!"}
      onConfirm={this.cancelAlert}
    > {`${name} rule is successfully generated at your default download location`}
    </SweetAlert>);
  }

  applyAlert = () => {
    const { name } = this.props.ruleset;
    return (<SweetAlert
      success
      title={"Rule applied!"}
      onConfirm={this.cancelAlert}
    > {`${name} rule is successfully applied to the remote server.`}
    </SweetAlert>);
  }

  applyErrAlert = () => {
    const { name } = this.props.ruleset;
    return (<SweetAlert
      success
      title={"Rule Apply Failed!"}
      onConfirm={this.cancelAlert}
    > {`${name} rule is not applied to the remote server.`}
    </SweetAlert>);
  }

  getKlnames = () => {
    const { keywords: klists } = this.props.ruleset;
    console.log(`klists in ruleset-container: ${JSON.stringify(klists)}`);
    const klNames = klists.map(klist => klist.name);
    console.log(`klNames in ruleset-container: ${JSON.stringify(klNames)}`);
    return klNames;
  }

  render() {
    const { attributes, decisions, name, keywords: klists } = this.props.ruleset;
    // console.log(`klists in RulesetContainer: ${JSON.stringify(klists)}`);
    const indexedDecisions = decisions && decisions.length > 0 &&
      decisions.map((decision, index) => ({ ...decision, index }));

    let outcomes = indexedDecisions; // The group by operation type is not needed.
    // if (indexedDecisions && indexedDecisions.length > 0) {
    //   outcomes = groupBy(indexedDecisions, data => data.event.type);
    // }

    const message = this.props.updatedFlag ? Message.MODIFIED_MSG : Message.NO_CHANGES_MSG;
    const apply_message = this.props.updatedFlag ? Message.APPLY_MSG : Message.NO_CHANGES_MSG;

    return <div>
      <RuleErrorBoundary>
        <PageTitle name={name} />
        <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
        <div className="tab-page-container">
          {this.state.activeTab === 'Keyword Lists' && <Klist klists={klists}
            handleKlist={this.props.handleKlist} />}
          {this.state.activeTab === 'Decisions' && <Decisions decisions={indexedDecisions || []} attributes={attributes}
            handleDecisions={this.props.handleDecisions} getKlnames={this.getKlnames} outcomes={outcomes} />}
          {this.state.activeTab === 'Validate' && <ValidateRules attributes={attributes} decisions={decisions} />}
          {this.state.activeTab === 'Generate' && <Banner message={message} ruleset={this.props.ruleset} onConfirm={this.generateFile} />}
          {this.state.activeTab === 'Apply' && <Banner message={apply_message} ruleset={this.props.ruleset} onConfirm={this.sendJson} />}
          {this.state.generateFlag && this.successAlert()}
          {this.state.applyFlag && this.applyAlert()}
          {this.state.applyErrFlag && this.applyErrAlert()}
        </div>
      </RuleErrorBoundary>
    </div>
  }
}

RulesetContainer.propTypes = {
  ruleset: PropTypes.object,
  handleKlist: PropTypes.func,
  handleDecisions: PropTypes.func,
  updatedFlag: PropTypes.bool,
  runRules: PropTypes.func,
}

RulesetContainer.defaultProps = {
  ruleset: {},
  handleKlist: () => false,
  handleDecisions: () => false,
  updatedFlag: false,
}

const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
  updatedFlag: state.ruleset.updatedFlag,
});

const mapDispatchToProps = (dispatch) => ({
  handleKlist: (operation, klist, name) => dispatch(handleKlist(operation, klist, name)),
  handleDecisions: (operation, decision, metadata = {}) => dispatch(handleDecision(operation, decision, metadata)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesetContainer);