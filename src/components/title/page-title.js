import React from 'react';
import PropTypes from 'prop-types';

const PageTitle = ({name}) => {
    
    return (<div className="page-title">
        <TitleIcon iconClass="rule-icon" />
        <div><h1>{name}</h1></div>
    </div>);
};

PageTitle.defaultProps = {
    name: '',
    classname: '',
};

PageTitle.propTypes = {
    name: PropTypes.string,
    classname: PropTypes.string,
}

export const TitleIcon = ({iconClass}) => {

    return (<div className="icon-card">
        <span className={iconClass} />
    </div>);
};

export default PageTitle;