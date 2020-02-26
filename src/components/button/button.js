import React from 'react';
import PropTypes from 'prop-types';

const Button = ({label, onConfirm, classname, type}) => {

    return (<div className="btn-container">
        <button className={`btn ${classname}`} type={type} onClick={onConfirm}>{label}</button>
    </div>);
};




Button.defaultProps = {
    classname: 'primary-btn',
    onConfirm: () => undefined,
    label: '',
    type: 'button',
  };
  
Button.propTypes = {
    classname: PropTypes.string,
    onConfirm: PropTypes.func,
    label: PropTypes.string,
    type: PropTypes.string,
};


export default Button;