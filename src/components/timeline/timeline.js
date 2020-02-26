import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


const iconClass = {
    backgroundColor: '#1ABB9C', 
    height: '15px',
    width: '15px'
}

const elementClass = {
    
}

class Timeline extends Component {


    renderElement() {
        const { caseAttribute } = this.props;

        return ( caseAttribute.map(attr =>  
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={iconClass} key={attr.name}
            >
                <p className="vertical-timeline-element-title">
                    <span className="badge">{attr.name}</span>
                    <span className="caption">{attr.operator}</span>
                </p>
                <p className="vertical-timeline-element-body">{attr.value}</p>
            </VerticalTimelineElement>));
    }

    render() {

        return (<VerticalTimeline layout="1-column">
            {this.renderElement()}
            </VerticalTimeline>);
    }
}

Timeline.defaultProps = ({
    caseAttribute: []
});

Timeline.propTypes = ({
    caseAttribute: PropTypes.array,
});

export default Timeline;