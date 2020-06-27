import React from 'react';
import PropTypes from 'prop-types';
import { TitleIcon } from '../title/page-title';

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
    children: PropTypes.any,
};


export const PanelBox = (props) => {

    return (<div className={`panel-box-wrapper ${props.className}-type`}>
        {props.children}
    </div>);
}


PanelBox.defaultProps = {
    children: {},
    className: '',
  };
  
  PanelBox.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
};

export const TitlePanel = (props) => {

    return (<div className={"title-panel"}>
        <div className="title">
        {props.titleClass && 
            <div>
                {props.titleClass && <TitleIcon iconClass={props.titleClass} name={props.title} />}
            </div>}
        <h3>{props.title}</h3>
        </div>
        {props.children}
    </div>);
}


TitlePanel.defaultProps = {
    children: {},
    titleClass: '',
    title: '',
  };
  
TitlePanel.propTypes = {
    children: PropTypes.any,
    titleClass: PropTypes.string,
    title: PropTypes.string,
};


export default Panel;