import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddKlists from './add-klist';
import KlistDetails from './klist-details';
import ToolBar from '../toolbar/toolbar';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { isContains } from '../../utils/stringutils';

class Klist extends Component {

    constructor(props){
        super(props);
        this.state={klNames: [], showAddKlist: false, message: Message.NO_KLIST_MSG, bannerflag: false, uploadMessage: "" };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addKlist = this.addKlist.bind(this);
        this.uploadList = this.uploadList.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.cancelAddKlist = this.cancelAddKlist.bind(this);
        this.removeKlist = this.removeKlist.bind(this);
    }

    handleAdd = () => {
        this.setState({showAddKlist: true, bannerflag: true });
    }

    addKlist = (klist) => {
        this.setState({showAddKlist: false});
        this.props.handleKlist('ADD', klist);
    }

    handleDelete = (name) => {
    }

    handleReset() {
        this.props.handleKlist('RESET');
    }

    cancelAddKlist = () => {
        this.setState({ showAddKlist: false, bannerflag: false });
    }

    removeKlist = (klist, name) => {
        // console.log(`in removeKlist in Klist class, klist: ${JSON.stringify(klist)}, name: ${name} `);
        this.props.handleKlist('REMOVE', klist, name);
    }

    uploadList(klist, name) {
        // console.log(`in uploadList, klist: ${JSON.stringify(klist)} `);

        // If name parameter is provided and it's not the same as klist.name, return an error message
        if (name && klist.name !== name) {
            console.error(`Error: The name in the klist object (${klist.name}) is not the same as the provided name parameter (${name})`);
            this.setState({ uploadMessage: `Error: The name in the klist object (${klist.name}) is not the same as the provided name parameter (${name})`});
            return;
        }

        this.props.handleKlist('UPLOAD', klist);
        this.setState({showAddKlist: false});
    }

    render() {
        const { bannerflag } = this.state;

        const buttonProps = { primaryLabel: 'Add Keyword List', secondaryLabel: 'Cancel'};
        
        console.log(`this.props.klists in Klist class ===> ${JSON.stringify(this.props.klists)}`);
        return (<div className="klists-container">
            
            { <ToolBar handleAdd={this.handleAdd} reset={this.handleReset} /> }
            
            { this.state.showAddKlist && <AddKlists addKlist={this.addKlist} cancel={this.cancelAddKlist} uploadList={this.uploadList} buttonProps={buttonProps} /> }
            
            { <KlistDetails AddKlist={this.props.AddKlist} removeKlist={this.removeKlist} uploadList={this.uploadList} klists={this.props.klists} uploadMessage={this.props.uploadMessage} /> }
            
            { !bannerflag && this.props.klists.length < 1 && <Banner message={this.state.message} onConfirm={this.handleAdd}/> }

      </div>);
    }
}

Klist.defaultProps = ({
    // handleKlist: () => false,
    klists: [],
});

Klist.propTypes = ({
    handleKlist: PropTypes.func,
    klists: PropTypes.array,
});

export default Klist;