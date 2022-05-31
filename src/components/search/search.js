import React, {useState} from 'react';
import PropTypes from 'prop-types';

const Search = ({onChange}) => {

    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onChange(e.target.value);
    };

    return (<div className="search-container">
        <input type="text" onChange={handleSearch} className="search-field" value={search} placeholder="Search using name or type" />
    </div>);
};

Search.defaultProps = ({
    value: '',
    onChange: () => false,
});

Search.propTypes = ({
    value: PropTypes.string,
    onChange: PropTypes.func,
});

export default Search;