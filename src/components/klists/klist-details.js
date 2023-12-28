import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import AddAttributes from './add-klist';
import { PanelBox } from '../panel/panel';
import AddKlists from './add-klist';


class KlistDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {removeAlert: false, successAlert: false};
        this.handleRemove = this.handleRemove.bind(this);
        this.remove = this.remove.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.updateAttribute = this.updateAttribute.bind(this);
        this.updateList = this.updateList.bind(this);
        this.clearRuleIndex = this.clearRuleIndex.bind(this);
    }

    handleEdit(e, val) {
        e.preventDefault();
        this.setState({showRuleIndex: val});
    }

    handleRemove(e, klist) {
        e.preventDefault();
        this.setState({removeAlert: true, activeKlist: klist});
        
    }

    handleDownload(e, klist) {
        e.preventDefault();
        // console.log(`in handleDownload(), klist: ${JSON.stringify(klist)}`);

        const filename = `${klist.name}-download.txt`;
        const data = klist.value.join(', ');

        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    remove() {
        const { activeKlist } = this.state;
        // console.log(`in remove(), activeKlist: ${JSON.stringify(activeKlist)}`);
        this.props.removeKlist(activeKlist, activeKlist.name);
        this.setState({ successAlert: true});
    }

    cancelAlert() {
        this.setState({ removeAlert: false, successAlert: false, showRuleIndex: -1 });
    }

    updateAttribute(attribute) {
        this.setState({ showRuleIndex: -1 });
        this.props.updateAttribute('UPDATE', attribute, this.state.showRuleIndex);
    }

    removeAlert = () => {
        return (<SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, Remove it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={this.remove}
            onCancel={this.cancelAlert}
            focusCancelBtn
          >
            You will not be able to recover the changes!
          </SweetAlert>)
    }

    successAlert = () => {
        return (<SweetAlert
            success
            title={"Attribute has been removed successfully!!"}
            onConfirm={this.cancelAlert}
          >
          </SweetAlert>);
    }

    updateList = (klist, name) => {
        this.props.uploadList(klist, name);
    }

    clearRuleIndex = () => {
        this.setState({ showRuleIndex: -1 });
    }

    render() {
    
    const { klists } = this.props;
    const { showRuleIndex } = this.state;

    // console.log(`this.props in KlistDetails: ${JSON.stringify(this.props)}`);

    // console.log(`klists in KlistDetails: ${JSON.stringify(klists)}`);
    const buttonProps = { primaryLabel: 'Save Changes', secondaryLabel: 'Cancel'};


        const keywordList = klists.map((klist, index) => (
            <div key={klist.name}>
                <PanelBox className={klist.type}>
                    <div className="name">{klist.name}</div>
                    <div className="value">{klist.value.slice(0, 3).join(', ') + (klist.value.length > 3 ? ', ...' : '')}</div>
                    <div className="menu">
                        <a href="" onClick={(e) => this.handleEdit(e, index)}>Edit</a>
                        <a href="" onClick={(e) => this.handleRemove(e, klist)}>Remove</a>
                        <a href="" onClick={(e) => this.handleDownload(e, klist)}>Download</a>
                    </div>
                </PanelBox>
                {showRuleIndex === index && <AddKlists attribute={klist} addAttribute={this.updateAttribute} cancel={this.cancelAlert} uploadList={this.props.uploadList} clearRuleIndex={this.clearRuleIndex} buttonProps={buttonProps} />
                }
            </div>
        ));

        return (<React.Fragment>
            {this.state.removeAlert && this.removeAlert()}
            {this.state.successAlert && this.successAlert()}
            {keywordList}
        </React.Fragment>
        );
    }
}


KlistDetails.defaultProps = ({
    attributes: [],
    updateAttribute: () => false,
    removeAttribute: () => false,
});

KlistDetails.propTypes = ({
    attributes: PropTypes.array,
    updateAttribute: PropTypes.func,
    removeAttribute: PropTypes.func,
});

export default KlistDetails;