import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Search = ({onConfirm, value}) => {

    const [search, setSearch] = useState(value);

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
    value: '',
});

Search.propTypes = ({
    onConfirm: PropTypes.func,
    value: PropTypes.string,
});

export default Search;