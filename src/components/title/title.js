import React from 'react';
import PropTypes from 'prop-types';

const Title = (props) => {

  return (
    <div className="header-container">
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