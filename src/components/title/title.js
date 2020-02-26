import React from 'react';
import PropTypes from 'prop-types';

const Title = (props) => (
    <div className="header-container">
        {props.title}
    </div>
);

Title.defaultProps = {
  title: 'Rule Editor'
};

Title.propTypes = {
  title: PropTypes.string,
}

export default Title;