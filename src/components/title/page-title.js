import React from 'react';
import PropTypes from 'prop-types';

const PageTitle = ({name, titleFlag}) => {
    
    return (<div className="page-title">
        {titleFlag && <TitleIcon />}
        <div><h1>{name}</h1></div>
    </div>);
};

PageTitle.defaultProps = {
    name: '',
    classname: '',
    titleFlag: false,
};

PageTitle.propTypes = {
    name: PropTypes.string,
    classname: PropTypes.string,
    titleFlag: PropTypes.bool,
}


export const TitleIcon = ({iconClass}) => {

    return (<div className="icon-card">
        <span className={iconClass} />
    </div>);
};

TitleIcon.defaultProps = {
    iconClass: '',
};

TitleIcon.propTypes = {
    iconClass: PropTypes.string,
}

export default PageTitle;