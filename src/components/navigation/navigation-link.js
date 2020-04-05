import React, { useState } from 'react';
import PropTypes from 'prop-types';

const NavLinks = (props) => {
    const { links } = props;
    const [visible, setVisible] = useState({0: true});
    
    const enableSublinks = (e, index) => {
      e.preventDefault();
      setVisible({[index]: !visible[index]});
    }

    return (links.map((link, index) => (
    <ul className="link-container" key={link.name}>
        <NavParentLink link={link} onConfirm={enableSublinks} index={index} visible={visible[index]} />
        { link.sublinks && link.sublinks.length > 0 && 
          <NavSubLink sublinks={link.sublinks} visible={visible[index]} onConfirm={props.onConfirm}/>
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


const NavSubLink = ({ sublinks, visible, onConfirm }) => {

    const [active, setActive] = useState('');

    const handleClick = (e, link) => {
      e.preventDefault();
      setActive(link);
      onConfirm(link);
    }

    return (sublinks.map(link => 
    (<ul className={`sublink-container ${visible ? 'visible' : ''}`} key={link}>
    <li className={`sublink ${visible ? 'visible' : ''} ${active === link ? 'active' : ''}`}>
      <a href="" className="link" onClick={(e) => handleClick(e, link)}>
          <span className="text">{link}</span>
      </a>
    </li>
  </ul>)));
}

export default NavLinks;