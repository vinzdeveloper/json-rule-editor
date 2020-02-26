import React from 'react';
import PropTypes from 'prop-types';


const NavButton = ({ classname, onConfirm, label }) => {
    return (<div className='nav-btn'>
        <button type="button" className={classname} onClick={onConfirm}>
            {label}
        </button>
    </div>);
};

NavButton.defaultProps = {
    classname: '',
    onConfirm: () => undefined,
    label: '',
  };
  
NavButton.propTypes = {
    classname: PropTypes.string,
    onConfirm: PropTypes.func,
    label: PropTypes.string
};



export default NavButton;