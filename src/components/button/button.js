import React from 'react';
import PropTypes from 'prop-types';

const Button = ({label, onConfirm, classname, type, disabled }) => {

    return (<div className="btn-container">
        <button className={`btn ${classname}`} type={type} onClick={onConfirm} disabled={disabled} >{label}</button>
    </div>);
};




Button.defaultProps = {
    classname: 'primary-btn',
    onConfirm: () => undefined,
    label: '',
    type: 'button',
    disabled: false, 
  };
  
Button.propTypes = {
    classname: PropTypes.string,
    onConfirm: PropTypes.func,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
};


export default Button;