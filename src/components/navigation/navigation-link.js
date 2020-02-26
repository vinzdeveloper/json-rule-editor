import React, { useState } from 'react';
import PropTypes from 'prop-types';

const NavLinks = (props) => {
    const { links } = props;
    const [visible, setVisible] = useState({0: false});
    
    const enableSublinks = (e, index) => {
      e.preventDefault();
      setVisible({[index]: !visible[index]});
    }

    return (links.map((link, index) => (
    <ul className="link-container" key={link.name}>
        <NavParentLink link={link} onConfirm={enableSublinks} index={index} visible={visible[index]} />
        { link.sublinks && link.sublinks.length > 0 && 
          <NavSubLink sublinks={link.sublinks} visible={visible[index]} />
        }
    </ul>)));
};

const NavParentLink = ({ link, onConfirm, index, visible }) => {
    return (
    <li className="link-heading">
      <a href="" className={`link ${visible ? 'active': ''}`} onClick={(e) => onConfirm(e, index)}>
        <span className={link.iconClass} />
        <span className="text">{link.name}</span>
      </a>
    </li>);
};

NavParentLink.defaultProps = {
  link: {},
  onConfirm: () => undefined,
  index: 0,
  visible: false,
};

NavParentLink.propTypes = {
  link: PropTypes.object,
  onConfirm: PropTypes.func,
  index: PropTypes.number,
  visible: PropTypes.bool,
};


const NavSubLink = ({ sublinks, visible }) => {

    return (sublinks.map(link => 
    (<ul className={`sublink-container ${visible ? 'visible' : ''}`} key={link.name}>
    <li className={`sublink ${visible ? 'visible' : ''}`}>
      <a href="" className="link">
          <span className="text">{link.name}</span>
      </a>
    </li>
  </ul>)));
}

export default NavLinks;