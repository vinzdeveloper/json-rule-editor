import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import AppearanceContext from '../../context/apperance-context';

const Title = (props) => {
  const appctx = useContext(AppearanceContext);
  return (
    <div className={`header-container ${appctx.background}`}>
      <div>
        {props.title}
      </div>
        
    </div>
)};

Title.defaultProps = {
  title: 'Json Rule Editor',
};

Title.propTypes = {
  title: PropTypes.string,
}

export default Title;