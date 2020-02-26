import React from 'react';
import PropTypes from 'prop-types';

const Panel = (props) => {

    return (<div className="panel-wrapper">
        {props.title && <h2>{props.title}</h2>}
        {props.children}
    </div>);
};




Panel.defaultProps = {
    title: undefined,
    children: {},
  };
  
Panel.propTypes = {
    title: PropTypes.string,
    children: PropTypes.object,
};


export const PanelBox = (props) => {

    return (<div className="panel-box-wrapper">
        {props.children}
    </div>);
}


PanelBox.defaultProps = {
    children: {},
  };
  
  PanelBox.propTypes = {
    children: PropTypes.any,
};


export default Panel;