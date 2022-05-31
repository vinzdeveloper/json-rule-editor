import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-d3-tree';
import ApperanceContext from '../../context/apperance-context';
import TreeStyle from './tree-style';

const transformDepth = (count) => {
    if (count < 1) {
        return '15em';
    } else if (count < 2) {
        return '20em';
    } else if (count < 3) {
        return '25em';
    } else if (count < 4) {
        return '35em';
    } else if (count < 5) {
        return '40em';
    } else if (count < 6) {
        return '50em';
    } else {
        return '60em';
    }
}

class TreeView extends Component {
    constructor(props) {
        super(props);
        const { innerWidth: width } = window;
        this.state = {axis: { x: (width/2) - 250, y: 20}};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    handleClick(e) {
        this.props.onConfirm(e);
    }


    updateWindowDimensions() {
        const { innerWidth: width } = window;
        this.setState({axis: { x: (width/2) - 250, y: 0}});
    }

    render() {
        const heightStyle = transformDepth(this.props.count);
        const { background } = this.context;
        const nodeStyle = TreeStyle(background);
        return(
            <div id="treeWrapper" style={{height: heightStyle}}>
        <Tree data={this.props.treeData} pathFunc={"step"} orientation="vertical" translate={this.state.axis}
        separation={{siblings: 1.4, nonSiblings: 2}} scaleExtent={{min: 0.8, max:1}} zoom={0.9} styles={nodeStyle} onClick={this.handleClick} /></div>);
    }
}

TreeView.contextType = ApperanceContext;

TreeView.defaultProps = {
    treeData: {},
    count: 0,
    onConfirm: () => false,
};

TreeView.propTypes = {
    treeData: PropTypes.object,
    count: PropTypes.number,
    onConfirm: PropTypes.func,
}

export default TreeView;