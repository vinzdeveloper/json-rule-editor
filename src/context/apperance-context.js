import React from 'react';

const theme = {
    background: 'light',
    toggleBackground: () => {},
};

const ApperanceContext = React.createContext(theme);

export default ApperanceContext;