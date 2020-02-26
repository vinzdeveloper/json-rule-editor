import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Timeline from '../timeline/timeline';
import { PanelBox } from '../panel/panel';
import 'font-awesome/css/font-awesome.min.css';

class DecisionDetails extends Component {

    static getDerivedStateFromProps(props, state) {
        if (props.decisions.length !== state.showCase.length) {
            const showCase = props.decisions.map((decision, index) =>
            ({case: false, edit: false, index }));
            return { showCase };
        }
        return undefined;
    }

    constructor(props) {
        super(props);
        const showCase = props.decisions.map((decision, index) =>
           ({case: false, edit: false, index })
        )
        this.state = { showCase };
        this.handleExpand = this.handleExpand.bind(this);
        this.editCase = this.editCase.bind(this);
    }


    handleEdit(e, val) {
        e.preventDefault();
        this.setState({showRuleIndex: val});
    }

    editCase(e, caseAttribute, caseIndex, decisionIndex) {
        e.preventDefault();
        this.props.editCase(caseAttribute, caseIndex, decisionIndex);
    }

    handleExpand(e, index) {
        e.preventDefault();
        const cases = [...this.state.showCase];
        let updateCase  = cases[index];
        updateCase = {case: !updateCase.case}
        cases[index] = {...updateCase};
        this.setState({showCase: cases});
    }

    handleRemove(e) {
        e.preventDefault();
    }

    renderCases = (cases, decisionIndex) => {
        return (<div className="rule-flex-container">
         { cases && cases.map((caseAttribute, caseIndex) => (<div className="decision-box" key={`case - ${caseAttribute.length}`}>
            <div className="tool-flex">
                <div><a href="" onClick={(e) => this.editCase(e, caseAttribute, caseIndex, decisionIndex)}><span className="fa fa-edit" /></a></div>
                <div><a href="" onClick=""><span className="fa fa-trash-o" /></a></div>
            </div>
            <Timeline caseAttribute={caseAttribute} />
            </div>))}
        </div>)
    }

    render() {
        const { decisions } = this.props;
        const { showCase} = this.state;

        const decisionList = decisions.map((decision, index) =>
            (<div key={decision.outcome}>
                <PanelBox>
                    <div>{index + 1}</div>
                    <div>{String(decision.outcome)}</div>
                    <div><span className={decision.type}>{decision.type}</span></div>
                    <div>{`cases(${decision.cases.length})`}</div>
                    <div>
                        <a href="" onClick={(e) => this.handleExpand(e, index)}> { showCase[index].case ? 'Collapse' : 'Expand' }</a>
                        <a href="" onClick={this.handleRemove}>Remove</a>
                    </div>
                 </PanelBox>
                 { showCase[index].case && this.renderCases(decision.cases, index)}
            </div>));

        return (<div className="">
            { decisionList }
        </div>);
    }
}

DecisionDetails.defaultProps = ({
    decisions: [],
    editCase: () => false,
});

DecisionDetails.propTypes = ({
    decisions: PropTypes.array,
    editCase: PropTypes.func,
});

export default DecisionDetails;