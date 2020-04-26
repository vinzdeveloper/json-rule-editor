import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Search = ({onConfirm, onChange}) => {

    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onChange(e.target.value);
    };

    return (<div className="search-container">
        <input type="text" onChange={handleSearch} className="search-field" value={search}/>
        <button type="button" value="Search" onClick={() => onConfirm(search)} className="search-btn">Search</button>
    </div>);
};

Search.defaultProps = ({
    onConfirm: () => false,
    value: '',
    onChange: () => false,
});

Search.propTypes = ({
    onConfirm: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func,
});

export default Search;