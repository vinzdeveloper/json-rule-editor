import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Tabs = ({tabs, onConfirm, activeTab}) => {

    const [active, setActive] = useState(activeTab);

    const setActiveTab = (value) => {
      setActive(value);
      onConfirm(value);
    }

    return (<div className="tab-container">
        { tabs.map(tab => (
           <div key={tab.name} className={`tab ${tab.name === active ? 'active' : ''}`} onClick={ () => setActiveTab(tab.name) }>
               {tab.name}
           </div> 
        )) }
    </div>);
};

Tabs.defaultProps = ({
    tabs: [],
    onConfirm: () => undefined,
    activeTab: '',
});

Tabs.propTypes = ({
    tabs: PropTypes.array,
    onConfirm: PropTypes.func,
    activeTab: PropTypes.string
});

export default Tabs;

