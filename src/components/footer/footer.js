import React from 'react';
import PropTypes from 'prop-types';

const FooterLinks = (props) => {
    return (
        props.links && props.links.map(link => (
            <div key={link.label}>
                {link.src &&
                    <a href={link.src} target='_blank' rel="noopener noreferrer">{link.label} </a>
                }
                {!link.src &&
                    <span>{link.label}</span>
                }
            </div>
        ))
    )
};

FooterLinks.defaultProps = {
    links: [],
};

FooterLinks.propTypes = {
    links: PropTypes.array
};

export default FooterLinks;

