import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-d3-tree';


  const lineStyle = {
    stroke: '#404040',
    strokeWidth: 1,
  };

  const nodeStyle = {
    stroke: '#73879C',
    strokeWidth: 1
  };

  const nameStyle = {
      fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
      fontSize: '13px',
      fontWeight: 'bold',
      fill: '#2A3F54',
      stroke: '#2A3F54',
      strokeWidth: 0,
  }

  const attributesStyle = {
    fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
    fontSize: '14px',
    fill: '#2A3F54',
    stroke: '#2A3F54',
    strokeWidth: 0,
  }

  const treeStyle = {
    links: lineStyle,
    nodes: {
      node: {
        circle: nodeStyle,
        rect: nodeStyle,
        name: nameStyle,
        attributes: attributesStyle,
      },
      leafNode: {
        circle: nodeStyle,
        name: nameStyle,
        attributes: attributesStyle,
      },
    },
  };

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
        return(
            <div id="treeWrapper" style={{height: heightStyle}}>
        <Tree data={this.props.treeData} pathFunc={"step"} orientation="vertical" translate={this.state.axis}
        separation={{siblings: 1.4, nonSiblings: 2}} scaleExtent={{min: 0.8, max:1}} zoom={0.9} styles={treeStyle} onClick={this.handleClick} /></div>);
    }
}

TreeView.defautProps = {
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