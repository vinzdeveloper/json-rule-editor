import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const Notification = (props) => {

    useEffect(() => {
        NotificationManager[props.type](props.body, props.heading, 5000);
    })

    return (<NotificationContainer/>);

};

Notification.defaultProps = {
    body: '',
    heading: '',
    type: 'warning',
};

Notification.propTypes = {
    body: PropTypes.string,
    heading: PropTypes.string,
    type: PropTypes.string,
};

export default memo(Notification);