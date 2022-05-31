import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ApperanceContext from '../../context/apperance-context';

const ButtonGroup = ({ buttons, onConfirm }) => {
    const { background } = useContext(ApperanceContext);

    return (<div className={`btn-group-container ${background}`}>
        {buttons.length > 0 && buttons.map(button => 
        <div key={button.label} className={`btn-grp`}>
            <button onClick={() => onConfirm(button.label)} type="button" className={button.active ? 'active': undefined}
             disabled={button.disable}>{button.label}</button>
        </div>)}
    </div>)
};

ButtonGroup.defaultProps = {
    buttons: [],
    onConfirm: () => false
};

ButtonGroup.propTypes = {
    buttons: PropTypes.array,
    onConfirm: PropTypes.func
};

export default ButtonGroup;
