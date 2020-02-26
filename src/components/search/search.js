import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Search = ({onConfirm}) => {

    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (<div className="search-container">
        <input type="text" onChange={handleSearch} className="search-field" />
        <button type="button" value="Search" onClick={onConfirm(search)} className="search-btn">Search</button>
    </div>);
};

Search.defaultProps = ({
    onConfirm: () => false,
});

Search.propTypes = ({
    onConfirm: PropTypes.func,
});

export default Search;